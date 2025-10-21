// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { AuthProvider } from "@/components/auth-provider";
import { MockAuthProvider } from "@/lib/mock-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Selling Gym",
  description: "Practise social selling with challenges, coaching, and progress tracking."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MockAuthProvider>
            <Header />
            <main className="container py-8">{children}</main>
            <footer className="container py-8 text-sm text-ink-500">
              <div className="flex items-center gap-3">
                <span>Developer tools</span>
                <form action="/api/toggle-mock" method="post">
                  <button className="btn">Toggle Mock Login</button>
                </form>
                <span className="ml-auto">Built with Next.js and Tailwind</span>
              </div>
            </footer>
          </MockAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
