import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "./_components/navbar";
import { auth } from "~/server/auth";
export const metadata: Metadata = {
  title: "Threads",
  description: "Threads: create your own reddit posts",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="flex flex-col h-screen">
        <TRPCReactProvider>
          {session && <Navbar />}
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
