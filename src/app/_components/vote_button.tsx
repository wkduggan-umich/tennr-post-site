"use client";
import { api } from "~/trpc/react";
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

export default function VoteButton ({up_down, post }: 
        {up_down: boolean, post: {id: number, votes: number}}) {
    const utils = api.useUtils();

    const vote_change = api.post.vote.useMutation({
        onSuccess: () => {
            void utils.post.getAllPostForThread.invalidate();
        }
    });

    const handleClick = () => {
        vote_change.mutate(
            { postId: post.id, up_down: up_down }
        );
    };

    return (
        <button onClick={handleClick} className="cursor-pointer">
            {up_down ? (
                <ArrowUpIcon className="h-5 w-5 text-green-500 hover:scale-110 hover:text-green-600 transition-transform duration-200 ease-in-out" />
            ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-500 hover:scale-110 hover:text-red-600 transition-transform duration-200 ease-in-out" />
            )}
        </button>
    );
}