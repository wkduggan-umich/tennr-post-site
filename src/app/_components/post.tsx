"use client"
import VoteButton from "./vote_button";
import { TrashIcon } from '@heroicons/react/24/outline'
import { api } from "~/trpc/react";

export default function Post({post, threadId, sessionUserId}: 
  {post : {id : number, name : string, text : string, votes : number, createdByName : string | null, createdAt : Date, createdById : String }, threadId : number, sessionUserId : String} ) {

  const utils = api.useUtils();
  const userHasVoted = api.post.userHasVoted.useQuery({ postId : post.id}).data;
  const _deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      void utils.post.getAllPostForThread.invalidate({ threadId : threadId})
    },
  });

  const deletePost = () => {
    _deletePost.mutate({ postId : post.id })
  }

  return (
    <div className="w-full">
      <div key={post.id} className="flex flex-col border-2 bg-white shadow-lg rounded-2xl p-6 gap-6 w-full">
        <div className="flex flex-row items-center gap-4">
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-800">
              {post.name}
            </h1>
            <p className="text-sm text-gray-500">
              Created by {post.createdByName}
            </p>
            <p className="text-xs text-gray-500">
              {post.createdAt.toLocaleString()}
            </p>
              </div>
            </div>
            <div className="text-gray-700 text-base">
              <p>
            {post.text}
              </p>
            </div>
            <div className="flex flex-row justify-center items-center">
              <div className="flex flex-row items-center gap-4 w-full">
                <VoteButton 
                  up_down={true} 
                  disabled={userHasVoted ?? false}
                  post={{ id: post.id, votes: post.votes }} 
                />
                <p className="text-lg font-semibold text-gray-800">
                  {post.votes}
                </p>
                <VoteButton 
                  up_down={false} 
                  disabled={userHasVoted ?? false}
                  post={{ id: post.id, votes: post.votes }} 
                />
                { post.createdById == sessionUserId && <button onClick={deletePost} className="cursor-pointer ml-auto flex items-center">
                  <TrashIcon className="h-5 w-5 text-red-500 hover:scale-110 hover:text-red-600 transition-transform duration-200 ease-in-out"/>
                </button> }
          </div>
        </div>
      </div>
    </div>
  );
}
