"use client";

import { useState } from "react";
import VoteButton from "./vote_button";

export default function Post({post}: {post : {id : number, name : string, text : string, votes : number, createdByName : string }} ) {
  const [num_votes, setVotes] = useState(post.votes);
  
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
          </div>
        </div>
        <div className="text-gray-700 text-base">
          <p>
        {post.text}
          </p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-4">
        <VoteButton 
          up_down={true} 
          post={{ id: post.id, votes: num_votes }} 
          onClick={() => setVotes(num_votes + 1)}
        />
        <p className="text-lg font-semibold text-gray-800">
          {num_votes}
        </p>
        <VoteButton 
          up_down={false} 
          post={{ id: post.id, votes: num_votes }} 
          onClick={() => setVotes(num_votes - 1)}
        />
          </div>
        </div>
      </div>
    </div>
  );
}
