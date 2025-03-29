import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { HomeIcon } from '@heroicons/react/24/outline'
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="flex flex-col h-screen">
        {/* TODO: move this to its own component and add a on hover prefetch for the threads */}
        <Link href="/" className="flex items-center justify-center group">
          <HomeIcon className="h-8 mt-4 ml-4 transition-transform duration-200 group-hover:scale-110" />
        </Link>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
