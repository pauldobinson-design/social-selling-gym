import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockLeaderboard } from "@/lib/mock-data"
import { Trophy, Medal, Award } from "lucide-react"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="mt-2 text-muted-foreground">See how you rank against other learners</p>
        </div>

        {/* Top 3 */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {mockLeaderboard.slice(0, 3).map((entry, index) => {
            const icons = [Trophy, Medal, Award]
            const Icon = icons[index]
            const colors = ["text-warning", "text-muted-foreground", "text-warning/60"]

            return (
              <Card key={entry.userId} className="p-6 text-center">
                <Icon className={`mx-auto h-12 w-12 ${colors[index]}`} />
                <div className="mt-4">
                  <div className="text-2xl font-bold">#{entry.rank}</div>
                  <div className="mt-2 font-semibold">{entry.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">Level {entry.level}</div>
                  <Badge variant="secondary" className="mt-2">
                    {entry.xp.toLocaleString()} XP
                  </Badge>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <div className="divide-y divide-border">
            {mockLeaderboard.map((entry) => (
              <div
                key={entry.userId}
                className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-muted-foreground">#{entry.rank}</div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div>
                    <div className="font-semibold">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">Level {entry.level}</div>
                  </div>
                </div>
                <Badge variant="secondary">{entry.xp.toLocaleString()} XP</Badge>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
