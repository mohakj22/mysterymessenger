/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
// Disables all ESLint rules

/* tslint:disable */
// Disables TSLint rules if you're using TSLint

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      body = null;
    }
    // console.log("body", body);

    const promptByUser = body?.question;
    // console.log("promptByUser", promptByUser);

    const prompt = promptByUser
      ? `"${promptByUser}", generate five questions related to the given prompt and understanding the context for an anonymous message sender application, which the sender can use to send to the receiver. Each question should be separated by '||'. Avoid harmful or sensitive content.Remember generate the questions for someone else.`
      : "Generate three open-ended and engaging questions. Each question should be separated by '||' and be suitable for a diverse audience on a social messaging platform. Avoid any content that could be harmful, sensitive, or controversial.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const questionsArray = text
      .split("||")
      .map((q) => q.trim())
      .filter(Boolean);
    const questions = questionsArray.reduce((acc, question, index) => {
      const key = `m${index + 1}`;
      acc[key] = question;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ questions });
  } catch (error) {
    // console.error("Error generating content:", error);
    return NextResponse.json(
      { message: "Failed to generate content", error },
      { status: 500 }
    );
  }
}
