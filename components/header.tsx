// components/header.tsx
"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserCircle2 } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const authed = Boolean(session?.user);
  const name = (session?.user?.name as string) || null;
  const avatar = (session?.user as any)?.image as string | null;

  return (
    <header className="border-b border-gray-200">
      <div className="container flex h-14 items-center gap-6">
        <Link href="/" className="font-semibold">Social Selling Gym</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/challenges">Challenges</Link>
          <Link href="/postcraft">Post</Link>
          <Link href="/pitch-perfect">Pitch</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {authed ? (
            <>
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="avatar" className="h-6 w-6 rounded-full" />
              ) : (
                <UserCircle2 className="h-5 w-5 text-gray-700" />
              )}
              {name ? <span className="text-sm text-gray-700 hidden sm:inline">{name}</span> : null}
              <a className="btn" href="/account">Account</a>
              <button onClick={() => signOut()} className="btn">Sign out</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => signIn("google")}>
              <UserCircle2 className="mr-2 h-4 w-4" /> Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
