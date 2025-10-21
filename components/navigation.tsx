"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, TrendingUp, BookOpen, Trophy, Mic, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/challenges", label: "Challenges", icon: Target },
    { href: "/pitch-perfect", label: "Pitch Perfect", icon: Mic },
    { href: "/postcraft", label: "PostCraft", icon: PenTool },
    { href: "/progress", label: "Progress", icon: TrendingUp },
    { href: "/templates", label: "Templates", icon: BookOpen },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
