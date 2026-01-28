-- Create site_config table to store configuration with real-time sync
CREATE TABLE public.site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text UNIQUE NOT NULL DEFAULT 'main',
  recipient_name text NOT NULL DEFAULT 'Birthday Star',
  birthday_date timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  timezone text NOT NULL DEFAULT 'UTC',
  profile_image_url text DEFAULT '',
  voice_message_url text DEFAULT '',
  background_music_url text DEFAULT '',
  instagram_link text DEFAULT '',
  countdown_title text NOT NULL DEFAULT '🎉 Birthday Countdown 🎉',
  countdown_subtitle text NOT NULL DEFAULT '✨ A special day is on the way… Let''s countdown to the magical moment! ✨',
  star_page_message text NOT NULL DEFAULT '🌸 Happy Birthday, beautiful soul! 💕 Today the universe shines brighter because it''s YOUR day. 🌸',
  cake_page_title text NOT NULL DEFAULT '🎂 Cake Cutting 🎂',
  cake_page_subtitle text NOT NULL DEFAULT 'Make a wish and celebrate!',
  letter_title text NOT NULL DEFAULT '💌 To My Amazing Friend',
  letter_paragraphs jsonb NOT NULL DEFAULT '[{"id":"1","content":"Happy Birthday, bestie! 🎉 Today is all about celebrating YOU!"}]'::jsonb,
  letter_signature text NOT NULL DEFAULT 'With loads of love & friendship,',
  sender_name text NOT NULL DEFAULT 'HMXPANEL',
  final_reveal_message text NOT NULL DEFAULT 'May your day be filled with joy, laughter, and all the love in the world!',
  memories jsonb NOT NULL DEFAULT '[]'::jsonb,
  quiz_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  show_memory_timeline boolean NOT NULL DEFAULT true,
  show_voice_message boolean NOT NULL DEFAULT true,
  show_wish_vault boolean NOT NULL DEFAULT true,
  show_final_reveal boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS (public read, only authenticated for write - but we'll allow public read for now)
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the config (public site)
CREATE POLICY "Anyone can read site config"
  ON public.site_config
  FOR SELECT
  USING (true);

-- Allow anyone to update the config (admin panel uses client-side auth)
CREATE POLICY "Anyone can update site config"
  ON public.site_config
  FOR UPDATE
  USING (true);

-- Allow insert for initial setup
CREATE POLICY "Anyone can insert site config"
  ON public.site_config
  FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_site_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_config_timestamp
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_site_config_updated_at();

-- Enable realtime for site_config table
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_config;

-- Insert default config
INSERT INTO public.site_config (
  config_key,
  recipient_name,
  birthday_date,
  timezone,
  profile_image_url,
  instagram_link,
  letter_paragraphs,
  memories,
  quiz_questions
) VALUES (
  'main',
  'Dristi',
  '2026-08-29T00:00:00+05:30',
  'Asia/Kolkata',
  'https://i.supaimg.com/3c6ca851-1689-4e6a-a7aa-6c30931afd1a.jpg',
  'https://www.instagram.com/reel/DMPCXX_I8pO/?igsh=MWVzeXZhd3YzdnByNg==',
  '[
    {"id":"1","content":"Happy Birthday, bestie! 🎉 Today is all about celebrating YOU – the laughter you bring, the craziness we share, and the countless memories that make our friendship so special. 💕"},
    {"id":"2","content":"From silly jokes to endless talks, you''ve been a constant source of happiness in my life. 🌸 Thank you for always being the kind, caring, and wonderful person that you are."},
    {"id":"3","content":"On this special day, I wish you loads of happiness, unlimited cake, and all the success your heart desires. 🎂✨"},
    {"id":"4","content":"May this year bring you new adventures, exciting opportunities, and moments that you''ll never forget. Because honestly, you deserve nothing less than the absolute best. 🌟"},
    {"id":"5","content":"Keep shining, keep smiling, and never forget that your friends will always be here to cheer you on. 💖"}
  ]'::jsonb,
  '[
    {"id":"m1","title":"The Day We First Met","description":"That moment when our paths crossed and a beautiful friendship began 💫","emoji":"👋","mediaType":"none","mediaUrl":""},
    {"id":"m2","title":"Our Endless Conversations","description":"Hours of talking, laughing, and sharing our deepest thoughts 💬","emoji":"💭","mediaType":"none","mediaUrl":""},
    {"id":"m3","title":"The Funniest Memory","description":"Remember when we couldn''t stop laughing? Those are the best moments! 😂","emoji":"🤣","mediaType":"none","mediaUrl":""},
    {"id":"m4","title":"Supporting Each Other","description":"Through thick and thin, we''ve always had each other''s backs 🤝","emoji":"💪","mediaType":"none","mediaUrl":""},
    {"id":"m5","title":"Adventures Together","description":"Every moment with you turns into an unforgettable adventure ✨","emoji":"🌟","mediaType":"none","mediaUrl":""},
    {"id":"m6","title":"Today & Forever","description":"Celebrating you today and cherishing our friendship always 💖","emoji":"🎂","mediaType":"none","mediaUrl":""}
  ]'::jsonb,
  '[
    {"question":"What makes Dristi smile the most?","options":["Kind words","Good food","Quality time","All of the above! 💖"],"correct":3},
    {"question":"What''s the best way to celebrate her?","options":["Throw a surprise party","Write heartfelt wishes","Give her cake","Just be there for her"],"correct":3},
    {"question":"What makes today special?","options":["It''s just another day","It''s DRISTI''S BIRTHDAY! 🎂","Nothing much","I forgot..."],"correct":1}
  ]'::jsonb
);