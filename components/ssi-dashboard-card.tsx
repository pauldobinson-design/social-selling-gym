"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertCircle } from "lucide-react"
import { calculateSSIPillars } from "@/lib/ssi-mapping"
import type { LinkedInSSI } from "@/lib/types"

interface SSIDashboardCardProps {
  ssiScores?: LinkedInSSI
  onUpdateScores: () => void
}

export function SSIDashboardCard({ ssiScores, onUpdateScores }: SSIDashboardCardProps) {
  if (!ssiScores) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Get Personalized Training</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your LinkedIn SSI scores to receive challenge recommendations tailored to your specific gaps.
            </p>
            <Button onClick={onUpdateScores} size="sm">
              Add SSI Scores
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const pillars = calculateSSIPillars(ssiScores)
  const weakestPillar = pillars.reduce((prev, current) => (current.gap > prev.gap ? current : prev))

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">LinkedIn SSI Score</h3>
          <p className="text-sm text-muted-foreground">Your social selling performance</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{ssiScores.totalScore}</div>
          <div className="text-sm text-muted-foreground">out of 100</div>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {pillars.map((pillar) => (
          <div key={pillar.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{pillar.name}</span>
              <span className="text-sm text-muted-foreground">
                {pillar.score} / {pillar.maxScore}
              </span>
            </div>
            <Progress value={(pillar.score / pillar.maxScore) * 100} className="h-2" />
          </div>
        ))}
      </div>

      {weakestPillar.gap > 5 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Focus Area</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your <span className="font-medium">{weakestPillar.name}</span> score has the most room for improvement.
              We've prioritized challenges to help you improve this area.
            </p>
          </div>
        </div>
      )}

      <Button variant="outline" onClick={onUpdateScores} size="sm" className="w-full bg-transparent">
        Update Scores
      </Button>
    </Card>
  )
}
