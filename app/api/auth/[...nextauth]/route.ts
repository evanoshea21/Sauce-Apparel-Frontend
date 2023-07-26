//inside api/auth/[...nextauth]/routes.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import type { NextAuthOptions } from "next-auth";
//import providers
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log(
      //   "USER=======\n",
      //   user,
      //   "\n\n\nACCOUNT========\n",
      //   account,
      //   "\n\n\nPROFILE=======\n",
      //   profile
      // );

      fetch("http://localhost:1400/test");
      return true;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // console.log(
      //   "Session stuff=======\n",
      //   session,
      //   "\n\n\nTOKEN========\n",
      //   token,
      //   "\n\n\nUSER=======\n",
      //   user
      // );
      // console.log("userID: ", user.id);
      session.user.id = user.id;
      // session.user.id = token.id;
      return session;
      // return {session, token, user};
    },
  },
};
//
//export as get and post
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
