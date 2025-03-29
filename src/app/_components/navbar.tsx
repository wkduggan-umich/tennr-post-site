"use client"
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";
import SignInOutButton from "./sign_in_out";

export default function Navbar() {
    const utils = api.useUtils();
    return (
        <div className="flex items-center gap-4 my-4 justify-between mx-5">
            <Link 
            onMouseEnter={() => utils.thread.getAllThreads.prefetch()} 
            href="/" 
            className="flex items-center group"
            >
            <HomeIcon className="h-8 transition-transform duration-200 group-hover:scale-110" />
            </Link> 
            <SignInOutButton session={true} />
        </div>
    );
}