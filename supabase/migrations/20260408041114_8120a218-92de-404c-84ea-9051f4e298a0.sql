
-- Add status and scheduling columns
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS scheduled_at timestamp with time zone;

-- Sync existing data
UPDATE public.blog_posts SET status = 'published' WHERE published = true;
UPDATE public.blog_posts SET status = 'draft' WHERE published = false;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can read published posts" ON public.blog_posts;

-- Helper function using text cast to avoid enum transaction issues
CREATE OR REPLACE FUNCTION public.has_editor_or_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text IN ('admin', 'editor')
  )
$$;

-- Admins and editors can view all posts; contributors see own posts
CREATE POLICY "Admins and editors can view all posts"
ON public.blog_posts FOR SELECT TO authenticated
USING (has_editor_or_admin_role(auth.uid()) OR (created_by = auth.uid()));

-- Any role can insert posts
CREATE POLICY "Authenticated users can insert posts"
ON public.blog_posts FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'editor'::app_role)
  OR has_role(auth.uid(), 'contributor'::app_role)
);

-- Admins/editors update any; contributors only own
CREATE POLICY "Users can update posts based on role"
ON public.blog_posts FOR UPDATE TO authenticated
USING (has_editor_or_admin_role(auth.uid()) OR (created_by = auth.uid()));

-- Only admins can delete
CREATE POLICY "Only admins can delete posts"
ON public.blog_posts FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public reads published
CREATE POLICY "Anyone can read published posts"
ON public.blog_posts FOR SELECT TO public
USING (status = 'published');
