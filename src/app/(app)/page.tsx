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
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [submitting, setIsSubmitting] = useState(false);

  const handleSignUpClick = () => {
    setIsSubmitting(true);
  };

  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-black text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl text-slate-200 md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 text-[#888] md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="animated-gradient-button-dark border-0">
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-10 active:scale-95">
          <Link href={"/sign-up"}>
            {!submitting ? (
              <Button
                className="animated-gradient-button"
                onClick={handleSignUpClick}
                disabled={submitting}
              >
                Gateway to your Mystery World : Sign-Up
              </Button>
            ) : (
              <div className="animated-gradient-button flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
              </div>
            )}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-black text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
