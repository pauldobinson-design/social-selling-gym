"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockTemplates } from "@/lib/mock-data"
import { Copy, Check } from "lucide-react"

export default function TemplatesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="mt-2 text-muted-foreground">Proven templates to accelerate your social selling</p>
        </div>

        <div className="grid gap-6">
          {mockTemplates.map((template) => (
            <Card key={template.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{template.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                </div>
                <Badge variant="secondary">{template.usageCount} uses</Badge>
              </div>

              <Badge variant="outline" className="mb-4">
                {template.category}
              </Badge>

              <div className="rounded-lg bg-secondary p-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">{template.content}</pre>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(template.content, template.id)}
                  className="gap-2"
                >
                  {copiedId === template.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Template
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
