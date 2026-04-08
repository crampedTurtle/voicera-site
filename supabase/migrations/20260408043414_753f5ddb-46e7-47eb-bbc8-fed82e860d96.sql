
-- Create post_revisions table
CREATE TABLE public.post_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_post_revisions_post_id ON public.post_revisions(post_id, revision_number DESC);

-- Enable RLS
ALTER TABLE public.post_revisions ENABLE ROW LEVEL SECURITY;

-- Admins and editors can view all revisions
CREATE POLICY "Admins and editors can view all revisions"
ON public.post_revisions
FOR SELECT
TO authenticated
USING (
  has_editor_or_admin_role(auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.blog_posts WHERE id = post_id AND created_by = auth.uid()
  )
);

-- Only admins can delete revisions
CREATE POLICY "Only admins can delete revisions"
ON public.post_revisions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users with roles can insert revisions
CREATE POLICY "Authenticated users can insert revisions"
ON public.post_revisions
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'editor'::app_role)
  OR has_role(auth.uid(), 'contributor'::app_role)
);

-- Function to auto-create a revision on post update
CREATE OR REPLACE FUNCTION public.create_post_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_rev INTEGER;
BEGIN
  -- Only create revision if content-related fields changed
  IF OLD.title IS DISTINCT FROM NEW.title
     OR OLD.content IS DISTINCT FROM NEW.content
     OR OLD.excerpt IS DISTINCT FROM NEW.excerpt
     OR OLD.category IS DISTINCT FROM NEW.category
     OR OLD.tags IS DISTINCT FROM NEW.tags
     OR OLD.image IS DISTINCT FROM NEW.image
     OR OLD.seo_title IS DISTINCT FROM NEW.seo_title
     OR OLD.seo_description IS DISTINCT FROM NEW.seo_description
  THEN
    SELECT COALESCE(MAX(revision_number), 0) + 1 INTO next_rev
    FROM public.post_revisions WHERE post_id = OLD.id;

    INSERT INTO public.post_revisions (
      post_id, revision_number, title, content, excerpt, author,
      category, tags, image, seo_title, seo_description, created_by
    ) VALUES (
      OLD.id, next_rev, OLD.title, OLD.content, OLD.excerpt, OLD.author,
      OLD.category, OLD.tags, OLD.image, OLD.seo_title, OLD.seo_description, OLD.created_by
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger on blog_posts update
CREATE TRIGGER trg_create_post_revision
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.create_post_revision();
