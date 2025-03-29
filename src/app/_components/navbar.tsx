"use client"
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";

export default function Navbar() {
    const utils = api.useUtils();
    return (
        <Link onMouseEnter={void utils.thread.getAllThreads.prefetch()} href="/" className="flex items-center justify-center group">
            <HomeIcon className="h-8 mt-4 ml-4 transition-transform duration-200 group-hover:scale-110" />
        </Link> 
    );
}