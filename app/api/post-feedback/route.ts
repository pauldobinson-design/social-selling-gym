import { generateObject } from "ai"
import { z } from "zod"

const postFeedbackSchema = z.object({
  hookStrength: z.number().min(0).max(100).describe("How strong the opening hook is (0-100)"),
  narrativeFlow: z.number().min(0).max(100).describe("How well the story flows (0-100)"),
  commentPotential: z.number().min(0).max(100).describe("Likelihood to generate comments (0-100)"),
  engagementPrediction: z.string().describe("Prediction of how this post will perform"),
  strengths: z.array(z.string()).min(2).max(4).describe("2-4 specific strengths"),
  improvements: z.array(z.string()).min(2).max(4).describe("2-4 actionable improvements"),
})

const postPrompt = `You are a LinkedIn content strategist who evaluates posts for engagement potential.

Evaluate the post on these criteria:

1. HOOK STRENGTH (0-100):
- Does the first line stop the scroll?
- Is there curiosity, controversy, or compelling insight?
- Would someone click "see more"?

2. NARRATIVE FLOW (0-100):
- Does it tell a clear story or make a clear point?
- Are paragraphs short and scannable?
- Does it build to a satisfying conclusion?

3. COMMENT POTENTIAL (0-100):
- Does it end with a question or invitation?
- Is it relatable or thought-provoking?
- Does it encourage discussion vs just likes?

Consider the intended tone and provide specific, actionable feedback.`

export async function POST(req: Request) {
  try {
    const { draft, tone } = await req.json()

    if (!draft || !tone) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: postFeedbackSchema,
      messages: [
        {
          role: "system",
          content: postPrompt,
        },
        {
          role: "user",
          content: `Intended Tone: ${tone}\n\nPost:\n${draft}`,
        },
      ],
    })

    return Response.json({ feedback: object })
  } catch (error: any) {
    console.error("[v0] Post feedback error:", error)
    return Response.json({ error: error.message || "Failed to generate feedback" }, { status: 500 })
  }
}
