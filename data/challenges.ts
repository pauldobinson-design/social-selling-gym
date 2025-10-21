// data/challenges.ts
export type Challenge = {
  id: string;
  title: string;
  objective: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  channel: "LinkedIn" | "Email" | "Calls";
  outcome: "Connect" | "Meeting" | "Nurture";
  time: "≤10m" | "10–20m" | "20m+";
  xp: number;
  tags: string[];
  steps: string[];
  example?: string;
  rubric: string[];
};

export const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Thoughtful Comment",
    objective: "Add a useful comment that advances the discussion.",
    level: "Beginner",
    channel: "LinkedIn",
    outcome: "Connect",
    time: "≤10m",
    xp: 50,
    tags: ["insights", "commenting"],
    steps: [
      "Pick a post from a target account or leader.",
      "Summarise their point in one line.",
      "Add one practical observation or question."
    ],
    rubric: ["Relevance", "Specificity", "No sales pitch"]
  },
  {
    id: "c2",
    title: "Warm DM Follow-up",
    objective: "Send a warm direct message that references a recent interaction.",
    level: "Intermediate",
    channel: "LinkedIn",
    outcome: "Nurture",
    time: "10–20m",
    xp: 70,
    tags: ["relationships", "follow-up"],
    steps: [
      "Reference the prior touch.",
      "Offer something useful.",
      "End with a soft CTA."
    ],
    rubric: ["Personalisation", "Usefulness", "Brevity"]
  },
  {
    id: "c3",
    title: "One-slide Value Pitch",
    objective: "Share a single image post that states a problem and outcome clearly.",
    level: "Advanced",
    channel: "LinkedIn",
    outcome: "Meeting",
    time: "20m+",
    xp: 120,
    tags: ["brand", "content"],
    steps: [
      "Choose a problem your ICP cares about.",
      "State the outcome with a number.",
      "Invite comments or DMs."
    ],
    rubric: ["Clarity", "Outcome", "Proof"]
  }
];
