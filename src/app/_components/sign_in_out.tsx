import Link from "next/link";
import { auth } from "~/server/auth";

export default async function SignInOutButton(){
    const session = await auth();

    return (
        <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl mt-3"
        >
            {session ? "Sign Out" : "Sign In"}
        </Link>
    )
}