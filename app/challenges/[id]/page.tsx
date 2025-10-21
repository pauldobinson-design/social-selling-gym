"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { SocialShareButtons } from "@/components/social-share-buttons"
import { mockChallenges } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, Settings, Share2, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ChallengePage() {
  const params = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [hasShared, setHasShared] = useState(false)

  const challenge = mockChallenges.find((c) => c.id === params.id)

  useEffect(() => {
    // Check if user has API key
    const apiKey = localStorage.getItem("openai_api_key")
    setHasApiKey(!!apiKey)
  }, [])

  if (!challenge) {
    return <div>Challenge not found</div>
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const apiKey = localStorage.getItem("openai_api_key")

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submission,
          challengePrompt: challenge.prompt,
          userApiKey: apiKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate feedback")
      }

      setFeedback(data.feedback)
    } catch (err: any) {
      console.error("[v0] Error getting feedback:", err)
      setError(err.message || "Failed to generate feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = (platform: string) => {
    setHasShared(true)
    console.log("[v0] Content shared to:", platform)
    // In production, this would save to database
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/challenges">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Challenges
          </Button>
        </Link>

        {!hasApiKey && (
          <Alert className="mb-6">
            <Settings className="h-4 w-4" />
            <AlertDescription>
              Add your OpenAI API key in{" "}
              <Link href="/settings" className="font-medium text-primary hover:underline">
                Settings
              </Link>{" "}
              to get real AI-powered feedback based on social selling best practices.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{challenge.title}</h1>
                {challenge.isRealWorld && (
                  <Badge variant="default" className="gap-1 bg-gradient-to-r from-primary to-purple-600">
                    <Share2 className="h-3 w-3" />
                    Real-World
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-muted-foreground">{challenge.description}</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3 text-warning" />
              {challenge.xpReward} XP
              {hasShared && challenge.isRealWorld && (
                <span className="ml-1 text-success">+{Math.floor(challenge.xpReward * 0.5)}</span>
              )}
            </Badge>
          </div>

          {challenge.ssiPillar && (
            <div className="mt-4 rounded-lg bg-secondary p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">LinkedIn SSI Focus:</span>{" "}
                {challenge.ssiPillar === "establishBrand" && "Establish Your Professional Brand"}
                {challenge.ssiPillar === "findPeople" && "Find the Right People"}
                {challenge.ssiPillar === "engageInsights" && "Engage with Insights"}
                {challenge.ssiPillar === "buildRelationships" && "Build Relationships"}
              </p>
            </div>
          )}

          <div className="mt-6 rounded-lg bg-secondary p-4">
            <h3 className="mb-2 font-semibold">Challenge Prompt:</h3>
            <p className="leading-relaxed text-foreground">{challenge.prompt}</p>
          </div>

          {challenge.isRealWorld && (
            <Alert className="mt-4">
              <Share2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Real-World Challenge:</strong> This challenge is designed for you to actually share your content
                on social media. You'll earn bonus XP (+{Math.floor(challenge.xpReward * 0.5)}) when you share it!
              </AlertDescription>
            </Alert>
          )}
        </Card>

        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-xl font-semibold">Your {challenge.platform === "email" ? "Message" : "Post"}</h2>
          <Textarea
            placeholder={
              challenge.platform === "email" ? "Write your email message here..." : "Write your post here..."
            }
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            className="min-h-[200px]"
          />

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 flex justify-end">
            <Button onClick={handleSubmit} disabled={!submission.trim() || isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get AI Feedback
                </>
              )}
            </Button>
          </div>
        </Card>

        {feedback && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="mb-6 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI Feedback</h2>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{feedback.score}</span>
                  <span className="text-muted-foreground">/100</span>
                </div>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-success/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <h3 className="font-semibold text-success">Strengths</h3>
                  </div>
                  <ul className="space-y-1">
                    {feedback.strengths.map((strength: string, i: number) => (
                      <li key={i} className="text-sm text-foreground">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-warning/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    <h3 className="font-semibold text-warning">Areas to Improve</h3>
                  </div>
                  <ul className="space-y-1">
                    {feedback.improvements.map((improvement: string, i: number) => (
                      <li key={i} className="text-sm text-foreground">
                        • {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-lg bg-secondary p-4">
                <h3 className="mb-2 font-semibold">Detailed Feedback</h3>
                <p className="text-sm leading-relaxed text-foreground">{feedback.detailedFeedback}</p>
              </div>
            </Card>

            {challenge.isRealWorld && feedback.score >= 70 && (
              <Card className="mb-6 p-6">
                <h2 className="mb-4 text-xl font-semibold">Ready to Share?</h2>
                <p className="mb-4 text-muted-foreground">
                  Your content scored {feedback.score}/100! Time to put it into action and share it with your network.
                </p>
                <SocialShareButtons content={submission} platform={challenge.platform} onShare={handleShare} />
              </Card>
            )}

            {challenge.isRealWorld && feedback.score < 70 && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your content scored {feedback.score}/100. Consider refining it based on the feedback above before
                  sharing. You want to make a great impression!
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button onClick={() => router.push("/challenges")} className="flex-1">
                Next Challenge
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmission("")
                  setFeedback(null)
                  setError(null)
                  setHasShared(false)
                }}
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
