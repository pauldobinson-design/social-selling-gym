// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        token.picture = (profile as any)?.picture || token.picture;
        token.name = (profile as any)?.name || token.name;
        token.email = (profile as any)?.email || token.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: token.name as string | null,
        email: token.email as string | null,
        image: (token as any).picture as string | null
      };
      return session;
    }
  },
  pages: {} // using default pages (Google pop-up)
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
