// components/post-preview.tsx
"use client";

import { useMemo, useState } from "react";

type Props = {
  text: string;
  author?: { name?: string; title?: string };
  showFold?: boolean;           // show "... See more" fold
  approxCharsPerFold?: number;  // override if you want
};

// Very light “LinkedIn-ish” rendering
function renderRich(text: string) {
  const linkified = text.replace(
    /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/g,
    (m) => `<a href="${m.startsWith("http") ? m : `https://${m}`}" target="_blank" rel="noreferrer">${m}</a>`
  );
  const mentions = linkified.replace(/(^|\s)@([a-zA-Z0-9_]{2,})/g, '$1<span class="text-primary">@$2</span>');
  const bolded   = mentions.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const italic   = bolded.replace(/_(.+?)_/g, "<em>$1</em>");
  const hashed   = italic.replace(/(^|\s)#([a-zA-Z0-9_]{2,})/g, '$1<span class="text-primary">#$2</span>');
  return hashed;
}

export default function PostPreview({
  text,
  author,
  showFold = true,
  approxCharsPerFold = 220, // ~LinkedIn mobile "See more" feel
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const { above, below } = useMemo(() => {
    if (!showFold) return { above: text, below: "" };
    if (text.length <= approxCharsPerFold) return { above: text, below: "" };
    // cut on a word boundary near fold estimate
    let cut = approxCharsPerFold;
    while (cut < text.length && !/\s/.test(text[cut])) cut++;
    return { above: text.slice(0, cut).trim(), below: text.slice(cut).trim() };
  }, [text, showFold, approxCharsPerFold]);

  const htmlAbove = useMemo(() => {
    const rich = renderRich(above);
    return rich
      .split("\n")
      .map((line) => `<p class="mb-3 leading-relaxed">${line || "&nbsp;"}</p>`)
      .join("");
  }, [above]);

  const htmlBelow = useMemo(() => {
    const rich = renderRich(below);
    return rich
      .split("\n")
      .map((line) => `<p class="mb-3 leading-relaxed">${line || "&nbsp;"}</p>`)
      .join("");
  }, [below]);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div>
          <div className="font-medium">{author?.name || "You"}</div>
          <div className="text-xs text-gray-600">{author?.title || "Social Seller"}</div>
        </div>
      </div>

      {/* Above-the-fold */}
      <div className="prose prose-sm max-w-none [&_p]:m-0 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: htmlAbove }} />

      {/* Fold line */}
      {showFold && below && !expanded && (
        <div className="fold-line">
    <button
      className="underline underline-offset-2"
      onClick={() => setExpanded(true)}
    >
      …  more
    </button>
  </div>
)}

      {/* Below-the-fold (toggle) */}
      {expanded && below && (
        <div className="prose prose-sm max-w-none mt-3 [&_p]:m-0 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: htmlBelow }} />
      )}

      {expanded && below && (
        <div className="mt-2">
          <button className="text-xs text-gray-600 underline underline-offset-2" onClick={() => setExpanded(false)}>
            Collapse
          </button>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">Preview — approximation of LinkedIn truncation.</div>
    </div>
  );
}
