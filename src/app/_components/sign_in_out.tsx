"use client"
import Link from "next/link";

export default function SignInOutButton({session} : {session : boolean}){
    return (
        <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className={!session ?
                "rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl mt-3"
                : "transition-transform duration-200 group-hover:scale-110"
            }
        >
            {session ? "Sign Out" : "Sign In"}
        </Link>
    )
}