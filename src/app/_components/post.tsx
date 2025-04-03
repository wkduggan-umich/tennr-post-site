"use client"
import VoteButton from "./vote_button";
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { api } from "~/trpc/react";
import Link from "next/link";
import Modal from "./modal";
import { useState } from "react";

export default function Post({post, threadId, sessionUserId}: 
  {post : {id : number, name : string, text : string, votes : number, createdByName : string | null, createdAt : Date, createdById : string }, threadId : number, sessionUserId : string} ) {

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

  const [modalOpen, setIsModalOpen] = useState(false);
  const [editPostNewName, setNewName] = useState(post.name);
  const [editPostNewText, setNewText] = useState(post.text);

  const editPostMutation = api.post.editPost.useMutation({
    onSuccess: () => {
      void utils.post.getAllPostForThread.invalidate({ threadId : threadId})
    },
  })

  const editPost = () => {
    editPostMutation.mutate({ id : post.id, new_name : editPostNewName, new_text : editPostNewText });
    // setNewName("");
    // setNewText("");
    setIsModalOpen(false);
  }

  const prefetchUserPosts = () => {
    utils.post.getAllPostsForUser.prefetch({userId : post.createdById});
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
              Created by&nbsp;
              <Link href={"/user/" + post.createdById} onMouseEnter={prefetchUserPosts}>
                  {post.createdByName}
              </Link>
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
                <div className="flex ml-auto gap-4">
                  { post.createdById == sessionUserId && 
                    <button onClick={deletePost} className="cursor-pointer flex items-center">
                      <TrashIcon className="h-5 w-5 text-red-500 hover:scale-110 hover:text-red-600 transition-transform duration-200 ease-in-out"/>
                    </button> 
                  }
                  { post.createdById == sessionUserId && 
                    <button onClick={() => setIsModalOpen(true)} className="cursor-pointer flex items-center">
                      <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:scale-110 hover:text-gray-600 transition-transform duration-200 ease-in-out"/>
                    </button> 
                  }
                </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-2">Edit Post</h2>
        <div className="flex flex-col gap-4 w-100">
            <div className="flex flex-col gap-2">
                <input 
                    type="text" 
                    className="border border-gray-300 rounded p-2"
                    placeholder="Post name"
                    value={editPostNewName}
                    onChange={(e) => setNewName(e.target.value)} 
                    required
                />
                <textarea 
                    className="border border-gray-300 rounded p-2 h-40 resize-none"
                    placeholder="Write your post here..." 
                    value={editPostNewText}
                    onChange={(e) => setNewText(e.target.value)} 
                    required
                />
            </div>
            <button 
                onClick={editPost} 
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!editPostNewName.trim() || !editPostNewText.trim()}
            >
                Submit
            </button>
        </div>
      </Modal>
    </div>
  );
}
