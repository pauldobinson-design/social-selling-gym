import { CHALLENGES } from "@/data/challenges";

export function recommendBySSI(ssi: { brand: number; people: number; insights: number; relationships: number }) {
  const entries = [
    ["brand", ssi.brand],
    ["people", ssi.people],
    ["insights", ssi.insights],
    ["relationships", ssi.relationships]
  ] as const;
  const weakest = entries.sort((a, b) => a[1] - b[1])[0][0];
  const tagMap: Record<string, string[]> = {
    brand: ["brand", "content"],
    people: ["prospecting"],
    insights: ["insights", "commenting"],
    relationships: ["relationships", "follow-up"]
  };
  const tags = tagMap[weakest] || [];
  const filtered = CHALLENGES.filter(c => c.tags?.some((t: string) => tags.includes(t)));
  return (filtered.length ? filtered : CHALLENGES).slice(0, 3);
}
