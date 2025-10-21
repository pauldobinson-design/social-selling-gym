"use client";

import { useState } from "react";
import { useMockAuth } from "@/lib/mock-auth";

export default function SSIInputModal() {
  const [open, setOpen] = useState(false);
  const { ssi, setSSI } = useMockAuth();
  const [form, setForm] = useState({
    brand: ssi.brand ?? 0,
    people: ssi.people ?? 0,
    insights: ssi.insights ?? 0,
    relationships: ssi.relationships ?? 0,
  });

  function save() {
    const clamp = (n: any) => Math.max(0, Math.min(25, Number(n) || 0));
    setSSI({
      brand: clamp(form.brand),
      people: clamp(form.people),
      insights: clamp(form.insights),
      relationships: clamp(form.relationships),
    });
    setOpen(false);
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Update SSI
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="card w-full max-w-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">LinkedIn SSI</h2>
            <p className="text-sm text-ink-700">
              Enter your latest SSI scores. You can find them by searching
              “LinkedIn SSI” or visiting{" "}
              <a
                className="underline"
                href="https://www.linkedin.com/sales/ssi"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/sales/ssi
              </a>.
            </p>

            {([
              ["brand", "Establish Professional Brand"],
              ["people", "Find the Right People"],
              ["insights", "Engage with Insights"],
              ["relationships", "Build Relationships"],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  max={25}
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            <div className="flex justify-between items-center text-sm text-ink-700">
              <span>
                Total:{" "}
                {(Number(form.brand) || 0) +
                  (Number(form.people) || 0) +
                  (Number(form.insights) || 0) +
                  (Number(form.relationships) || 0)}{" "}
                / 100
              </span>
              <a
                className="underline"
                href="https://www.linkedin.com/sales/ssi"
                target="_blank"
                rel="noreferrer"
              >
                Open SSI
              </a>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button className="btn" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={save}>
                Save
              </button>
            </div>

            <p className="text-xs text-ink-500">
              Stored locally for now. Link your account to save across devices.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
