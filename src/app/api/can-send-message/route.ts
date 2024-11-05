/* eslint-disable */
// Disables all ESLint rules

/* tslint:disable */
// Disables TSLint rules if you're using TSLint

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const receiver = searchParams.get("reciever");

  const receivingUser = await UserModel.findOne({
    username: receiver,
    isVerified: true,
  });

  if (!receivingUser) {
    return NextResponse.json(
      {
        message: `Oops! It seems like @${receiver} isn’t part of the Mystery Message fun just yet. Invite them to hop on the Mystery Message train and unlock the joy of sharing secret smiles and thoughts! 🌈💌`,
        rawReceiver: receiver,
      },
      { status: 400 }
    );
  }
  if (!receivingUser.isAcceptingMessage) {
    return NextResponse.json(
      {
        message: `Looks like @${receiver} has closed their message inbox for now. Maybe try again later and spread some good vibes! 🌟🙃`,
        rawReceiver: receiver,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: `${receiver} is all ears and eagerly awaiting your message! 🎉✨ Don't keep them waiting! 🤩`,
    rawReceiver: receiver,
  });
}
