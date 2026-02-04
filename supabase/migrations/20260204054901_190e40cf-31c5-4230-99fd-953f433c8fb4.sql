-- Create storage bucket for uploaded images
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('images', 'images', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow anyone to upload images (for admin usage)
CREATE POLICY "Allow upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow anyone to update their images
CREATE POLICY "Allow update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Allow anyone to delete images
CREATE POLICY "Allow delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');