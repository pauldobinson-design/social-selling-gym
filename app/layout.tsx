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
  description: "Build pipeline with a daily social selling workout."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MockAuthProvider>
            <Header />
            <main className="container py-8">{children}</main>
            <footer className="border-t border-gray-200 mt-12">
              <div className="container py-8 text-sm text-gray-700 flex items-center justify-between">
                <span>© {new Date().getFullYear()} Social Selling Gym</span>
                <nav className="flex gap-4">
                  <a href="/privacy">Privacy</a>
                  <a href="/terms">Terms</a>
                </nav>
              </div>
            </footer>
          </MockAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
