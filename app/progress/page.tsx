"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { TrendingUp, Award, Target, Flame } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const xpData = [
  { day: "Mon", xp: 120 },
  { day: "Tue", xp: 150 },
  { day: "Wed", xp: 100 },
  { day: "Thu", xp: 180 },
  { day: "Fri", xp: 200 },
  { day: "Sat", xp: 50 },
  { day: "Sun", xp: 50 },
]

const categoryData = [
  { category: "Outreach", completed: 8 },
  { category: "Objections", completed: 5 },
  { category: "Follow-Up", completed: 6 },
  { category: "LinkedIn", completed: 4 },
  { category: "Discovery", completed: 3 },
]

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="mt-2 text-muted-foreground">Track your learning journey and achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="mt-2 text-3xl font-bold">850</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="mt-2 text-3xl font-bold">5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Challenges Done</p>
                <p className="mt-2 text-3xl font-bold">26</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="mt-2 text-3xl font-bold">7 days</p>
              </div>
              <Flame className="h-8 w-8 text-warning" />
            </div>
          </Card>
        </div>

        {/* XP Over Time */}
        <Card className="mb-8 p-6">
          <h2 className="mb-6 text-xl font-semibold">XP This Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <h2 className="mb-6 text-xl font-semibold">Challenges by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="completed" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </main>
    </div>
  )
}
