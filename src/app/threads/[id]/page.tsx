import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import MakePost from "~/app/_components/make_post";
import SignInOutButton from "~/app/_components/sign_in_out";
import Posts from "~/app/_components/posts";
import { redirect } from "next/navigation";

export default async function ThreadPage({params} : {params: Promise<{id: string}>}) {
    const session = await auth();

    if(!session) {
        redirect("/");
    }

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    const thread = session ? await api.thread.getThreadById({threadId: id}) : null;

    return (
        <HydrateClient>
            <main className="flex flex-col items-center justify-center bg-white text-black h-full overflow-hidden">
                { session && thread && <div className="container flex items-center h-full">
                    <div className="flex flex-col gap-6 w-full max-w-4xl me-40">
                        <div className="text-center mb-6">
                            <h1 className="text-4xl font-extrabold text-gray-900">{thread.title}</h1>
                            <p className="text-lg text-gray-600 mt-2">{thread.text}</p>
                            <p className="text-sm text-gray-500 mt-4">
                                Created by <span className="font-medium text-gray-700">{thread.createdByName}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                {thread.createdAt.toLocaleString()}
                            </p>
                        </div>
                        <div className="">
                            <Posts threadId={id} sessionUserId={session.user.id} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 justify-center items-center">
                        { session && <MakePost threadId={id} />}
                    </div>
                </div> }
                { !thread && 
                    <div className="container flex items-center h-screen">
                        Thread not found.
                    </div>
                }
            </main>
        </HydrateClient>
    );
}