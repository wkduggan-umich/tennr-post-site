"use client";
import { api } from "~/trpc/react";
import { useState } from "react";

export default function MakeThread() {
    const utils = api.useUtils();
    const make_thread = api.thread.create.useMutation({
        onSuccess: () => {
            void utils.thread.getAllThreads.invalidate();
        },
    }
    );
    const [name, setName] = useState("");
    const [text, setText] = useState("");

    const handleClick = () => {
        make_thread.mutate(
            { title: name, text: text }
        );
        setName("");
        setText("");
    };

    return(
        <div className="flex flex-col gap-4 w-100">
            <h1 className="text-2xl text-center">
                Create a new thread
            </h1>
            <div className="flex flex-col gap-2">
                <input 
                    type="text" 
                    className="border border-gray-300 rounded p-2"
                    placeholder="Thread name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    required
                />
                <textarea 
                    className="border border-gray-300 rounded p-2 h-40 resize-none"
                    placeholder="Write your thread here..." 
                    value={text}
                    onChange={(e) => setText(e.target.value)} 
                    required
                />
            </div>
            <button 
                onClick={handleClick} 
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!name.trim() || !text.trim()}
            >
                Submit
            </button>
        </div>
    );
}