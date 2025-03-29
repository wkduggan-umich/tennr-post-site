import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import MakePost from "~/app/_components/make_post";
import SignInOutButton from "~/app/_components/sign_in_out";
import Posts from "~/app/_components/posts";

export default async function ThreadPage({params} : {params: {id: string}}) {
    const session = await auth();
    const id = Number((await params).id);

    const thread = session ? await api.thread.getThreadById({threadId: id}) : null;

    return (
        <HydrateClient>
            <main className="flex flex-col items-center justify-center bg-white text-black h-full overflow-hidden">
                { session && thread && <div className="container flex items-center h-full">
                    <div className="flex flex-col gap-4 w-full max-w-4xl me-40">
                        <h1 className="text-2xl text-center mb-5">
                            {thread.title}
                        </h1>
                        <h2 className="text-2lq text-center mb-5">
                            {thread.text}
                        </h2>
                        { session && <Posts threadId={id} />}
                    </div>
                    <div className="flex flex-col gap-4 justify-center items-center">
                        { session && <MakePost threadId={id} />}
                        <SignInOutButton />
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