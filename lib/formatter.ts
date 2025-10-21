// lib/formatter.ts
const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g;

function sliceSel(t: string, s: number, e: number) {
  return [t.slice(0, s), t.slice(s, e), t.slice(e)] as const;
}

export const formatText = {
  wrap(t: string, s: number, e: number, pre: string, post: string) {
    if (s === e) return t; // nothing selected
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
    const out = lines.map((l) => (l.trim() ? `• ${l.replace(/^(\d+\.|\-|\*)\s*/, "")}` : "")).join("\n");
    return out;
  },

  toNumbered(t: string) {
    const lines = t.split("\n").filter((l) => l.trim().length > 0);
    const out = lines.map((l, i) => `${i + 1}. ${l.replace(/^(\d+\.|\-|\*|•)\s*/, "")}`).join("\n");
    return out;
  },

  blockQuote(t: string) {
    // add “ ” around selection or each line
    const lines = t.split("\n");
    return lines.map((l) => (l.trim() ? `“${l.trim()}”` : "")).join("\n");
  },

  stripEmojis(t: string) {
    return t.replace(emojiRegex, "");
  },

  smartQuotes(t: string) {
    // naive smart quotes: replace straight quotes
    return t
      .replace(/(^|[\s([{<])"(?=\S)/g, "$1“")
      .replace(/"(?=[$\s)\]}>.,!?:;]|$)/g, "”")
      .replace(/(^|[\s([{<])'(?=\S)/g, "$1‘")
      .replace(/'(?=[$\s)\]}>.,!?:;]|$)/g, "’");
  },

  tidyWhitespace(t: string) {
    return t
      .replace(/[ \t]+$/gm, "")         // strip line-end spaces
      .replace(/\n{3,}/g, "\n\n")       // max 2 consecutive newlines
      .replace(/[ \t]{2,}/g, " ");      // collapse multiple spaces
  },

  ensureLinkedInSpacing(t: string) {
    // add a blank line between blocks > 120 chars to improve scannability
    const parts = t.split("\n");
    const out: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const line = parts[i];
      out.push(line);
      if (line.trim().length > 120 && (i + 1 < parts.length) && parts[i + 1].trim() !== "") {
        out.push("");
      }
    }
    return out.join("\n");
  },

  hashHighlight(t: string) {
    // normalise hashtags (lowercase, no punctuation except _)
    return t.replace(/(^|\s)#([a-zA-Z0-9_\-]+)/g, (m, sp, tag) => `${sp}#${tag.toLowerCase().replace(/[^a-z0-9_]/gi,"")}`);
  },

  stats(t: string) {
    const words = t.trim().split(/\s+/).filter(Boolean).length;
    const chars = t.length;
    const lines = t.split("\n").length;
    return { words, chars, lines, idealWords: words >= 220 && words <= 280 };
  }
};
