// lib/formatter.ts
const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g;

function sliceSel(t: string, s: number, e: number) {
  return [t.slice(0, s), t.slice(s, e), t.slice(e)] as const;
}

export const formatText = {
  wrap(t: string, s: number, e: number, pre: string, post: string) {
    if (s === e) return t;
    const [a, mid, b] = sliceSel(t, s, e);
    return `${a}${pre}${mid}${post}${b}`;
  },

  transformSelection(t: string, s: number, e: number, fn: (x: string) => string) {
    if (s === e) return fn(t);
    const [a, mid, b] = sliceSel(t, s, e);
    return `${a}${fn(mid)}${b}`;
  },

  toBullets(t: string) {
    const lines = t.split("\n");
    return lines.map((l) => (l.trim() ? `• ${l.replace(/^(\d+\.|\-|\*)\s*/, "")}` : "")).join("\n");
  },

  toNumbered(t: string) {
    const lines = t.split("\n").filter((l) => l.trim());
    return lines.map((l, i) => `${i + 1}. ${l.replace(/^(\d+\.|\-|\*|•)\s*/, "")}`).join("\n");
  },

  blockQuote(t: string) {
    return t.split("\n").map((l) => (l.trim() ? `“${l.trim()}”` : "")).join("\n");
  },

  stripEmojis(t: string) {
    return t.replace(emojiRegex, "");
  },

  smartQuotes(t: string) {
    return t
      .replace(/(^|[\s([{<])"(?=\S)/g, "$1“")
      .replace(/"(?=[$\s)\]}>.,!?:;]|$)/g, "”")
      .replace(/(^|[\s([{<])'(?=\S)/g, "$1‘")
      .replace(/'(?=[$\s)\]}>.,!?:;]|$)/g, "’");
  },

  tidyWhitespace(t: string) {
    return t.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ");
  },

  ensureLinkedInSpacing(t: string) {
    const parts = t.split("\n");
    const out: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const line = parts[i];
      out.push(line);
      if (line.trim().length > 120 && i + 1 < parts.length && parts[i + 1].trim() !== "") out.push("");
    }
    return out.join("\n");
  },

  hashHighlight(t: string) {
    return t.replace(/(^|\s)#([a-zA-Z0-9_\-]+)/g, (m, sp, tag) => `${sp}#${tag.toLowerCase().replace(/[^a-z0-9_]/gi,"")}`);
  },

  shorten(t: string, _pct = 0.9) {
    const fillers = /\b(just|really|very|actually|basically|in order to|kind of|sort of)\b/gi;
    let out = t.replace(fillers, "");
    return out.replace(/[ \t]{2,}/g, " ").trim();
  },

  stats(t: string) {
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    return { words, chars: t.length, lines: t.split("\n").length, idealWords: words >= 220 && words <= 280 };
  }
};
