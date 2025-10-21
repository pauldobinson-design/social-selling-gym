// components/resource-links.tsx
"use client";

type Props = { tags?: string[] };

const LIB: Record<string, { label: string; href: string }[]> = {
  insights: [
    { label: "Commenting that earns replies", href: "https://www.linkedin.com/pulse/how-comment-get-replies/" },
    { label: "Signal-based engagement", href: "https://www.gong.io/blog/social-selling/" }
  ],
  relationships: [
    { label: "Warm DM templates", href: "https://copywritingcourse.com/linkedin-messages/" },
    { label: "From comment to DM", href: "https://www.apollo.io/blog/linkedin-inmail-vs-dm/" }
  ],
  brand: [
    { label: "Outcome-led posts", href: "https://marketingexamples.com/social/linkedin" },
    { label: "One-slide post patterns", href: "https://www.canva.com/learn/social-media-templates/" }
  ],
  people: [
    { label: "Mapping buying committees", href: "https://hbr.org/2017/03/the-new-sales-imperative" },
    { label: "ICP quick start", href: "https://www.lennysnewsletter.com/p/ideal-customer-profile" }
  ],
};

export default function ResourceLinks({ tags = [] }: Props) {
  const seen = new Set<string>();
  const links = tags.flatMap((t) => LIB[t] || []).filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });

  if (links.length === 0) return null;

  return (
    <div className="card p-4 space-y-2">
      <h3 className="text-lg font-semibold">Learn more</h3>
      <ul className="list-disc pl-5 text-sm">
        {links.slice(0, 5).map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
