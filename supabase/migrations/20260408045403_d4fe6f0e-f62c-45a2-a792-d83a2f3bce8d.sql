
-- 1. Soft deletes: add deleted_at column
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_deleted_at ON public.blog_posts (deleted_at) WHERE deleted_at IS NOT NULL;

-- 2. Audit log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  action text NOT NULL,
  user_id uuid,
  changes jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and editors can view audit logs"
  ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_editor_or_admin_role(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_audit_log_post_id ON public.audit_log (post_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log (created_at DESC);

-- Audit trigger function
CREATE OR REPLACE FUNCTION public.record_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  action_type text;
  changes_json jsonb := '{}';
  col text;
  old_val text;
  new_val text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
    INSERT INTO public.audit_log (post_id, action, user_id, changes)
    VALUES (NEW.id, action_type, NEW.created_by, jsonb_build_object('title', NEW.title, 'status', NEW.status));
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    action_type := 'permanently_deleted';
    INSERT INTO public.audit_log (post_id, action, user_id, changes)
    VALUES (OLD.id, action_type, OLD.created_by, jsonb_build_object('title', OLD.title));
    RETURN OLD;
  END IF;

  -- UPDATE: determine action type
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    action_type := 'trashed';
  ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
    action_type := 'restored';
  ELSIF OLD.status != 'published' AND NEW.status = 'published' THEN
    action_type := 'published';
  ELSIF OLD.status != 'scheduled' AND NEW.status = 'scheduled' THEN
    action_type := 'scheduled';
  ELSE
    action_type := 'updated';
  END IF;

  -- Build changes diff for key fields
  FOREACH col IN ARRAY ARRAY['title','content','excerpt','status','category','author','seo_title','seo_description','image','slug','visibility','deleted_at'] LOOP
    EXECUTE format('SELECT ($1).%I::text, ($2).%I::text', col, col) INTO old_val, new_val USING OLD, NEW;
    IF old_val IS DISTINCT FROM new_val THEN
      -- For content, just note it changed (too large for diff)
      IF col = 'content' THEN
        changes_json := changes_json || jsonb_build_object(col, jsonb_build_object('changed', true));
      ELSE
        changes_json := changes_json || jsonb_build_object(col, jsonb_build_object('from', old_val, 'to', new_val));
      END IF;
    END IF;
  END LOOP;

  INSERT INTO public.audit_log (post_id, action, user_id, changes)
  VALUES (NEW.id, action_type, COALESCE(NEW.created_by, OLD.created_by), changes_json);

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_audit_blog_posts
  AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.record_audit_log();

-- 3. Function to publish scheduled posts (called by cron)
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  published_count integer;
BEGIN
  UPDATE public.blog_posts
  SET status = 'published', published = true
  WHERE status = 'scheduled'
    AND scheduled_at IS NOT NULL
    AND scheduled_at <= now()
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS published_count = ROW_COUNT;
  RETURN published_count;
END;
$$;

-- 4. Function to permanently delete old trashed posts (30 days)
CREATE OR REPLACE FUNCTION public.cleanup_trashed_posts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.blog_posts
  WHERE deleted_at IS NOT NULL
    AND deleted_at < now() - interval '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
