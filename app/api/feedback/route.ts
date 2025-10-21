import { generateObject } from "ai"
import { z } from "zod"
import { socialSellingPrompt } from "@/lib/social-selling-criteria"

const feedbackSchema = z.object({
  score: z.number().min(0).max(100).describe("Overall score from 0-100"),
  strengths: z.array(z.string()).min(2).max(4).describe("2-4 specific strengths"),
  improvements: z.array(z.string()).min(2).max(4).describe("2-4 actionable improvements"),
  detailedFeedback: z.string().describe("Detailed feedback paragraph (3-5 sentences)"),
})

export async function POST(req: Request) {
  try {
    const { submission, challengePrompt, userApiKey } = await req.json()

    if (!submission || !challengePrompt) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use user's API key if provided, otherwise use default model
    const model = userApiKey ? `openai/gpt-4o` : "openai/gpt-4o-mini"

    const { object } = await generateObject({
      model,
      schema: feedbackSchema,
      messages: [
        {
          role: "system",
          content: socialSellingPrompt,
        },
        {
          role: "user",
          content: `Challenge: ${challengePrompt}\n\nSubmission:\n${submission}`,
        },
      ],
      ...(userApiKey && {
        headers: {
          Authorization: `Bearer ${userApiKey}`,
        },
      }),
    })

    return Response.json({ feedback: object })
  } catch (error: any) {
    console.error("[v0] Feedback generation error:", error)
    return Response.json({ error: error.message || "Failed to generate feedback" }, { status: 500 })
  }
}
