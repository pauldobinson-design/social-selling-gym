"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ChallengeCard } from "@/components/challenge-card"
import { mockChallenges } from "@/lib/mock-data"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ChallengesPage() {
  const [filter, setFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all")

  const filteredChallenges = filter === "all" ? mockChallenges : mockChallenges.filter((c) => c.difficulty === filter)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="mt-2 text-muted-foreground">Practice your social selling skills and earn XP</p>
        </div>

        <div className="mb-6">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All Challenges</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6">
          {filteredChallenges.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} delay={index * 0.05} />
          ))}
        </div>
      </main>
    </div>
  )
}
