-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles - users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can manage roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing permissive policies on site_config
DROP POLICY IF EXISTS "Anyone can read site config" ON public.site_config;
DROP POLICY IF EXISTS "Anyone can update site config" ON public.site_config;
DROP POLICY IF EXISTS "Anyone can insert site config" ON public.site_config;

-- Create secure RLS policies for site_config
-- Public can read (for birthday recipient to view)
CREATE POLICY "Public read site config" ON public.site_config
  FOR SELECT
  USING (config_key = 'main');

-- Only admins can update
CREATE POLICY "Admins can update site config" ON public.site_config
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert
CREATE POLICY "Admins can insert site config" ON public.site_config
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop existing permissive storage policies
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update images" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete images" ON storage.objects;

-- Create secure storage policies
-- Public can view images (for birthday site to display)
CREATE POLICY "Public read images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Only admins can upload
CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));