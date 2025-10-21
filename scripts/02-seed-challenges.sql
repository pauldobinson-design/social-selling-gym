-- Seed initial challenges
INSERT INTO challenges (title, description, difficulty, category, xp_reward, time_estimate) VALUES
('Cold Outreach Email', 'Write a compelling cold outreach email to a potential client in the SaaS industry. Focus on personalization and value proposition.', 'Beginner', 'Email', 50, '15 min'),
('LinkedIn Connection Request', 'Craft a personalized LinkedIn connection request that stands out and encourages acceptance.', 'Beginner', 'LinkedIn', 30, '10 min'),
('Follow-up Message', 'Write a follow-up message to a prospect who hasn''t responded to your initial outreach in 5 days.', 'Intermediate', 'Email', 75, '20 min'),
('Value Proposition Pitch', 'Create a 2-minute elevator pitch for a B2B software product that solves workflow automation problems.', 'Intermediate', 'Pitch', 100, '30 min'),
('Objection Handling', 'Respond to a prospect who says "Your solution is too expensive" with a value-focused rebuttal.', 'Advanced', 'Negotiation', 150, '25 min'),
('Discovery Call Script', 'Write a discovery call script with 10 qualifying questions for a potential enterprise client.', 'Advanced', 'Call Script', 200, '45 min'),
('Social Media Post', 'Create an engaging LinkedIn post about a recent industry trend that positions you as a thought leader.', 'Beginner', 'Social Media', 40, '15 min'),
('Proposal Summary', 'Write a compelling executive summary for a proposal to a Fortune 500 company.', 'Advanced', 'Proposal', 175, '40 min')
ON CONFLICT DO NOTHING;
