
-- Indexes for dashboard filtering and pagination
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_at ON public.blog_posts (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts (created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON public.blog_posts (published, date DESC) WHERE published = true;

-- Composite index for cursor-based pagination (updated_at, id)
CREATE INDEX IF NOT EXISTS idx_blog_posts_cursor ON public.blog_posts (updated_at DESC, id DESC);

-- Full-text search index
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(author, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_blog_posts_fts ON public.blog_posts USING GIN (fts);
