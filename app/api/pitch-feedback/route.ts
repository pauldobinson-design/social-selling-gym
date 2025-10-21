import { generateObject } from "ai"
import { z } from "zod"

const pitchFeedbackSchema = z.object({
  clarity: z.number().min(0).max(100).describe("How clear and easy to understand (0-100)"),
  differentiation: z.number().min(0).max(100).describe("How well it differentiates from competitors (0-100)"),
  memorability: z.number().min(0).max(100).describe("How memorable and sticky the pitch is (0-100)"),
  strengths: z.array(z.string()).min(2).max(4).describe("2-4 specific strengths"),
  improvements: z.array(z.string()).min(2).max(4).describe("2-4 actionable improvements"),
  detailedFeedback: z.string().describe("Detailed feedback paragraph (3-5 sentences)"),
})

const pitchPrompt = `You are an expert pitch coach who evaluates elevator pitches for clarity, differentiation, and memorability.

Evaluate the pitch on these criteria:

1. CLARITY (0-100):
- Is the target audience clearly defined?
- Is the problem/outcome specific and concrete?
- Can someone repeat it back after hearing once?
- Avoids jargon and buzzwords?

2. DIFFERENTIATION (0-100):
- Does it explain what makes this unique?
- Does it contrast with alternatives?
- Is the approach/method specific?
- Would this stand out in a crowded market?

3. MEMORABILITY (0-100):
- Is there a compelling hook or metaphor?
- Are there concrete numbers or specifics?
- Does it paint a vivid picture?
- Would someone remember this tomorrow?

Provide specific, actionable feedback to help improve the pitch.`

export async function POST(req: Request) {
  try {
    const { pitch, industry } = await req.json()

    if (!pitch || !industry) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: pitchFeedbackSchema,
      messages: [
        {
          role: "system",
          content: pitchPrompt,
        },
        {
          role: "user",
          content: `Industry: ${industry}\n\nPitch:\n${pitch}`,
        },
      ],
    })

    return Response.json({ feedback: object })
  } catch (error: any) {
    console.error("[v0] Pitch feedback error:", error)
    return Response.json({ error: error.message || "Failed to generate feedback" }, { status: 500 })
  }
}
