"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface SSIInputModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (scores: {
    establishBrand: number
    findPeople: number
    engageInsights: number
    buildRelationships: number
  }) => void
  initialScores?: {
    establishBrand: number
    findPeople: number
    engageInsights: number
    buildRelationships: number
  }
}

export function SSIInputModal({ open, onOpenChange, onSave, initialScores }: SSIInputModalProps) {
  const [scores, setScores] = useState({
    establishBrand: initialScores?.establishBrand ?? 0,
    findPeople: initialScores?.findPeople ?? 0,
    engageInsights: initialScores?.engageInsights ?? 0,
    buildRelationships: initialScores?.buildRelationships ?? 0,
  })

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

  const handleSave = () => {
    onSave(scores)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enter Your LinkedIn SSI Scores</DialogTitle>
          <DialogDescription>
            Input your LinkedIn Social Selling Index scores to get personalized training recommendations.
          </DialogDescription>
        </DialogHeader>

        <Card className="p-4 bg-muted/50">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Find Your SSI Score</p>
              <p className="text-sm text-muted-foreground mt-1">
                Visit{" "}
                <a
                  href="https://www.linkedin.com/sales/ssi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  linkedin.com/sales/ssi
                </a>{" "}
                to view your current scores
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="establishBrand">Establish Your Professional Brand (0-25)</Label>
            <Input
              id="establishBrand"
              type="number"
              min="0"
              max="25"
              value={scores.establishBrand}
              onChange={(e) =>
                setScores({
                  ...scores,
                  establishBrand: Math.min(25, Math.max(0, Number.parseInt(e.target.value) || 0)),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="findPeople">Find the Right People (0-25)</Label>
            <Input
              id="findPeople"
              type="number"
              min="0"
              max="25"
              value={scores.findPeople}
              onChange={(e) =>
                setScores({ ...scores, findPeople: Math.min(25, Math.max(0, Number.parseInt(e.target.value) || 0)) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="engageInsights">Engage with Insights (0-25)</Label>
            <Input
              id="engageInsights"
              type="number"
              min="0"
              max="25"
              value={scores.engageInsights}
              onChange={(e) =>
                setScores({
                  ...scores,
                  engageInsights: Math.min(25, Math.max(0, Number.parseInt(e.target.value) || 0)),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildRelationships">Build Relationships (0-25)</Label>
            <Input
              id="buildRelationships"
              type="number"
              min="0"
              max="25"
              value={scores.buildRelationships}
              onChange={(e) =>
                setScores({
                  ...scores,
                  buildRelationships: Math.min(25, Math.max(0, Number.parseInt(e.target.value) || 0)),
                })
              }
            />
          </div>

          <Card className="p-4 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total SSI Score</span>
              <span className="text-2xl font-bold">{totalScore} / 100</span>
            </div>
          </Card>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Scores
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
