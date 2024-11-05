/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
// Disables all ESLint rules

/* tslint:disable */
// Disables TSLint rules if you're using TSLint

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "@/models/User.model";
export async function POST(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  // console.log(session);

  const user: User = session?.user as User;

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized access. Please log in." },
      { status: 401 }
    );
  }

  const { replyContent, originalMessageId, wantReply, anonymity } =
    await request.json();

  if (!replyContent || !originalMessageId) {
    return NextResponse.json(
      {
        message:
          "Invalid request data. Reply content or message ID is missing.",
      },
      { status: 400 }
    );
  }

  try {
    const newMessage = {
      content: replyContent,
      sender: user.username,
      isAnonymous: anonymity,
      canReply: wantReply,
    };

    const originalMessage = await UserModel.findOneAndUpdate(
      { _id: user._id, "messages._id": originalMessageId },
      { $set: { "messages.$.canReply": false } },
      { new: true }
    );
    // console.log("I'm original message",originalMessage);

    if (!originalMessage) {
      return NextResponse.json(
        { message: "Original message not found." },
        { status: 404 }
      );
    }

    const messages = originalMessage?.messages as Array<{
      _id: string;
      sender: string | null;
    }>;
    const updatedMessage = messages.find(
      (msg) => msg._id.toString() === originalMessageId.toString()
    );
    const receiver = updatedMessage?.sender;

    const updatedUser = await UserModel.findOneAndUpdate(
      { username: receiver },
      { $push: { messages: newMessage } },
      { new: true }
    );
    // console.log("updatedUser");

    if (!updatedUser) {
      return NextResponse.json(
        {
          message:
            "Failed to update user with the new message. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Reply sent successfully.", newMessage },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while sending the reply.",
        error,
      },
      { status: 500 }
    );
  }
}
