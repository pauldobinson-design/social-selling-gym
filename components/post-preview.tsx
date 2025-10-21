// components/post-preview.tsx
"use client";

type Props = { text: string; author?: { name?: string; title?: string } };

function renderLinkedIn(text: string) {
  // Very light “LinkedIn-like”: convert **bold** and _italic_, linkify urls, newline to <br/>
  const linkified = text.replace(
    /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/g,
    (m) => `<a href="${m.startsWith("http") ? m : `https://${m}`}" target="_blank" rel="noreferrer">${m}</a>`
  );
  const bolded = linkified.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const italic = bolded.replace(/_(.+?)_/g, "<em>$1</em>");
  const hashed = italic.replace(/(^|\s)#([a-zA-Z0-9_]{2,})/g, '$1<span class="text-primary">#$2</span>');
  return hashed.split("\n").map((line, i) => `<p class="mb-3 leading-relaxed">${line || "&nbsp;"}</p>`).join("");
}

export default function PostPreview({ text, author }: Props) {
  const html = renderLinkedIn(text);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div>
          <div className="font-medium">{author?.name || "You"}</div>
          <div className="text-xs text-gray-600">{author?.title || "Social Seller"}</div>
        </div>
      </div>
      <div className="prose prose-sm max-w-none [&_p]:m-0 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mt-3 text-xs text-gray-500">Preview — formatting approximation</div>
    </div>
  );
}
