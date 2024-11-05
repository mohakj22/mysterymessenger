import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystery Messenger",
  description: "Dive into the world of anonymity!",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className="bg-black" lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body className={`${inter.className} bg-black`}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
