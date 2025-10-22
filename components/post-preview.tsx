// components/post-preview.tsx
"use client";

import { useMemo, useState } from "react";

type Props = {
  text: string;
  author?: { name?: string; title?: string };
  showFold?: boolean;
  foldLines?: number; // visible lines before "See more"
};

function renderRich(text: string) {
  const linkified = text.replace(
    /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/g,
    (m) => `<a href="${m.startsWith("http") ? m : `https://${m}`}" target="_blank" rel="noreferrer">${m}</a>`
  );
  const mentions = linkified.replace(/(^|\s)@([a-zA-Z0-9_]{2,})/g, '$1<span class="text-primary">@$2</span>');
  const hashed   = mentions.replace(/(^|\s)#([a-zA-Z0-9_]{2,})/g, '$1<span class="text-primary">#$2</span>');
  return hashed;
}

export default function PostPreview({ text, author, showFold = true, foldLines = 3 }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Cut after N non-empty lines (closer to LinkedIn behaviour)
  const { above, below } = useMemo(() => {
    if (!showFold || foldLines <= 0) return { above: text, below: "" };
    const lines = text.split("\n");
    let count = 0, cutIndex = lines.length;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().length > 0) count++;
      if (count === foldLines) { cutIndex = i + 1; break; }
    }
    if (count < foldLines) return { above: text, below: "" };
    return { above: lines.slice(0, cutIndex).join("\n"), below: lines.slice(cutIndex).join("\n") };
  }, [text, showFold, foldLines]);

  function toHtml(block: string) {
    const rich = renderRich(block);
    return rich.split("\n").map((line) => `<p class="mb-3 leading-relaxed">${line || "&nbsp;"}</p>`).join("");
  }

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div>
          <div className="font-medium">{author?.name || "You"}</div>
          <div className="text-xs text-gray-600">{author?.title || "Social Seller"}</div>
        </div>
      </div>

      <div className="prose prose-sm max-w-none [&_p]:m-0 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: toHtml(above) }} />

      {showFold && below && !expanded && (
        <div className="mt-1 flex items-center gap-2 text-gray-600 text-sm">
          <div className="h-px flex-1 bg-gray-200" />
          <button className="underline underline-offset-2" onClick={() => setExpanded(true)}>… more</button>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
      )}

      {expanded && below && (
        <>
          <div className="prose prose-sm max-w-none mt-3 [&_p]:m-0 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: toHtml(below) }} />
          <div className="mt-2">
            <button className="text-xs text-gray-600 underline underline-offset-2" onClick={() => setExpanded(false)}>
              Collapse
            </button>
          </div>
        </>
      )}

      <div className="mt-3 text-xs text-gray-500">Preview — approximation of LinkedIn truncation (3 lines).</div>
    </div>
  );
}
