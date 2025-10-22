// components/format-toolbar.tsx
"use client";

import { useRef } from "react";
import { formatText } from "@/lib/formatter";

type Props = { value: string; onChange: (s: string) => void; textareaId?: string };

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
    queueMicrotask(() => {
      const n = document.getElementById(textareaId) as HTMLTextAreaElement | null;
      if (!n || !lastSel.current) return;
      n.focus();
      const s = Math.min(next.length, lastSel.current.start);
      const e = Math.min(next.length, lastSel.current.end);
      n.setSelectionRange(s, e);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn" onClick={() => withSelection((t,s,e)=>formatText.unicodeBold(t,s,e))}><b>B</b></button>
      <button className="btn" onClick={() => withSelection((t,s,e)=>formatText.unicodeItalic(t,s,e))}><i>I</i></button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.toBullets(t))}>• Bullets</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.toNumbered(t))}>1. Numbered</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.blockQuote(t))}>“” Quote</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.stripEmojis(t))}>🚫 Emoji</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.smartQuotes(t))}>Smart ‘quotes’</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.tidyWhitespace(t))}>Trim</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.ensureLinkedInSpacing(t))}>Scannable</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.hashHighlight(t))}># Hashtags</button>
      <button className="btn" onClick={() => withSelection((t)=>formatText.shorten(t, 0.9))}>-10% length</button>
    </div>
  );
}
