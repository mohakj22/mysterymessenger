"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session } = useSession();
  // console.log(session);
  const user: User = session?.user;

  return (
    <nav className="fixed top-0 left-0 right-0 p-4 md:p-6 shadow-md bg-black bg-opacity-70 backdrop-blur-lg text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="text-xl gradient-text font-bold mb-4 md:mb-0">
          Mystery Messenger
        </a>
        {session ? (
          <>
            <span className="mr-4 gradient-text">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-20 bg-black text-[#888] border-2 rounded-lg border-[#888]  hover:text-[#888] hover:bg-black hover:scale-105 active:scale-95 active:border-2 transition-all duration-200"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="animated-gradient-button border-0 w-20 bg-slate-100 hover:text-white"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
