/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
// import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
// import { client } from "@/sanity/lib/client";
// import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            // Extend session with user ID
            if (token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
});