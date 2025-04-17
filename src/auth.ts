import {PrismaAdapter} from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import {Adapter} from "next-auth/adapters";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "./lib/prisma";

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,

    providers: [
        Google,
        GitHub,
    ],
    callbacks: {
        session({session, user}) {
            session.user.id = user.id

            //@ts-expect-error this is for temp fix
            session.user.role = user.role as string
            return session
        },
    }

});