"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PenTool, Sparkles, Copy, Check, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tones = [
  { value: "thoughtful", label: "Thoughtful", description: "Reflective and insightful" },
  { value: "bold", label: "Bold", description: "Confident and provocative" },
  { value: "playful", label: "Playful", description: "Light and engaging" },
  { value: "educational", label: "Educational", description: "Teaching and informative" },
  { value: "storytelling", label: "Storytelling", description: "Narrative-driven" },
]

export default function PostCraftPage() {
  const [draft, setDraft] = useState("")
  const [tone, setTone] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const analyzePost = async () => {
    if (!draft.trim() || !tone) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/post-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, tone }),
      })

      const data = await response.json()
      setFeedback(data.feedback)
    } catch (error) {
      console.error("[v0] Post analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(draft)
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, "_blank")
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(draft)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <PenTool className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">PostCraft</h1>
              <p className="text-muted-foreground">AI-powered LinkedIn post workshop</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="compose" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger id="tone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            <div>
                              <div className="font-medium">{t.label}</div>
                              <div className="text-xs text-muted-foreground">{t.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="draft">Your Post</Label>
                    <Textarea
                      id="draft"
                      placeholder="Start writing your LinkedIn post here...&#10;&#10;Pro tip: Start with a hook that stops the scroll!"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={12}
                      className="resize-none font-sans"
                    />
                    <p className="text-xs text-muted-foreground mt-2">{draft.length} characters</p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={analyzePost} disabled={!draft.trim() || !tone || isAnalyzing} className="flex-1">
                      {isAnalyzing ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get AI Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <Card className="p-6 bg-muted/50">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <div>
                        <div className="font-semibold">Your Name</div>
                        <div className="text-sm text-muted-foreground">Your Title | Your Company</div>
                        <div className="text-xs text-muted-foreground">Just now</div>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {draft || "Your post preview will appear here..."}
                    </div>
                  </Card>

                  <div className="flex gap-2 mt-4">
                    <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                    <Button onClick={shareToLinkedIn} variant="outline" className="flex-1 bg-transparent">
                      <Linkedin className="mr-2 h-4 w-4" />
                      Share to LinkedIn
                    </Button>
                    <Button onClick={shareToTwitter} variant="outline" className="flex-1 bg-transparent">
                      <Twitter className="mr-2 h-4 w-4" />
                      Share to X
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {feedback && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">AI Feedback</h3>

                  <div className="grid gap-4 mb-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Hook Strength</span>
                        <span className="text-sm font-bold">{feedback.hookStrength}/100</span>
                      </div>
                      <Progress value={feedback.hookStrength} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Narrative Flow</span>
                        <span className="text-sm font-bold">{feedback.narrativeFlow}/100</span>
                      </div>
                      <Progress value={feedback.narrativeFlow} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Comment Potential</span>
                        <span className="text-sm font-bold">{feedback.commentPotential}/100</span>
                      </div>
                      <Progress value={feedback.commentPotential} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Engagement Prediction</h4>
                      <p className="text-sm text-muted-foreground text-pretty">{feedback.engagementPrediction}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">What Works</h4>
                      <ul className="space-y-1">
                        {feedback.strengths.map((strength: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-amber-600">How to Improve</h4>
                      <ul className="space-y-1">
                        {feedback.improvements.map((improvement: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
              <h3 className="font-semibold mb-3">High-Performing Post Formula</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>Hook:</strong> Stop the scroll in first 2 lines
                </li>
                <li>
                  • <strong>Story:</strong> Share a specific experience
                </li>
                <li>
                  • <strong>Insight:</strong> What did you learn?
                </li>
                <li>
                  • <strong>Value:</strong> How can others apply this?
                </li>
                <li>
                  • <strong>CTA:</strong> Ask a question or invite discussion
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Formatting Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use line breaks for readability</li>
                <li>• Keep paragraphs to 1-2 sentences</li>
                <li>• Use emojis sparingly (1-3 max)</li>
                <li>• Bold key phrases for emphasis</li>
                <li>• End with a clear call-to-action</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Best Times to Post</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tuesday-Thursday</span>
                  <span className="font-medium">7-9 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lunch break</span>
                  <span className="font-medium">12-1 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Evening</span>
                  <span className="font-medium">5-6 PM</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
