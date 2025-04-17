import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            role?: string;
        } & DefaultSession["USER"];
    }
    interface AdapterUser {
        role?: string;
    }
}
