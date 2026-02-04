-- Add show_quiz column for quiz visibility toggle
ALTER TABLE public.site_config 
ADD COLUMN IF NOT EXISTS show_quiz boolean NOT NULL DEFAULT true;