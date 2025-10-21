"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Save, Eye, EyeOff, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem("openai_api_key")
    if (savedKey) {
      setApiKey(savedKey)
    }
    setLoading(false)
  }, [])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey.trim())
    } else {
      localStorage.removeItem("openai_api_key")
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-muted-foreground">Configure your Social Selling Gym experience</p>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">OpenAI API Key</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your OpenAI API key to get real AI-powered feedback on your submissions. Without a key, you'll
                receive simulated feedback.
              </p>
            </div>
          </div>

          <Alert className="mb-6">
            <AlertDescription className="text-sm">
              Your API key is stored locally in your browser and never sent to our servers. It's only used to call
              OpenAI directly for generating feedback.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <div className="relative mt-2">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Get your API key from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  platform.openai.com/api-keys
                </a>
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="gap-2">
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
              {apiKey && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setApiKey("")
                    localStorage.removeItem("openai_api_key")
                    setSaved(true)
                    setTimeout(() => setSaved(false), 3000)
                  }}
                >
                  Clear API Key
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="mb-4 text-xl font-semibold">About AI Feedback</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>The AI feedback system evaluates your submissions based on proven social selling best practices:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Personalization and research</li>
              <li>Value-first approach</li>
              <li>Authentic and conversational tone</li>
              <li>Clear and concise messaging</li>
              <li>Appropriate calls-to-action</li>
              <li>Context awareness</li>
              <li>Credibility and social proof</li>
            </ul>
            <p>
              With your own OpenAI API key, you'll get more detailed, nuanced feedback powered by GPT-4. Without a key,
              you'll still receive helpful simulated feedback to practice with.
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
