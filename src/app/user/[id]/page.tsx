import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UserPage({params} : {params: Promise<{id: string}>}) {
    const session = await auth();

    if(!session) {
        redirect("/");
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    // TODO: move the posts to a client component so they load faster
    const username = session ? await api.user.getUsername({userId : id}) : null;
    const posts = username && session ? await api.post.getAllPostsForUser({userId : id }) : null;

    return (
        <HydrateClient>
            <main className="flex flex-col items-center justify-center bg-white text-black h-full overflow-hidden">
                { session && username && 
                <div className="flex items-center h-full">
                    <div className="flex flex-col gap-6 w-full max-w-4xl">
                        <div className="text-center mb-6">
                            <h1 className="text-4xl font-extrabold text-gray-900">{username}'s Posts</h1>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
                            {posts?.map((post) => (
                                <div key={post.id} className="p-4 border rounded-lg shadow-md bg-gray-50">
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        {post.name}
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                        {post.createdAt.toLocaleString()}
                                    </p>
                                    <div className="text-gray-700 text-base">
                                        <p>
                                            {post.text}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <Link 
                                            href={"/threads/" + post.threadId} 
                                            className="text-gray-800 hover:underline hover:underline-offset-4 hover:decoration-gray-800 transition-all hover:decoration-from-left"
                                            style={{
                                                textDecorationThickness: '2px',
                                                textUnderlineOffset: '4px',
                                            }}
                                        >
                                            Go to thread
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> 
                }
                { !username && 
                    <div className="container flex items-center h-screen">
                        User not found.
                    </div>
                }
            </main>
        </HydrateClient>
    );
}