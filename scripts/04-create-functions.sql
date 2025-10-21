-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp(
  p_user_id UUID,
  p_xp_gained INTEGER
)
RETURNS void AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Update XP
  UPDATE users
  SET xp = xp + p_xp_gained,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp INTO v_new_xp;
  
  -- Calculate new level (100 XP per level)
  v_new_level := FLOOR(v_new_xp / 100) + 1;
  
  -- Update level if changed
  UPDATE users
  SET level = v_new_level
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_active DATE;
  v_current_streak INTEGER;
BEGIN
  SELECT last_active_date, streak
  INTO v_last_active, v_current_streak
  FROM users
  WHERE id = p_user_id;
  
  -- If last active was yesterday, increment streak
  IF v_last_active = CURRENT_DATE - INTERVAL '1 day' THEN
    UPDATE users
    SET streak = streak + 1,
        last_active_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE id = p_user_id;
  -- If last active was today, do nothing
  ELSIF v_last_active = CURRENT_DATE THEN
    -- No change needed
    NULL;
  -- Otherwise, reset streak to 1
  ELSE
    UPDATE users
    SET streak = 1,
        last_active_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit INTEGER DEFAULT 100)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  full_name TEXT,
  xp INTEGER,
  level INTEGER,
  streak INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY u.xp DESC) as rank,
    u.id as user_id,
    u.full_name,
    u.xp,
    u.level,
    u.streak
  FROM users u
  ORDER BY u.xp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
