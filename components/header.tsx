// components/header.tsx
"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useMockAuth } from "@/lib/mock-auth";
import { UserCircle2 } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const { user: mockUser, signOut: mockSignOut } = useMockAuth();

  const authed = Boolean(session?.user);
  const name = session?.user?.name || mockUser?.name || null;
  const avatar = session?.user?.image || null;
  const xp = mockUser?.xp ?? null;

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
          {authed ? (
            <>
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="avatar" className="h-6 w-6 rounded-full" />
              ) : (
                <UserCircle2 className="h-5 w-5 text-ink-500" />
              )}
              {name ? <span className="text-sm text-ink-700 hidden sm:inline">{name}</span> : null}
              {xp !== null ? <span className="rounded-full bg-ink-100 px-3 py-1 text-xs">XP {xp}</span> : null}
              <button onClick={() => signOut()} className="btn">Sign out</button>
            </>
          ) : mockUser ? (
            <>
              <span className="text-sm text-ink-700 hidden sm:inline">Welcome back, {mockUser.name}</span>
              <span className="rounded-full bg-ink-100 px-3 py-1 text-xs">XP {mockUser.xp}</span>
              <button onClick={mockSignOut} className="btn">Sign out</button>
            </>
          ) : (
            <button className="btn" onClick={() => signIn("google")}>
              <UserCircle2 className="mr-2 h-4 w-4" /> Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
