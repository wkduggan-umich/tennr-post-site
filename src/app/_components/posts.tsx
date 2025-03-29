"use client"

import Post from "./post";
import { api } from "~/trpc/react";

export default function Posts({threadId, sessionUserId} : {threadId : number, sessionUserId : string}) {
  const posts_get = api.post.getAllPostForThread.useQuery({ threadId: threadId}).data;

  return (
    <div className="flex flex-col gap-4 max-h-[70vh] w-full max-w-4xl">
      <div className="flex flex-col overflow-y-auto gap-4">
        {posts_get?.map((post) => (
            <div key={post.id} className="w-full">
                <Post post={post} threadId={threadId} sessionUserId={sessionUserId}/>
            </div>
        ))}
      </div>
    </div>
  );
}
