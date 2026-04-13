CREATE TABLE classification_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gmail_message_id TEXT NOT NULL,
  category TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  classified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, gmail_message_id)
);

ALTER TABLE classification_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own cache" ON classification_cache
  FOR ALL USING (auth.uid() = user_id);
