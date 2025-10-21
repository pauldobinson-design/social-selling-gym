"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, TrendingUp, BookOpen, Trophy, Bell, Settings, Mic, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <span className="text-lg font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-lg font-semibold">Social Selling Gym</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link key={link.href} href={link.href}>
                    <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/settings">
              <Button variant={pathname === "/settings" ? "secondary" : "ghost"} size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            </Button>

            <div className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2">
              <div className="text-right">
                <div className="text-sm font-medium">Level 5</div>
                <div className="text-xs text-muted-foreground">850 XP</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
