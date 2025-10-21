"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-gray-700">Please try again.</p>
      <div className="flex gap-2">
        <button className="btn" onClick={() => reset()}>Retry</button>
        <a className="btn" href="/dashboard">Back to dashboard</a>
      </div>
    </div>
  );
}
