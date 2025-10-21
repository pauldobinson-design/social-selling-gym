"use client"

import { Button } from "@/components/ui/button"
import { Linkedin, Twitter, Mail, ExternalLink, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface SocialShareButtonsProps {
  content: string
  platform?: "linkedin" | "twitter" | "email"
  onShare?: (platform: string) => void
}

export function SocialShareButtons({ content, platform, onShare }: SocialShareButtonsProps) {
  const [shared, setShared] = useState(false)

  const handleLinkedInShare = () => {
    // LinkedIn share URL - opens LinkedIn with pre-filled text
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`

    // Copy content to clipboard for user to paste
    navigator.clipboard.writeText(content)

    // Open LinkedIn in new tab
    window.open(linkedInUrl, "_blank")

    setShared(true)
    onShare?.("linkedin")
  }

  const handleTwitterShare = () => {
    // Twitter share URL with pre-filled text
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`

    window.open(twitterUrl, "_blank")

    setShared(true)
    onShare?.("twitter")
  }

  const handleEmailShare = () => {
    // Open email client with pre-filled content
    const subject = "Following up"
    const body = content
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.location.href = mailtoUrl

    setShared(true)
    onShare?.("email")
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content)
    setShared(true)
  }

  if (shared) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 rounded-lg bg-success/10 p-4 text-success"
      >
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">Great job! Content shared successfully 🎉</span>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Ready to share? Your content has been copied to clipboard. Click below to open the platform:
      </p>

      <div className="flex flex-wrap gap-2">
        {(!platform || platform === "linkedin") && (
          <Button onClick={handleLinkedInShare} className="gap-2">
            <Linkedin className="h-4 w-4" />
            Share on LinkedIn
          </Button>
        )}

        {(!platform || platform === "twitter") && (
          <Button onClick={handleTwitterShare} variant="outline" className="gap-2 bg-transparent">
            <Twitter className="h-4 w-4" />
            Share on Twitter
          </Button>
        )}

        {(!platform || platform === "email") && (
          <Button onClick={handleEmailShare} variant="outline" className="gap-2 bg-transparent">
            <Mail className="h-4 w-4" />
            Send via Email
          </Button>
        )}

        <Button onClick={handleCopyContent} variant="outline" className="gap-2 bg-transparent">
          <ExternalLink className="h-4 w-4" />
          Copy & Share Manually
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Tip: Sharing real content is where the learning happens. You'll earn bonus XP when you actually post!
      </p>
    </div>
  )
}
