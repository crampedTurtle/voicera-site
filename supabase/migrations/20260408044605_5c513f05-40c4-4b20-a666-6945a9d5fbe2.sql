
-- Server-side sanitization trigger for blog_posts
CREATE OR REPLACE FUNCTION public.sanitize_blog_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- 1. Sanitize HTML content: strip dangerous tags but keep allowed ones
  -- Remove script tags and content
  NEW.content := regexp_replace(NEW.content, '<script[^>]*>.*?</script>', '', 'gis');
  -- Remove iframe tags
  NEW.content := regexp_replace(NEW.content, '<iframe[^>]*>.*?</iframe>', '', 'gis');
  -- Remove object tags
  NEW.content := regexp_replace(NEW.content, '<object[^>]*>.*?</object>', '', 'gis');
  -- Remove embed tags
  NEW.content := regexp_replace(NEW.content, '<embed[^>]*/?>', '', 'gis');
  -- Remove form tags and content
  NEW.content := regexp_replace(NEW.content, '<form[^>]*>.*?</form>', '', 'gis');
  -- Remove style tags and content
  NEW.content := regexp_replace(NEW.content, '<style[^>]*>.*?</style>', '', 'gis');
  -- Remove event handler attributes (onclick, onload, onerror, etc.)
  NEW.content := regexp_replace(NEW.content, '\s+on[a-z]+\s*=\s*"[^"]*"', '', 'gis');
  NEW.content := regexp_replace(NEW.content, '\s+on[a-z]+\s*=\s*''[^'']*''', '', 'gis');
  -- Remove javascript: hrefs
  NEW.content := regexp_replace(NEW.content, 'href\s*=\s*"javascript:[^"]*"', 'href="#"', 'gis');
  NEW.content := regexp_replace(NEW.content, 'href\s*=\s*''javascript:[^'']*''', 'href=''#''', 'gis');
  -- Remove data: src attributes (except data:image for base64 images)
  NEW.content := regexp_replace(NEW.content, 'src\s*=\s*"data:(?!image/)[^"]*"', 'src=""', 'gis');

  -- 2. Strip ALL HTML from plain text fields
  NEW.title := regexp_replace(NEW.title, '<[^>]*>', '', 'g');
  NEW.excerpt := regexp_replace(NEW.excerpt, '<[^>]*>', '', 'g');
  NEW.author := regexp_replace(NEW.author, '<[^>]*>', '', 'g');
  NEW.category := regexp_replace(NEW.category, '<[^>]*>', '', 'g');
  NEW.seo_title := regexp_replace(NEW.seo_title, '<[^>]*>', '', 'g');
  NEW.seo_description := regexp_replace(NEW.seo_description, '<[^>]*>', '', 'g');
  NEW.og_title := regexp_replace(NEW.og_title, '<[^>]*>', '', 'g');
  NEW.og_description := regexp_replace(NEW.og_description, '<[^>]*>', '', 'g');
  NEW.image_alt := regexp_replace(NEW.image_alt, '<[^>]*>', '', 'g');
  NEW.image_caption := regexp_replace(NEW.image_caption, '<[^>]*>', '', 'g');
  IF NEW.source IS NOT NULL THEN
    NEW.source := regexp_replace(NEW.source, '<[^>]*>', '', 'g');
  END IF;

  -- 3. Validate slug: lowercase alphanumeric with hyphens only
  NEW.slug := lower(NEW.slug);
  IF NEW.slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' THEN
    RAISE EXCEPTION 'Invalid slug format: must be lowercase alphanumeric with hyphens only';
  END IF;
  -- Reject path traversal attempts
  IF NEW.slug ~ '\.\.' OR NEW.slug ~ '%2[fF]' OR NEW.slug ~ '\.\/' THEN
    RAISE EXCEPTION 'Invalid slug: path traversal characters are not allowed';
  END IF;

  -- 4. Validate URL fields don't contain javascript:
  IF NEW.canonical_url ~ '^javascript:' THEN
    NEW.canonical_url := '';
  END IF;
  IF NEW.external_url IS NOT NULL AND NEW.external_url ~ '^javascript:' THEN
    NEW.external_url := NULL;
  END IF;
  IF NEW.image ~ '^javascript:' THEN
    NEW.image := '';
  END IF;
  IF NEW.og_image ~ '^javascript:' THEN
    NEW.og_image := '';
  END IF;

  -- 5. Enforce length limits
  NEW.title := left(NEW.title, 300);
  NEW.excerpt := left(NEW.excerpt, 1000);
  NEW.seo_title := left(NEW.seo_title, 200);
  NEW.seo_description := left(NEW.seo_description, 500);
  NEW.og_title := left(NEW.og_title, 200);
  NEW.og_description := left(NEW.og_description, 500);
  NEW.image_alt := left(NEW.image_alt, 500);
  NEW.image_caption := left(NEW.image_caption, 500);

  RETURN NEW;
END;
$$;

-- Apply trigger BEFORE insert and update
CREATE TRIGGER trg_sanitize_blog_post
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_blog_post();
