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
    objective: "Add a comment that advances a prospect’s discussion.",
    level: "Beginner",
    channel: "LinkedIn",
    outcome: "Connect",
    time: "≤10m",
    xp: 50,
    tags: ["insights", "commenting"],
    steps: [
      "Pick a target account leader’s post from today.",
      "Echo one point in your own words.",
      "Add a practical tip or question that moves the convo forward."
    ],
    example: "“Great point on onboarding lag, Sarah. One tactic we saw help is a 2-step welcome flow that… How are you measuring time-to-value today?”",
    rubric: ["Relevance", "Specificity", "No pitch", "Polite"]
  },
  {
    id: "c2",
    title: "Warm DM Follow-up",
    objective: "Turn a like/comment into a DM that earns a reply.",
    level: "Intermediate",
    channel: "LinkedIn",
    outcome: "Nurture",
    time: "10–20m",
    xp: 70,
    tags: ["relationships", "follow-up"],
    steps: [
      "Reference the recent interaction (post, event, comment).",
      "Share one helpful artefact (checklist, short Loom, template).",
      "Ask a soft, single question to invite reply."
    ],
    example: "“Saw your comment on forecasting. Here’s a 5-line template we use… If helpful, happy to share how we set it up.”",
    rubric: ["Personalisation", "Utility", "Brevity", "Clear ask"]
  },
  {
    id: "c3",
    title: "One-slide Value Post",
    objective: "Publish a single image that states problem → outcome → next step.",
    level: "Advanced",
    channel: "LinkedIn",
    outcome: "Meeting",
    time: "20m+",
    xp: 120,
    tags: ["brand", "content"],
    steps: [
      "Pick a painful, specific problem your ICP has.",
      "State the desired outcome with a number.",
      "Offer a simple next step in the caption."
    ],
    rubric: ["Clarity", "Outcome", "Proof", "CTA"]
  },
  {
    id: "c4",
    title: "Account Map Sprint",
    objective: "List 5 stakeholders for one target account.",
    level: "Beginner",
    channel: "LinkedIn",
    outcome: "Nurture",
    time: "10–20m",
    xp: 60,
    tags: ["people", "prospecting"],
    steps: [
      "Pick an account on your target list.",
      "Find 5 roles: buyer, champion, influencer, blocker, signatory.",
      "Save profiles; follow or connect where appropriate."
    ],
    rubric: ["Role coverage", "Relevance", "Notes quality"]
  },
  {
    id: "c5",
    title: "Proof Bank Entry",
    objective: "Document one outcome you helped create.",
    level: "Intermediate",
    channel: "Email",
    outcome: "Meeting",
    time: "10–20m",
    xp: 80,
    tags: ["brand", "proof"],
    steps: [
      "Write a one-sentence case: problem → action → quantified result.",
      "Add context: industry, size, time to value.",
      "Store in your proof bank for reuse."
    ],
    rubric: ["Quantified", "Credible", "Clear"]
  },
  {
    id: "c6",
    title: "Call Prep: 3 Insight Hooks",
    objective: "Prepare 3 sharp openers for your next call.",
    level: "Advanced",
    channel: "Calls",
    outcome: "Meeting",
    time: "≤10m",
    xp: 40,
    tags: ["insights"],
    steps: [
      "Pull one public signal (post, job ad, release note).",
      "Draft three 1-line openings tailored to that signal.",
      "Pick the strongest; practice out loud twice."
    ],
    rubric: ["Relevance", "Brevity", "Strength of hook"]
  }
];
