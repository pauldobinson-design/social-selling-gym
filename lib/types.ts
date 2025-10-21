export interface User {
  id: string
  name: string
  email: string
  xp: number
  level: number
  streak: number
  avatar?: string
  settings?: UserSettings // Added settings field to User interface
}

export interface UserSettings {
  openaiApiKey?: string // Added UserSettings type for storing OpenAI API key
  linkedinSSI?: LinkedInSSI // Added LinkedIn SSI scores
}

export interface LinkedInSSI {
  establishBrand: number // 0-25: Professional brand score
  findPeople: number // 0-25: Finding right people score
  engageInsights: number // 0-25: Engaging with insights score
  buildRelationships: number // 0-25: Building relationships score
  totalScore: number // 0-100: Total SSI score
  lastUpdated: Date
}

export interface SSIPillar {
  name: string
  score: number
  maxScore: number
  description: string
  gap: number // How far from max score
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  xpReward: number
  category: string
  prompt: string
  completed?: boolean
  isRealWorld?: boolean // Whether this is a real-world challenge (share to social)
  platform?: "linkedin" | "twitter" | "email" // Target platform for sharing
  ssiPillar?: "establishBrand" | "findPeople" | "engageInsights" | "buildRelationships" // Maps to LinkedIn SSI pillar
}

export interface Submission {
  id: string
  challengeId: string
  userId: string
  content: string
  feedback?: AIFeedback
  submittedAt: Date
  xpEarned: number
  shared?: boolean // Whether user actually shared to social media
  sharedAt?: Date
  platform?: string
}

export interface AIFeedback {
  score: number
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
}

export interface Template {
  id: string
  title: string
  description: string
  category: string
  content: string
  usageCount: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  xp: number
  level: number
  avatar?: string
}
