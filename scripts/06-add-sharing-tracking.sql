-- Add sharing tracking to submissions table
ALTER TABLE submissions
ADD COLUMN shared BOOLEAN DEFAULT FALSE,
ADD COLUMN shared_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN platform TEXT;

-- Add real-world challenge fields to challenges table
ALTER TABLE challenges
ADD COLUMN is_real_world BOOLEAN DEFAULT FALSE,
ADD COLUMN platform TEXT,
ADD COLUMN ssi_pillar TEXT;

-- Create index for querying shared submissions
CREATE INDEX idx_submissions_shared ON submissions(shared, shared_at);

-- Create index for real-world challenges
CREATE INDEX idx_challenges_real_world ON challenges(is_real_world, platform);

COMMENT ON COLUMN submissions.shared IS 'Whether the user actually shared this content to social media';
COMMENT ON COLUMN submissions.shared_at IS 'Timestamp when content was shared';
COMMENT ON COLUMN submissions.platform IS 'Platform where content was shared (linkedin, twitter, email)';
COMMENT ON COLUMN challenges.is_real_world IS 'Whether this is a real-world challenge requiring actual social sharing';
COMMENT ON COLUMN challenges.platform IS 'Target platform for this challenge';
COMMENT ON COLUMN challenges.ssi_pillar IS 'LinkedIn SSI pillar this challenge targets';
