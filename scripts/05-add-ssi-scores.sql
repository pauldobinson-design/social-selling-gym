-- Add LinkedIn SSI scores to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS ssi_establish_brand INTEGER CHECK (ssi_establish_brand >= 0 AND ssi_establish_brand <= 25),
ADD COLUMN IF NOT EXISTS ssi_find_people INTEGER CHECK (ssi_find_people >= 0 AND ssi_find_people <= 25),
ADD COLUMN IF NOT EXISTS ssi_engage_insights INTEGER CHECK (ssi_engage_insights >= 0 AND ssi_engage_insights <= 25),
ADD COLUMN IF NOT EXISTS ssi_build_relationships INTEGER CHECK (ssi_build_relationships >= 0 AND ssi_build_relationships <= 25),
ADD COLUMN IF NOT EXISTS ssi_total_score INTEGER CHECK (ssi_total_score >= 0 AND ssi_total_score <= 100),
ADD COLUMN IF NOT EXISTS ssi_last_updated TIMESTAMP WITH TIME ZONE;

-- Create index for querying users by SSI scores
CREATE INDEX IF NOT EXISTS idx_users_ssi_total ON users(ssi_total_score DESC);

-- Add comment explaining SSI columns
COMMENT ON COLUMN users.ssi_establish_brand IS 'LinkedIn SSI: Establish Your Professional Brand (0-25)';
COMMENT ON COLUMN users.ssi_find_people IS 'LinkedIn SSI: Find the Right People (0-25)';
COMMENT ON COLUMN users.ssi_engage_insights IS 'LinkedIn SSI: Engage with Insights (0-25)';
COMMENT ON COLUMN users.ssi_build_relationships IS 'LinkedIn SSI: Build Relationships (0-25)';
COMMENT ON COLUMN users.ssi_total_score IS 'LinkedIn SSI: Total Score (0-100)';
