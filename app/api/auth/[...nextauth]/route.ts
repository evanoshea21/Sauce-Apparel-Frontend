//inside api/auth/[...nextauth]/routes.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prismaClient";
import type { NextAuthOptions } from "next-auth";
//import providers
import GithubProvider from "next-auth/providers/github";
// import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
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
