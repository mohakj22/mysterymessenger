/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Message } from "@/models/User.model";
import { Checkbox } from "./ui/checkbox";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: any) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [reply_it, setReply_it] = useState(message.canReply);
  const [wantReply, setWantReply] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  //   const [isExpanded, setIsExpanded] = useState(false);
  //   const truncatedContent =
  //   message.content.slice(0, 200) + (message.content.length > 200 ? "..." : "");

  const handleDeleteConfirm = async () => {
    try {
      // console.log("HandleDelete");
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message?messageId=${message._id}`
      );
      // console.log("HandleDeleteFailled");
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      toast({ title: "Reply content cannot be empty." });
      return;
    }

    try {
      // console.log("In handle reply", message._id);
      const response = await axios.post<ApiResponse>("/api/send-reply", {
        replyContent,
        originalMessageId: message._id,
        wantReply: wantReply,
        anonymity: anonymous,
      });
      setReply_it(false);
      toast({ title: response.data.message });
      setIsReplying(false);
      setReplyContent("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <div className="overlay" />
      <Card className="border-0 bg-blur text-zinc-300">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-blur border-0 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    This action cannot be undone. This will permanently delete
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-black bg-zinc-300 hover:bg-zinc-400 border-0 active:scale-95">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="border-0 bg-amber-700 hover:bg-amber-800 active:scale-95"
                    onClick={handleDeleteConfirm}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-sm">
            {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
          </div>
          {!message.isAnonymous && message.sender && (
            <div className="text-gray-500">From: {message.sender}</div>
          )}
        </CardHeader>
        <CardContent>
          {message.canReply && reply_it && (
            <Button
              className="animated-gradient-button"
              variant="secondary"
              onClick={() => setIsReplying(true)}
            >
              Reply
            </Button>
          )}
          <Dialog open={isReplying} onOpenChange={setIsReplying}>
            <DialogContent className="bg-blur border-0">
              <DialogHeader>
                <DialogTitle className="text-gray-300">
                  Reply to Message
                </DialogTitle>
              </DialogHeader>
              <Input className="text-slate-200 border-2 border-[#888] bg-[#18181b]"
                placeholder="Type your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms2"
                  className="bg-zinc-400"
                  checked={wantReply}
                  onCheckedChange={(checked) => setWantReply(!!checked)}
                />
                <label
                  htmlFor="terms2"
                  className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Want a reply?
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms3"
                  className="bg-zinc-400"
                  checked={anonymous}
                  onCheckedChange={(checked) => setAnonymous(!!checked)}
                />
                <label
                  htmlFor="terms3"
                  className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Anonymously ?
                </label>
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  className="text-black bg-zinc-300 hover:bg-zinc-400 border-0 active:scale-95"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="animated-gradient-button hover:scale-100"
                  onClick={handleReplySubmit}
                >
                  Send Reply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
