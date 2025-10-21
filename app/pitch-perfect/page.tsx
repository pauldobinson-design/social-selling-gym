"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mic, Trophy, Clock, Sparkles, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Marketing",
  "Consulting",
  "Real Estate",
  "E-commerce",
  "Education",
]

const hallOfFame = [
  {
    id: 1,
    pitch:
      "We help B2B SaaS companies reduce churn by 40% through AI-powered customer health scoring that predicts at-risk accounts 60 days before they leave.",
    author: "Sarah Chen",
    industry: "Technology",
    score: 98,
    metrics: { clarity: 95, differentiation: 98, memorability: 100 },
  },
  {
    id: 2,
    pitch:
      "We're the Airbnb for commercial kitchen space - connecting food entrepreneurs with unused restaurant kitchens during off-hours, turning idle assets into revenue.",
    author: "Marcus Johnson",
    industry: "Real Estate",
    score: 96,
    metrics: { clarity: 98, differentiation: 95, memorability: 95 },
  },
  {
    id: 3,
    pitch:
      "We eliminate the 6-month sales hiring mistake by providing fractional sales leaders who build your team, process, and pipeline in 90 days - then hand it off.",
    author: "Emily Rodriguez",
    industry: "Consulting",
    score: 94,
    metrics: { clarity: 92, differentiation: 96, memorability: 94 },
  },
]

export default function PitchPerfectPage() {
  const [pitch, setPitch] = useState("")
  const [industry, setIndustry] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [wordCount, setWordCount] = useState(0)

  const handlePitchChange = (value: string) => {
    setPitch(value)
    setWordCount(value.trim().split(/\s+/).filter(Boolean).length)
  }

  const analyzePitch = async () => {
    if (!pitch.trim() || !industry) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/pitch-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch, industry }),
      })

      const data = await response.json()
      setFeedback(data.feedback)
    } catch (error) {
      console.error("[v0] Pitch analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Mic className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Pitch Perfect</h1>
              <p className="text-muted-foreground">Craft your 60-second elevator pitch with AI feedback</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="pitch">Your Elevator Pitch</Label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {wordCount} words (~{Math.round(wordCount / 2.5)} seconds)
                      </span>
                    </div>
                  </div>
                  <Textarea
                    id="pitch"
                    placeholder="Example: We help [target audience] achieve [specific outcome] by [unique approach], unlike [alternatives] which [their limitation]."
                    value={pitch}
                    onChange={(e) => handlePitchChange(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Aim for 120-150 words (about 60 seconds when spoken)
                  </p>
                </div>

                <Button onClick={analyzePitch} disabled={!pitch.trim() || !industry || isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Analyze My Pitch
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {feedback && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">AI Feedback</h3>

                  <div className="grid gap-4 mb-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Clarity</span>
                        <span className="text-sm font-bold">{feedback.clarity}/100</span>
                      </div>
                      <Progress value={feedback.clarity} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Differentiation</span>
                        <span className="text-sm font-bold">{feedback.differentiation}/100</span>
                      </div>
                      <Progress value={feedback.differentiation} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Memorability</span>
                        <span className="text-sm font-bold">{feedback.memorability}/100</span>
                      </div>
                      <Progress value={feedback.memorability} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                      <ul className="space-y-1">
                        {feedback.strengths.map((strength: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-amber-600">Improvements</h4>
                      <ul className="space-y-1">
                        {feedback.improvements.map((improvement: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Detailed Feedback</h4>
                      <p className="text-sm text-muted-foreground text-pretty">{feedback.detailedFeedback}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Hall of Fame</h3>
              </div>
              <div className="space-y-4">
                {hallOfFame.map((entry, index) => (
                  <div key={entry.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.industry}
                        </Badge>
                      </div>
                      <span className="text-lg font-bold text-primary">{entry.score}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 text-pretty">{entry.pitch}</p>
                    <p className="text-xs text-muted-foreground">— {entry.author}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
              <h3 className="font-semibold mb-3">Tips for a Great Pitch</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Start with who you help (target audience)</li>
                <li>• State the specific outcome or transformation</li>
                <li>• Explain your unique approach or method</li>
                <li>• Differentiate from alternatives</li>
                <li>• Use concrete numbers when possible</li>
                <li>• Make it conversational, not corporate</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
