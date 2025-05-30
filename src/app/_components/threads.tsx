"use client"
import { api } from "~/trpc/react";
import Link from "next/link";

export default function Threads() {
    const { data, isLoading } = api.thread.getAllThreads.useQuery();
    const threads = data
    const utils = api.useUtils();
    const handleHover = (threadId : number) => {
        void utils.post.getAllPostForThread.prefetch({threadId: threadId});
    };

    if(isLoading) return <p className="text-center">Loading...</p>;

    return (
        threads?.map((thread) => (
            <div key={thread.id} className="mb-4">
                <Link href={"threads/" + thread.id} onMouseEnter={() => handleHover(thread.id)}>
                <div className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white hover:bg-gray-50">
                <h2 className="text-center text-xl font-bold text-gray-800">
                  {thread.title}
                </h2>
                <div className="mt-2 text-center text-sm text-gray-500">
                  <p>Created by: {thread.createdByName}</p>
                  <p>Created at: {new Date(thread.createdAt).toLocaleString()}</p>
                </div>
                </div>
                </Link>
            </div>
        ))
    );
}