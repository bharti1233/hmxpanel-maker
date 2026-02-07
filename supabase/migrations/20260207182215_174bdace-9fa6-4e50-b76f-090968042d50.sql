-- Create birthday_recipients table with all config fields
CREATE TABLE public.birthday_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  
  -- Core details
  recipient_name text NOT NULL DEFAULT 'Birthday Star',
  birthday_date timestamp with time zone NOT NULL DEFAULT (now() + interval '30 days'),
  timezone text NOT NULL DEFAULT 'UTC',
  
  -- Media URLs
  profile_image_url text DEFAULT '',
  voice_message_url text DEFAULT '',
  background_music_url text DEFAULT '',
  instagram_link text DEFAULT '',
  
  -- Page content
  countdown_title text NOT NULL DEFAULT '🎉 Birthday Countdown 🎉',
  countdown_subtitle text NOT NULL DEFAULT '✨ A special day is on the way… Let''s countdown to the magical moment! ✨',
  star_page_message text NOT NULL DEFAULT '🌸 Happy Birthday, beautiful soul! 💕 Today the universe shines brighter because it''s YOUR day. 🌸',
  cake_page_title text NOT NULL DEFAULT '🎂 Cake Cutting 🎂',
  cake_page_subtitle text NOT NULL DEFAULT 'Make a wish and celebrate!',
  letter_title text NOT NULL DEFAULT '💌 To My Amazing Friend',
  letter_paragraphs jsonb NOT NULL DEFAULT '[{"id": "1", "content": "Happy Birthday! 🎉 Today is all about celebrating YOU!"}]'::jsonb,
  letter_signature text NOT NULL DEFAULT 'With loads of love & friendship,',
  sender_name text NOT NULL DEFAULT 'HMXPANEL',
  final_reveal_message text NOT NULL DEFAULT 'May your day be filled with joy, laughter, and all the love in the world!',
  
  -- Memories & Quiz
  memories jsonb NOT NULL DEFAULT '[]'::jsonb,
  quiz_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  -- Section visibility
  show_memory_timeline boolean NOT NULL DEFAULT true,
  show_voice_message boolean NOT NULL DEFAULT true,
  show_wish_vault boolean NOT NULL DEFAULT true,
  show_final_reveal boolean NOT NULL DEFAULT true,
  show_quiz boolean NOT NULL DEFAULT true,
  
  -- Metadata
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.birthday_recipients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage recipients"
ON public.birthday_recipients
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read by slug for password verification"
ON public.birthday_recipients
FOR SELECT
USING (true);

-- Create index for slug lookups
CREATE INDEX idx_birthday_recipients_slug ON public.birthday_recipients(slug);

-- Create trigger for updated_at
CREATE TRIGGER update_birthday_recipients_updated_at
BEFORE UPDATE ON public.birthday_recipients
FOR EACH ROW
EXECUTE FUNCTION public.update_site_config_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.birthday_recipients;