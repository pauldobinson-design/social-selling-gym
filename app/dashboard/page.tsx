"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { StatCard } from "@/components/stat-card"
import { ChallengeCard } from "@/components/challenge-card"
import { SSIDashboardCard } from "@/components/ssi-dashboard-card"
import { SSIInputModal } from "@/components/ssi-input-modal"
import { Target, TrendingUp, Flame, Award } from "lucide-react"
import { mockChallenges } from "@/lib/mock-data"
import { getRecommendedChallenges } from "@/lib/ssi-mapping"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { LinkedInSSI } from "@/lib/types"

export default function DashboardPage() {
  const [ssiScores, setSSIScores] = useState<LinkedInSSI | undefined>(undefined)
  const [showSSIModal, setShowSSIModal] = useState(false)

  const activeChallenges = getRecommendedChallenges(mockChallenges, ssiScores)
  const completedCount = mockChallenges.filter((c) => c.completed).length

  const handleSaveSSI = (scores: {
    establishBrand: number
    findPeople: number
    engageInsights: number
    buildRelationships: number
  }) => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    setSSIScores({
      ...scores,
      totalScore,
      lastUpdated: new Date(),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
          <p className="mt-2 text-muted-foreground">Keep up the great work. You're on a 7-day streak!</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total XP" value="850" icon={Award} trend="+120 this week" delay={0} />
          <StatCard title="Current Level" value="5" icon={TrendingUp} trend="350 XP to Level 6" delay={0.1} />
          <StatCard title="Streak" value="7 days" icon={Flame} delay={0.2} />
          <StatCard
            title="Completed"
            value={completedCount}
            icon={Target}
            trend={`${mockChallenges.length - completedCount} remaining`}
            delay={0.3}
          />
        </div>

        <div className="mb-8">
          <SSIDashboardCard ssiScores={ssiScores} onUpdateScores={() => setShowSSIModal(true)} />
        </div>

        {/* Level Progress */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Level 5 Progress</h3>
              <p className="text-sm text-muted-foreground">350 XP until Level 6</p>
            </div>
            <div className="text-2xl font-bold">850 / 1200 XP</div>
          </div>
          <Progress value={(850 / 1200) * 100} className="h-3" />
        </Card>

        {/* Active Challenges */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{ssiScores ? "Recommended Challenges" : "Active Challenges"}</h2>
              {ssiScores && (
                <p className="text-sm text-muted-foreground mt-1">Personalized based on your LinkedIn SSI gaps</p>
              )}
            </div>
            <a href="/challenges" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>

          <div className="grid gap-6">
            {activeChallenges.map((challenge, index) => (
              <ChallengeCard key={challenge.id} challenge={challenge} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </main>

      <SSIInputModal
        open={showSSIModal}
        onOpenChange={setShowSSIModal}
        onSave={handleSaveSSI}
        initialScores={ssiScores}
      />
    </div>
  )
}
