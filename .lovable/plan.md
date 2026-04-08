
## Analysis of 8 requested features

### 1. Soft Deletes ✅ Will implement
- Add `deleted_at` column to blog_posts
- "Delete" sets `deleted_at = now()` instead of actual delete
- Add "Trash" tab showing soft-deleted posts
- "Restore" clears `deleted_at`
- "Permanent Delete" requires second confirmation
- DB trigger/cron to permanently delete posts older than 30 days

### 2. Audit Log ✅ Will implement
- Create `audit_log` table (post_id, action, user_id, changes_json, created_at)
- DB trigger on blog_posts to auto-record changes with diffs
- Read-only audit viewer accessible from dashboard

### 3. Export ✅ Will implement (client-side JSON export)
- Add "Export All Posts" button that downloads JSON
- S3 scheduled backup requires an S3 connector — will implement the export function; scheduled S3 storage can be added when a connector is configured

### 4. Scheduled Posts ✅ Will implement
- Create edge function + pg_cron job to publish posts where `scheduled_at <= now()` and `status = 'scheduled'`
- Server-side, runs every minute regardless of browser state

### 5. Broken Link Detection ⚠️ Partial
- Edge function to check URLs in post content on publish
- Returns warnings (not blockers) for 404s
- Limited by CORS/network restrictions from edge functions

### 6. Image Alt Text Enforcement ✅ Will implement
- On publish, scan content for `<img>` tags missing `alt`
- Show soft warning dialog the author must acknowledge

### 7. Category/Tag Management ⚠️ Deferred
- Categories are currently hardcoded strings, not a separate table. Full CRUD with merge/reassign requires a `categories` table migration + significant refactor of the editor and listing pages. This is a larger scope change — recommend as a follow-up.

### 8. API Rate Limiting ✅ Will implement
- Client-side rate limiter wrapper around Supabase calls (60 req/min)
- Edge functions already have platform-level rate limiting
