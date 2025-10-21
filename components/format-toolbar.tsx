// components/format-toolbar.tsx
"use client";

import { useRef } from "react";
import { formatText } from "@/lib/formatter";

type Props = {
  value: string;
  onChange: (s: string) => void;
  textareaId?: string; // optional: to manipulate selection
};

export default function FormatToolbar({ value, onChange, textareaId = "post-draft" }: Props) {
  const lastSel = useRef<{ start: number; end: number } | null>(null);

  function withSelection(cb: (text: string, start: number, end: number) => string) {
    const ta = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    lastSel.current = { start, end };
    const next = cb(value, start, end);
    onChange(next);
    // restore selection (best effort)
    queueMicrotask(() => {
      const n = document.getElementById(textareaId) as HTMLTextAreaElement | null;
      if (!n) return;
      if (lastSel.current) {
        n.focus();
        const s = Math.min(next.length, lastSel.current.start);
        const e = Math.min(next.length, lastSel.current.end);
        n.setSelectionRange(s, e);
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn" onClick={() => withSelection((t,s,e)=>formatText.wrap(t,s,e,"**","**"))}><b>B</b></button>
      <button className="btn" onClick={() => withSelection((t,s,e)=>formatText.wrap(t,s,e,"_","_"))}><i>I</i></button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.toBullets(t))}>• Bullets</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.toNumbered(t))}>1. Numbered</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.blockQuote(t))}>“” Quote</button>
      <button className="btn" onClick={() => withSelection((t,s,e)=>formatText.transformSelection(t,s,e,(x)=>x.toUpperCase()))}>AA</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.stripEmojis(t))}>🚫 Emoji</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.smartQuotes(t))}>Smart ‘quotes’</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.tidyWhitespace(t))}>Trim</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.ensureLinkedInSpacing(t))}>Ln breaks</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.hashHighlight(t))}># Hashtags</button>
    </div>
  );
}
