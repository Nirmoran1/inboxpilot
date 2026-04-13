CREATE TABLE action_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'archive', 'label', 'undo'
  gmail_message_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE action_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own actions" ON action_log
  FOR ALL USING (auth.uid() = user_id);
