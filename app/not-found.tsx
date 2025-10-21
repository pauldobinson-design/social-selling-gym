export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-gray-700">The page you’re after isn’t here.</p>
      <a className="btn" href="/dashboard">Back to dashboard</a>
    </div>
  );
}
