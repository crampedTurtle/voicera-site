import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdminSession } from "@/hooks/use-admin-session";
import { z } from "zod";

const CATEGORIES = ["sales-intelligence", "sales-enablement", "platform", "trust-credibility", "hr-hiring", "press"] as const;
const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "private", label: "Private" },
] as const;

const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300, "Title too long"),
  slug: z.string().trim().min(1, "Slug is required").max(300, "Slug too long").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().max(1000, "Excerpt too long").default(""),
  content: z.string().max(200000, "Content too long").default(""),
  author: z.string().trim().min(1).max(200, "Author too long").default("Voicera Team"),
  category: z.string().min(1).max(100),
  image: z.string().max(2000).default(""),
  read_time: z.number().int().min(1).max(999),
  external_url: z.string().url("Invalid URL").max(2000).or(z.literal("")).nullable().transform(v => v || null),
  source: z.string().max(200).nullable().transform(v => v || null),
  status: z.string().min(1),
  scheduled_at: z.string().nullable().transform(v => v || null),
});

const AdminEditor = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { userRole, loading: sessionLoading } = useAdminSession();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Voicera Team",
    category: "product" as string,
    image: "",
    read_time: 5,
    external_url: "",
    source: "",
    status: "draft",
    scheduled_at: "",
  });

  useEffect(() => {
    if (isEdit) loadPost();
  }, [id]);

  const loadPost = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id!)
      .single();

    if (error || !data) {
      toast({ title: "Post not found", variant: "destructive" });
      navigate("/voicera-admin/dashboard");
      return;
    }

    setForm({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      category: data.category,
      image: data.image,
      read_time: data.read_time,
      external_url: data.external_url || "",
      source: data.source || "",
      status: (data as any).status || (data.published ? "published" : "draft"),
      scheduled_at: (data as any).scheduled_at || "",
    });
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : generateSlug(title),
    }));
  };

  const canPublish = userRole === "admin" || userRole === "editor";

  // Contributors can only submit for review or save as draft
  const availableStatuses = canPublish
    ? STATUSES
    : STATUSES.filter((s) => s.value === "draft" || s.value === "pending_review");

  const handleSave = async () => {
    // Enforce: contributors can't set published/private/scheduled
    if (!canPublish && (form.status === "published" || form.status === "private" || form.status === "scheduled")) {
      toast({ title: "Permission denied", description: "You can only save drafts or submit for review.", variant: "destructive" });
      return;
    }

    if (form.status === "scheduled" && !form.scheduled_at) {
      toast({ title: "Validation error", description: "Please set a schedule date.", variant: "destructive" });
      return;
    }

    const parsed = postSchema.safeParse(form);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      toast({ title: "Validation error", description: firstError.message, variant: "destructive" });
      return;
    }

    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Session expired", description: "Please log in again.", variant: "destructive" });
      navigate("/voicera-admin");
      return;
    }

    const validData = parsed.data;

    const payload: Record<string, unknown> = {
      title: validData.title,
      slug: validData.slug,
      excerpt: validData.excerpt,
      content: validData.content,
      author: validData.author,
      category: validData.category,
      image: validData.image,
      read_time: validData.read_time,
      external_url: validData.external_url,
      source: validData.source,
      status: validData.status,
      published: validData.status === "published",
      scheduled_at: validData.status === "scheduled" ? validData.scheduled_at : null,
      created_by: session.user.id,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", id!));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(payload as any));
    }

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Post updated" : "Post created" });
      navigate("/voicera-admin/dashboard");
    }
    setSaving(false);
  };

  if (sessionLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/voicera-admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            {isEdit ? "Edit Post" : "New Post"}
          </h1>
          <span className="text-xs text-muted-foreground capitalize">({userRole})</span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-1" /> {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            placeholder="post-url-slug"
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
            placeholder="Short description…"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            placeholder="Write your blog post content here…"
            rows={16}
            className="font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
            />
          </div>
        </div>

        {/* Status + Scheduling */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.status === "scheduled" && (
            <div>
              <Label htmlFor="scheduled_at">Scheduled Date & Time</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm((p) => ({ ...p, scheduled_at: e.target.value }))}
              />
            </div>
          )}
        </div>

        <ImageUpload
          value={form.image}
          onChange={(url) => setForm((p) => ({ ...p, image: url }))}
        />

        <div>
          <Label htmlFor="read_time">Read Time (min)</Label>
          <Input
            id="read_time"
            type="number"
            min={1}
            value={form.read_time}
            onChange={(e) => setForm((p) => ({ ...p, read_time: parseInt(e.target.value) || 1 }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="source">Source (for press)</Label>
            <Input
              id="source"
              value={form.source}
              onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
              placeholder="e.g. TechCrunch"
            />
          </div>

          <div>
            <Label htmlFor="external_url">External URL (for press)</Label>
            <Input
              id="external_url"
              value={form.external_url}
              onChange={(e) => setForm((p) => ({ ...p, external_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEditor;
