"use client"
import { api } from "~/trpc/react";
import Link from "next/link";

export default function Threads() {
    const threads = api.thread.getAllThreads.useQuery().data;
    const utils = api.useUtils();
    const handleHover = (threadId : number) => {
        utils.post.getAllPostForThread.prefetch({threadId: threadId})
    };

    return (
        threads?.map((thread) => (
            <div key={thread.id}>
              <Link href={"threads/" + thread.id} onMouseEnter={() => handleHover(thread.id)}>
                <div className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <h2 className="text-center text-lg font-semibold text-blue-600">
                    {thread.title}
                  </h2>
                </div>
              </Link>
            </div>
        ))
    );
}