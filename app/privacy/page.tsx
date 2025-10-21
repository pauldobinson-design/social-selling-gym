export default function Privacy() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="text-gray-700">We store only what we need to run your account: name, email, and your Social Selling Gym profile (SSI scores and XP). We never sell your data.</p>
      <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
        <li>Authentication uses Google Sign-In via NextAuth.</li>
        <li>Profile data is stored in our database and can be deleted on request.</li>
        <li>Content you submit for AI feedback is processed transiently to return suggestions.</li>
      </ul>
      <p className="text-gray-700 text-sm">Questions? Email: hello@socialselling.store</p>
    </div>
  );
}
