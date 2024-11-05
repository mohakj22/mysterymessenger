/* eslint-disable */
// Disables all ESLint rules

/* tslint:disable */
// Disables TSLint rules if you're using TSLint

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCard } from "@/components/MessageCard";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
const lines = [
  "🚀 Grab your one-of-a-kind username and share it with the world to start receiving awesome messages! Do not keep it to yourself!",
  "🌟 Share your unique username and let the message magic begin! Everyone is waiting to connect with you!",
  "🎉 Show off your exclusive username and unlock a flood of messages! Spread the word and let the fun begin!",
  "✨ Your unique username is your ticket to connection! Share it far and wide to start receiving heartfelt messages today!",
  "💌 Your exclusive username is the key to a vibrant message board! Share it with your friends and let the conversations flow!",
];
function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [randomLine, setRandomLine] = useState("");
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDeleteMessage = (messageID: string) => {
    // console.log("Deleting message ID:", messageID);
    setMessages(
      messages.filter((message) => message._id?.toString() !== messageID)
    );
  };

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    // console.log("Fetching accept message setting...");
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
      // console.log("Fetched acceptMessages:", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh = false) => {
      // console.log("Fetching messages...");
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        // console.log("Messages fetched:", response.data.messages);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * lines.length);
    setRandomLine(lines[randomIndex]);
  }, [lines]);

  const handleSwitchChange = async () => {
    // console.log("Toggling acceptMessages...");
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Don't Know",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="m-auto">
        <Carousel className="w-full items-center max-w-lg md:max-w-xl">
          <CarouselContent>
            <CarouselItem>
              <Card className="items-center animated-gradient-button-dark border-0">
                <CardHeader>
                  <CardTitle>Please Log-in</CardTitle>
                </CardHeader>
              </Card>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  const { username } = session.user;
  const profileUrl = username;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Username Copied!",
      description: "Username copied",
    });
  };
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-black rounded w-full max-w-6xl text-white">
      <h1 className="text-4xl font-bold mb-4 gradient-text">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-[#888] font-semibold mb-2">{randomLine}</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 text-white bg-gray-800 bg-opacity-50 backdrop-blur-md border-white"
          />
          <Button
            onClick={copyToClipboard}
            className="animated-gradient-button  text-white"
          >
            Copy
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Link href="/message">
          <div className="relative inline-block">
            <Button className="animated-gradient-button">Send Message</Button>
          </div>
        </Link>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          style={{
            backgroundColor: acceptMessages ? "#d97706" : "gray",
          }}
        />
        <span className="ml-2 text-white">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator className="my-4 border-2 border-gray-900" />

      <Button
        className="mt-4 bg-white text-black"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id?.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-white">No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
