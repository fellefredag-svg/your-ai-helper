
CREATE TABLE public.chat_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read users (for the user list)
CREATE POLICY "Anyone can view chat users"
ON public.chat_users
FOR SELECT
USING (true);

-- Allow anyone to insert (registration)
CREATE POLICY "Anyone can register"
ON public.chat_users
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update (admin kick via app-level password check)
CREATE POLICY "Anyone can update chat users"
ON public.chat_users
FOR UPDATE
USING (true);
