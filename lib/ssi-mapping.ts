import type { Challenge } from "./types"

// Map challenges to LinkedIn SSI pillars
export const SSI_PILLARS = {
  ESTABLISH_BRAND: "establishBrand",
  FIND_PEOPLE: "findPeople",
  ENGAGE_INSIGHTS: "engageInsights",
  BUILD_RELATIONSHIPS: "buildRelationships",
} as const

// Each challenge maps to one or more SSI pillars
export const challengeSSIMapping: Record<string, (keyof typeof SSI_PILLARS)[]> = {
  "1": ["ESTABLISH_BRAND", "BUILD_RELATIONSHIPS"], // LinkedIn Connection Request
  "2": ["FIND_PEOPLE", "ENGAGE_INSIGHTS"], // Value-First Cold Outreach
  "3": ["BUILD_RELATIONSHIPS"], // Objection Handling
  "4": ["BUILD_RELATIONSHIPS"], // Follow-Up
  "5": ["ESTABLISH_BRAND", "ENGAGE_INSIGHTS"], // Social Proof Storytelling
  "6": ["FIND_PEOPLE", "ENGAGE_INSIGHTS"], // Discovery Call Opening
  "7": ["BUILD_RELATIONSHIPS"], // Referral Request
  "8": ["BUILD_RELATIONSHIPS"], // Breakup Email
}

export const SSI_PILLAR_DESCRIPTIONS = {
  establishBrand: {
    name: "Establish Your Professional Brand",
    description: "Build a strong professional presence and thought leadership",
    tips: "Share valuable content, optimize your profile, and showcase expertise",
  },
  findPeople: {
    name: "Find the Right People",
    description: "Identify and connect with the right decision makers",
    tips: "Use advanced search, engage with relevant content, and research prospects",
  },
  engageInsights: {
    name: "Engage with Insights",
    description: "Share and engage with content that resonates with your audience",
    tips: "Comment thoughtfully, share valuable insights, and start conversations",
  },
  buildRelationships: {
    name: "Build Relationships",
    description: "Strengthen your network through meaningful interactions",
    tips: "Follow up consistently, provide value, and nurture connections",
  },
}

// Get recommended challenges based on SSI gaps
export function getRecommendedChallenges(
  challenges: Challenge[],
  ssiScores?: {
    establishBrand: number
    findPeople: number
    engageInsights: number
    buildRelationships: number
  },
): Challenge[] {
  if (!ssiScores) {
    return challenges.filter((c) => !c.completed).slice(0, 3)
  }

  // Calculate gaps (max score is 25 for each pillar)
  const gaps = {
    establishBrand: 25 - ssiScores.establishBrand,
    findPeople: 25 - ssiScores.findPeople,
    engageInsights: 25 - ssiScores.engageInsights,
    buildRelationships: 25 - ssiScores.buildRelationships,
  }

  // Find the weakest pillars
  const sortedPillars = Object.entries(gaps)
    .sort(([, a], [, b]) => b - a)
    .map(([pillar]) => pillar)

  // Score each challenge based on how well it addresses weak pillars
  const scoredChallenges = challenges
    .filter((c) => !c.completed)
    .map((challenge) => {
      const pillars = challengeSSIMapping[challenge.id] || []
      let score = 0

      pillars.forEach((pillarKey) => {
        const pillarName = SSI_PILLARS[pillarKey]
        const pillarIndex = sortedPillars.indexOf(pillarName)
        if (pillarIndex !== -1) {
          // Higher score for addressing weaker pillars
          score += 4 - pillarIndex
        }
      })

      return { challenge, score }
    })
    .sort((a, b) => b.score - a.score)

  return scoredChallenges.slice(0, 3).map((sc) => sc.challenge)
}

// Calculate SSI pillar gaps for display
export function calculateSSIPillars(ssiScores: {
  establishBrand: number
  findPeople: number
  engageInsights: number
  buildRelationships: number
}) {
  return [
    {
      name: SSI_PILLAR_DESCRIPTIONS.establishBrand.name,
      score: ssiScores.establishBrand,
      maxScore: 25,
      description: SSI_PILLAR_DESCRIPTIONS.establishBrand.description,
      gap: 25 - ssiScores.establishBrand,
    },
    {
      name: SSI_PILLAR_DESCRIPTIONS.findPeople.name,
      score: ssiScores.findPeople,
      maxScore: 25,
      description: SSI_PILLAR_DESCRIPTIONS.findPeople.description,
      gap: 25 - ssiScores.findPeople,
    },
    {
      name: SSI_PILLAR_DESCRIPTIONS.engageInsights.name,
      score: ssiScores.engageInsights,
      maxScore: 25,
      description: SSI_PILLAR_DESCRIPTIONS.engageInsights.description,
      gap: 25 - ssiScores.engageInsights,
    },
    {
      name: SSI_PILLAR_DESCRIPTIONS.buildRelationships.name,
      score: ssiScores.buildRelationships,
      maxScore: 25,
      description: SSI_PILLAR_DESCRIPTIONS.buildRelationships.description,
      gap: 25 - ssiScores.buildRelationships,
    },
  ]
}
