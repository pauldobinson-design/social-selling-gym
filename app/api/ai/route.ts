import { generateText } from "ai"
import { createHash } from "crypto"

const cache = new Map<string, { response: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

const rateLimits = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20 // requests per hour
const RATE_LIMIT_WINDOW = 1000 * 60 * 60 // 1 hour

function getCacheKey(input: string): string {
  return createHash("sha256").update(input.toLowerCase().trim()).digest("hex")
}

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userLimit = rateLimits.get(userId)

  if (!userLimit || now > userLimit.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false
  }

  userLimit.count++
  return true
}

export async function POST(req: Request) {
  try {
    const { type, input, userId = "guest" } = await req.json()

    if (!checkRateLimit(userId)) {
      return Response.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    const cacheKey = getCacheKey(JSON.stringify({ type, input }))
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return Response.json({ ...cached.response, cached: true })
    }

    let response: any

    switch (type) {
      case "pitch":
        response = await analyzePitch(input)
        break
      case "post":
        response = await analyzePost(input)
        break
      case "challenge":
        response = await provideFeedback(input)
        break
      default:
        return Response.json({ error: "Invalid type" }, { status: 400 })
    }

    cache.set(cacheKey, { response, timestamp: Date.now() })

    return Response.json(response)
  } catch (error) {
    console.error("[v0] AI API error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}

async function analyzePitch(input: { pitch: string; industry: string }) {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    temperature: 0.3,
    prompt: `Analyze this elevator pitch for a ${input.industry} professional:

"${input.pitch}"

Provide scores (0-100) for:
1. Clarity - Is it easy to understand?
2. Audience Fit - Does it resonate with the target audience?
3. Outcome Strength - Is the value proposition clear?
4. Proof - Are there specific numbers or evidence?
5. Brevity - Is it concise (120-150 words ideal)?
6. Voice - Is it conversational and authentic?

Also provide:
- 3 specific edits to improve the pitch
- A tighter 120-150 word version

Format as JSON with keys: clarity, audienceFit, outcomeStrength, proof, brevity, voice, edits (array), improvedVersion (string)`,
  })

  return JSON.parse(text)
}

async function analyzePost(input: { content: string; tone: string }) {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    temperature: 0.6,
    prompt: `Analyze this LinkedIn post with a "${input.tone}" tone:

"${input.content}"

Provide scores (0-100) for:
1. Hook Strength - Does the opening grab attention?
2. Narrative Flow - Is it easy to follow?
3. Comment Potential - Will it spark discussion?

Also provide:
- Overall feedback (2-3 sentences)
- 3 specific suggestions to improve engagement

Format as JSON with keys: hookStrength, narrativeFlow, commentPotential, feedback (string), suggestions (array)`,
  })

  return JSON.parse(text)
}

async function provideFeedback(input: { submission: string; challenge: string }) {
  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    temperature: 0.3,
    prompt: `Evaluate this social selling submission:

Challenge: ${input.challenge}
Submission: "${input.submission}"

Provide:
- Score (0-100)
- 3 strengths
- 3 areas for improvement
- Detailed feedback (2-3 sentences)

Format as JSON with keys: score, strengths (array), improvements (array), detailedFeedback (string)`,
  })

  return JSON.parse(text)
}
