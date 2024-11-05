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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verifying user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        "Verification failed. Please try again.";
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-blur rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl gradient-text font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4 text-[#888]">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Verification Code
                  </FormLabel>
                  <Input
                    placeholder="verification code"
                    className="text-slate-200 border-0 border-[#888] bg-[#18181b]"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="animated-gradient-button text-white font-bold py-2 px-4 rounded"
            >
              Verify
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
