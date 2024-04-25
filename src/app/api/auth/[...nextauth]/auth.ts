import clientPromise from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { mongoConnect } from "@/lib/utils";
import { User } from "@/models/user";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password!;

        mongoConnect();
        const loginUser = await User.findOne({email});
        const passworOk = loginUser && bcrypt.compareSync(password, loginUser.password);

        if (passworOk) {
          return loginUser;
        }

        return null;
      }
    }),
  ]
};