
-- Create photos table
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read photos" ON public.photos
  FOR SELECT USING (true);

CREATE POLICY "Anon can insert photos" ON public.photos
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anon can delete photos" ON public.photos
  FOR DELETE TO anon, authenticated USING (true);

-- Create access_keys table for member management
CREATE TABLE public.access_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read access keys" ON public.access_keys
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert access keys" ON public.access_keys
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update access keys" ON public.access_keys
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete access keys" ON public.access_keys
  FOR DELETE USING (true);
