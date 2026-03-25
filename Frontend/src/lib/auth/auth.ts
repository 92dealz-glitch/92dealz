import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ROLES } from "./auth.config";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Captcha Token", type: "text" },
      },
      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials) return null;
        
        const email = String((credentials as Record<string, unknown>).email ?? "").trim();
        const password = String((credentials as Record<string, unknown>).password ?? "").trim();

        try {
          const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/$/, "");
          const res = await fetch(`${base}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email, 
              password, 
              captchaToken: (credentials as Record<string, unknown>).captchaToken 
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.user) {
            return null;
          }

          // Return user object to be saved in JWT
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || ROLES.BUYER,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT & { role?: string; accessToken?: string }; user?: any }) {
      // On sign in, attach role and token from the user to token
      if (user?.role) token.role = user.role;
      if (user?.accessToken) token.accessToken = user.accessToken;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT & { role?: string; accessToken?: string } }) {
      // Expose role and token on the session's user object
      if (session.user) {
        (session.user as any).role = token.role ?? ROLES.GUEST;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: '/login', // Error code passed in query string as ?error=
  },
};

export default authOptions;
