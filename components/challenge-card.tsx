"use client"

import { motion } from "framer-motion"
import { Target, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Challenge } from "@/lib/types"
import Link from "next/link"

interface ChallengeCardProps {
  challenge: Challenge
  delay?: number
}

const difficultyColors = {
  beginner: "bg-success/10 text-success",
  intermediate: "bg-warning/10 text-warning",
  advanced: "bg-destructive/10 text-destructive",
}

export function ChallengeCard({ challenge, delay = 0 }: ChallengeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="group relative overflow-hidden p-6 transition-all hover:shadow-lg">
        {challenge.completed && (
          <div className="absolute right-4 top-4">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Target className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{challenge.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{challenge.description}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className={difficultyColors[challenge.difficulty]}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline">{challenge.category}</Badge>
              <Badge variant="outline" className="gap-1">
                <span className="text-warning">⚡</span>
                {challenge.xpReward} XP
              </Badge>
            </div>

            <div className="mt-4">
              <Link href={`/challenges/${challenge.id}`}>
                <Button className="w-full sm:w-auto" disabled={challenge.completed}>
                  {challenge.completed ? "Completed" : "Start Challenge"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
