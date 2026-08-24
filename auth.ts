import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const envEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const envPassword = process.env.ADMIN_PASSWORD || "adminpassword";

        // Check configured admin credentials
        if (credentials.email === envEmail && credentials.password === envPassword) {
          try {
            let user = await prisma.user.findUnique({
              where: { email: envEmail },
            });
            if (!user) {
              user = await prisma.user.create({
                data: {
                  email: envEmail,
                  name: "Admin",
                  role: "ADMIN",
                },
              });
            } else if (user.role !== "ADMIN") {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { role: "ADMIN" },
              });
            }
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          } catch (e) {
            console.error("Error creating/fetching admin user in DB:", e);
            return {
              id: "admin-default-id",
              email: envEmail,
              name: "Admin",
              role: "ADMIN",
            };
          }
        }

        // Check DB for matching user
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (dbUser) {
            return {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              role: dbUser.role,
            };
          }
        } catch (e) {
          console.error("Error authenticating against DB:", e);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "ADMIN";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "admin-secret-key-12345",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
