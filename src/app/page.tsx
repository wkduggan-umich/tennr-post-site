import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import SignInOutButton from "./_components/sign_in_out";
import MakeThread from "./_components/make_thread";
import Threads from "./_components/threads";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.thread.getAllThreads.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex flex-col flex-grow items-center justify-center bg-white text-black overflow-hidden">
        <div className="container flex items-center h-full">
          { session && 
            <div className="container flex items-center h-full">
              <div className="flex flex-col gap-4 w-full max-w-4xl me-40">
                <h1 className="text-5xl text-center">
                  THREADS
                </h1>
                <Threads/>
              </div> 
              <div className="flex flex-col gap-4 justify-center items-center">
                <MakeThread/>
                <SignInOutButton />
              </div> 
            </div>
          }
          {!session && <div className="flex flex-col items-center justify-center gap-4 h-full w-full">
              <h1 className="text-5xl text-center">
                THREADS
              </h1>
              <div className="flex justify-center">
                <SignInOutButton />
              </div>
            </div>
          }
        </div>
      </main>
    </HydrateClient>
  );
}
