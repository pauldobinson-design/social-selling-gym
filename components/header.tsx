"use client";

import Link from "next/link";
import { useMockAuth } from "@/lib/mock-auth";
import { UserCircle2 } from "lucide-react";

export function Header() {
  const { user, signOut } = useMockAuth();

  return (
    <header className="border-b border-ink-100">
      <div className="container flex h-14 items-center gap-6">
        <Link href="/" className="font-semibold">Social Selling Gym</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/pitch-perfect">Pitch</Link>
          <Link href="/postcraft">PostCraft</Link>
          <Link href="/progress">Progress</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-ink-700 hidden sm:inline">Welcome back, {user.name}</span>
              <span className="rounded-full bg-ink-100 px-3 py-1 text-xs">XP {user.xp}</span>
              <button onClick={signOut} className="btn">Sign out</button>
            </>
          ) : (
            <button className="btn" title="Google sign in coming soon" disabled>
              <UserCircle2 className="mr-2 h-4 w-4" /> Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
