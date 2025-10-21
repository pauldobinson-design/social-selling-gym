export interface User {
  id: string
  name: string
  email: string
  xp: number
  level: number
  streak: number
  avatar?: string
  profile?: Profile
}

export interface Profile {
  ssiPillars?: LinkedInSSI
  openaiApiKey?: string
  industry?: string
  targetAudience?: string
  company?: string
}

export interface LinkedInSSI {
  establishBrand: number
  findPeople: number
  engageInsights: number
  buildRelationships: number
  totalScore: number
  lastUpdated: Date
}

export interface Challenge {
  id: string
  title: string
  description: string
  objective: string
  example?: string
  steps: string[]
  rubric: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  xpReward: number
  estimatedTime: string
  category: string
  channel?: "LinkedIn" | "Email" | "Calls"
  outcome?: "Connect" | "Meeting" | "Nurture"
  ssiPillar?: "establishBrand" | "findPeople" | "engageInsights" | "buildRelationships"
  completed?: boolean
}

export interface Submission {
  id: string
  challengeId: string
  userId: string
  content: string
  feedback?: AIFeedback
  submittedAt: Date
  xpEarned: number
  shared?: boolean
  sharedAt?: Date
  platform?: string
}

export interface AIFeedback {
  score: number
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
}

export interface Pitch {
  id: string
  userId: string
  industry: string
  targetAudience: string
  problem: string
  outcome: string
  proof: string
  differentiator: string
  cta: string
  pitchText: string
  score?: PitchScore
  createdAt: Date
  isDefault?: boolean
}

export interface PitchScore {
  overall: number
  clarity: number
  audienceFit: number
  outcomeStrength: number
  proof: number
  brevity: number
  voice: number
  edits: string[]
  improvedVersion: string
}

export interface Post {
  id: string
  userId: string
  content: string
  tone: "Challenger" | "Trusted Guide" | "Earned Humour" | "Executive Tight"
  score?: PostScore
  createdAt: Date
  shared?: boolean
  platform?: string
}

export interface PostScore {
  overall: number
  hookStrength: number
  narrativeFlow: number
  commentPotential: number
  feedback: string
  suggestions: string[]
}

export interface Template {
  id: string
  title: string
  description: string
  category: string
  content: string
  variables: string[]
  usageCount: number
}

export interface XPEvent {
  id: string
  userId: string
  amount: number
  source: string
  createdAt: Date
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  xp: number
  level: number
  avatar?: string
  industry?: string
  company?: string
}
