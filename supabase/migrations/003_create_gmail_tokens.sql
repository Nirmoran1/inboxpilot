CREATE TABLE gmail_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gmail_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can access tokens (never the frontend)
CREATE POLICY "Service role only" ON gmail_tokens
  USING (FALSE); -- blocked for all client requests, service key bypasses
