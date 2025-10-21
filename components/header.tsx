"use client"

import { useAuth } from "@/lib/auth-context"
import { UserMenu } from "@/components/user-menu"
import { XPChip } from "@/components/xp-chip"
import Link from "next/link"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="text-lg font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-lg font-semibold">Social Selling Gym</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <XPChip xp={user.xp} level={user.level} />
                <UserMenu user={user} />
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Guest Mode - Toggle login in footer</div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
