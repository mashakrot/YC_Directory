/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";


export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user: { name, email, image }, profile: { id, login, bio } }) {
            const existingUser = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                id,
            });

            if (!existingUser) {
                await writeClient.create({
                    _type: 'author',
                    id,
                    name,
                    username: login,
                    email,
                    image,
                    bio: bio || '',
                })
            }

            return true;
        },
        async jwt({ token, account, profile }) {
            if (account && profile) {
                const user = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                    id: profile?.id,
                })

                token.id = user?._id;
            }

            return token;
        },
        async session({ session, token }) {
            Object.assign(session, { id: token.id });
            return session;
        },
        // async session({ session, token }: { session: any; token: any }) {
        //     // Extend session with user ID
        //     if (token.sub) {
        //         session.user.id = token.sub;
        //     }
        //     return session;
        // },
    },
});