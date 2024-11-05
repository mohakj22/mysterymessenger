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
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/schemas/messageSchema";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from "usehooks-ts";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

function Page() {
  const [username, setUsername] = useState("");
  const debounced = useDebounceCallback(setUsername, 1000);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [suggestedMessages, setSuggestedMessages] = useState<Record<
    string,
    string
  > | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      username: "",
      messageContent: "",
      isAnonymous: true,
    },
  });

  const suggestMessageForm = useForm({
    defaultValues: {
      question: "",
    },
  });
  const handleClick = (message: string) => {
    // console.log(message);
    setMessageContent(message);
    form.setValue("messageContent", message);
  };
  async function onSubmit(data: z.infer<typeof messageSchema>) {
    try {
      setIsLoading(true);
      await axios.post("/api/send-message", {
        reciever: data.username,
        content: data.messageContent,
        isAnonymous: data.isAnonymous,
      });
      toast({ title: "Message sent successfully!" });
      form.reset();
      setUsernameMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSuggestedMessages(data: any) {
    try {
      const response = await axios.post("/api/suggest-message", data);
      // console.log(response);

      setSuggestedMessages(response.data.questions);
      toast({ title: "Suggestions fetched successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch suggestions",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    const fetchInitialSuggestions = async () => {
      try {
        const response = await axios.post("/api/suggest-message");
        setSuggestedMessages(response.data.questions);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load initial suggestions",
          variant: "destructive",
        });
      }
    };

    fetchInitialSuggestions();
  }, [isCheckingUsername]);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username !== "") {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/can-send-message?reciever=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username."
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  return (
    <div className="container mx-auto my-8 p-6 pt-20 bg-blur rounded max-w-4xl">
      <h1 className="text-4xl gradient-text font-bold mb-6 text-center">
        Send messages here
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 border-[#888] p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-[#888]">
                    Send message anonymously
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    style={{
                      backgroundColor: field.value ? "#d97706" : "gray",
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    className="text-slate-200 border-0 border-[#888] bg-[#18181b]"
                    placeholder="username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </FormControl>
                {username !== "" &&
                  (usernameMessage ===
                  `${username} is all ears and eagerly awaiting your message! 🎉✨ Don't keep them waiting! 🤩` ? (
                    <p>
                      <span className="text-blue-500">@{username}</span>
                      <span className="text-green-500">
                        {" "}
                        is all ears and eagerly awaiting your message! 🎉✨
                        Don't keep them waiting! 🤩
                      </span>
                    </p>
                  ) : usernameMessage ===
                    `Looks like @${username} has closed their message inbox for now. Maybe try again later and spread some good vibes! 🌟🙃` ? (
                    <p>
                      <span className="text-red-500">Looks like </span>
                      <span className="text-blue-500">@{username}</span>
                      <span className="text-red-500">
                        {" "}
                        has closed their message inbox for now. Maybe try again
                        later and spread some good vibes! 🌟🙃
                      </span>
                    </p>
                  ) : (
                    usernameMessage && (
                      <p>
                        <span className="text-red-500">
                          Oops! It seems like{" "}
                        </span>
                        <span className="text-blue-500">@{username}</span>
                        <span className="text-red-500">
                          {" "}
                          isn’t part of the Mystery Message fun just yet. Invite
                          them to hop on the{" "}
                          <span className="text-green-500">
                            Mystery Message{" "}
                          </span>
                          train and unlock the joy of sharing secret smiles and
                          thoughts! 🌈💌
                        </span>
                      </p>
                    )
                  ))}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="messageContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Message Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message here"
                    className="resize-none text-slate-200 border-0 border-[#888] bg-[#18181b]"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setMessageContent(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                className="animated-gradient-button"
                type="submit"
                disabled={isLoading || !messageContent}
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Form {...suggestMessageForm}>
            <form
              onSubmit={suggestMessageForm.handleSubmit(fetchSuggestedMessages)}
              className="space-y-6"
            >
              <FormField
                control={suggestMessageForm.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Ask for suggestions
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write text to suggest relevant messages"
                        className="text-slate-200 resize-none border-0 border-[#888] bg-[#18181b]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {isLoading ? (
                  <Button className="animated-gradient-button" disabled>
                    Fetch Suggestions
                  </Button>
                ) : (
                  <Button className="animated-gradient-button" type="submit">
                    Fetch Suggestions
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
        <Card className="border-0 border-[#888] bg-[#18181b]">
          <CardHeader className="border-0 border-[#888] bg-[#18181b]">
            <h3 className="text-xl gradient-text font-semibold border-0 border-[#888] bg-[#18181b]">
              Suggested Messages
            </h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 border-0 border-[#888] bg-[#18181b]">
            {suggestedMessages ? (
              Object.values(suggestedMessages).map((message, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(message)}
                  className="cursor-pointer border-0 animated-gradient-button-dark p-4 rounded-lg text-white text-base sm:text-lg md:text-xl w-full sm:w-auto"
                >
                  {message}
                </div>
              ))
            ) : (
              <p className="text-[#888] text-base">No suggestions available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Page;
