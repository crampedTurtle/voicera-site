import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, X, Check, Loader2, ChevronDown, ChevronUp, AlertTriangle, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import PostRevisions from "@/components/admin/PostRevisions";
import RelatedPostsSelector from "@/components/admin/RelatedPostsSelector";
import { useAdminSession } from "@/hooks/use-admin-session";
import { z } from "zod";

const CATEGORIES = [
  { value: "sales-intelligence", label: "Sales Intelligence" },
  { value: "sales-enablement", label: "Sales Enablement" },
  { value: "platform", label: "Platform" },
  { value: "trust-credibility", label: "Trust & Credibility" },
  { value: "hr-hiring", label: "HR & Hiring" },
  { value: "press", label: "Press" },
] as const;

const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  slug: z.string().trim().min(1, "Slug is required").max(300).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().max(1000).default(""),
  content: z.string().max(200000).default(""),
  author: z.string().trim().min(1).max(200).default("Voicera Team"),
  category: z.string().min(1).max(100),
  image: z.string().max(2000).default(""),
  image_alt: z.string().max(500).default(""),
  image_caption: z.string().max(500).default(""),
  read_time: z.number().int().min(1).max(999),
  external_url: z.string().url().max(2000).or(z.literal("")).nullable().transform(v => v || null),
  source: z.string().max(200).nullable().transform(v => v || null),
  status: z.string().min(1),
  visibility: z.string().min(1),
  scheduled_at: z.string().nullable().transform(v => v || null),
  tags: z.array(z.string()),
  seo_title: z.string().max(200).default(""),
  seo_description: z.string().max(500).default(""),
  canonical_url: z.string().max(2000).default(""),
  og_title: z.string().max(200).default(""),
  og_description: z.string().max(500).default(""),
  og_image: z.string().max(2000).default(""),
  twitter_card: z.string().default("summary_large_image"),
  robots_index: z.boolean().default(true),
  robots_follow: z.boolean().default(true),
  related_posts: z.array(z.string()).default([]),
});

const AdminEditor = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { userRole, loading: sessionLoading } = useAdminSession();
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Voicera Team",
    category: "platform",
    image: "",
    image_alt: "",
    image_caption: "",
    read_time: 5,
    external_url: "",
    source: "",
    status: "draft",
    visibility: "public",
    scheduled_at: "",
    tags: [] as string[],
    seo_title: "",
    seo_description: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image: "",
    twitter_card: "summary_large_image",
    robots_index: true,
    robots_follow: true,
    related_posts: [] as string[],
  });

  const [seoOpen, setSeoOpen] = useState(false);

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

    const d = data as any;
    setForm({
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt,
      content: d.content,
      author: d.author,
      category: d.category,
      image: d.image,
      image_alt: d.image_alt || "",
      image_caption: d.image_caption || "",
      read_time: d.read_time,
      external_url: d.external_url || "",
      source: d.source || "",
      status: d.status || (d.published ? "published" : "draft"),
      visibility: d.visibility || "public",
      scheduled_at: d.scheduled_at || "",
      tags: d.tags || [],
      seo_title: d.seo_title || "",
      seo_description: d.seo_description || "",
      canonical_url: d.canonical_url || "",
      og_title: d.og_title || "",
      og_description: d.og_description || "",
      og_image: d.og_image || "",
      twitter_card: d.twitter_card || "summary_large_image",
      robots_index: d.robots_index ?? true,
      robots_follow: d.robots_follow ?? true,
      related_posts: d.related_posts || [],
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

  // Autosave
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const lastSavedRef = useRef<string>("");
  const autosaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const postIdRef = useRef<string | undefined>(id);

  const autosave = useCallback(async (currentForm: typeof form) => {
    if (!currentForm.title.trim()) return; // nothing to save

    const snapshot = JSON.stringify(currentForm);
    if (snapshot === lastSavedRef.current) return; // no changes

    setAutosaveStatus("saving");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const parsed = postSchema.safeParse(currentForm);
    if (!parsed.success) return;

    const v = parsed.data;
    const payload: Record<string, unknown> = {
      title: v.title, slug: v.slug, excerpt: v.excerpt, content: v.content,
      author: v.author, category: v.category, image: v.image, read_time: v.read_time,
      image_alt: v.image_alt, image_caption: v.image_caption,
      external_url: v.external_url, source: v.source,
      status: v.status, visibility: v.visibility,
      published: v.status === "published",
      scheduled_at: v.status === "scheduled" ? v.scheduled_at : null,
      tags: v.tags, seo_title: v.seo_title, seo_description: v.seo_description,
      canonical_url: v.canonical_url, og_title: v.og_title, og_description: v.og_description,
      og_image: v.og_image, twitter_card: v.twitter_card,
      robots_index: v.robots_index, robots_follow: v.robots_follow,
      related_posts: v.related_posts,
      created_by: session.user.id,
    };

    let error;
    if (postIdRef.current) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", postIdRef.current));
    } else {
      const { data, error: insertError } = await supabase.from("blog_posts").insert(payload as any).select("id").single();
      error = insertError;
      if (data) {
        postIdRef.current = data.id;
      }
    }

    if (error) {
      setAutosaveStatus("error");
    } else {
      lastSavedRef.current = snapshot;
      setAutosaveStatus("saved");
      setTimeout(() => setAutosaveStatus((s) => s === "saved" ? "idle" : s), 3000);
    }
  }, []);

  // Keep a ref to the latest form for the interval
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    autosaveTimerRef.current = setInterval(() => {
      autosave(formRef.current);
    }, 30000);
    return () => {
      if (autosaveTimerRef.current) clearInterval(autosaveTimerRef.current);
    };
  }, [autosave]);

  // Set lastSavedRef when loading an existing post
  useEffect(() => {
    if (isEdit && form.title) {
      lastSavedRef.current = JSON.stringify(form);
    }
  }, [isEdit]);


  const addTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((p) => ({ ...p, tags: [...p.tags, tag] }));
    }
    setTagInput("");
  }, [tagInput, form.tags]);

  const removeTag = (tag: string) => {
    setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  const handleSave = async () => {
    if (!canPublish && (form.status === "published" || form.status === "private" || form.status === "scheduled")) {
      toast({ title: "Permission denied", description: "You can only save drafts or submit for review.", variant: "destructive" });
      return;
    }
    if (form.status === "scheduled" && !form.scheduled_at) {
      toast({ title: "Validation error", description: "Set a schedule date.", variant: "destructive" });
      return;
    }

    const parsed = postSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Validation error", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }

    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Session expired", variant: "destructive" });
      navigate("/voicera-admin");
      return;
    }

    const v = parsed.data;
    const payload: Record<string, unknown> = {
      title: v.title, slug: v.slug, excerpt: v.excerpt, content: v.content,
      author: v.author, category: v.category, image: v.image, read_time: v.read_time,
      image_alt: v.image_alt, image_caption: v.image_caption,
      external_url: v.external_url, source: v.source,
      status: v.status, visibility: v.visibility,
      published: v.status === "published",
      scheduled_at: v.status === "scheduled" ? v.scheduled_at : null,
      tags: v.tags, seo_title: v.seo_title, seo_description: v.seo_description,
      canonical_url: v.canonical_url, og_title: v.og_title, og_description: v.og_description,
      og_image: v.og_image, twitter_card: v.twitter_card,
      robots_index: v.robots_index, robots_follow: v.robots_follow,
      related_posts: v.related_posts,
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

  const wordCount = form.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  const autoReadTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-update read_time from word count
  useEffect(() => {
    setForm(p => p.read_time !== autoReadTime ? { ...p, read_time: autoReadTime } : p);
  }, [autoReadTime]);

  // Warn about missing alt text on publish
  const altTextWarning = form.image && !form.image_alt && (form.status === "published" || form.status === "scheduled");

  if (sessionLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
       <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/voicera-admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-lg font-bold text-foreground">
            {isEdit ? "Edit Post" : "Add New Post"}
          </h1>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {autoReadTime} min read · {wordCount} words</span>
          {autosaveStatus === "saving" && (
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving…</span>
          )}
          {autosaveStatus === "saved" && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><Check className="w-3 h-3" /> Draft saved</span>
          )}
          {autosaveStatus === "error" && (
            <span className="flex items-center gap-1 text-destructive">Autosave failed</span>
          )}
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-6 flex gap-6 items-start">
        {/* Main content area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Title */}
          <Input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter title here"
            className="text-xl font-semibold h-12 bg-background"
          />

          {/* Slug */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Permalink:</span>
            <Input
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="h-7 text-xs flex-1 max-w-md"
            />
          </div>

          {/* Rich text editor */}
          <RichTextEditor
            content={form.content}
            onChange={(html) => setForm((p) => ({ ...p, content: html }))}
          />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Word count: {wordCount}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~{autoReadTime} min read</span>
          </div>

          {/* Excerpt */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              className="w-full text-left px-4 py-2.5 font-semibold text-sm border-b border-border bg-muted/30"
            >
              Excerpt
            </button>
            <div className="p-4">
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="Write a short description…"
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          {/* Source / External URL (for press) */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 font-semibold text-sm border-b border-border bg-muted/30">
              Press / External Link
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Source</Label>
                <Input value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} placeholder="e.g. TechCrunch" className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">External URL</Label>
                <Input value={form.external_url} onChange={(e) => setForm((p) => ({ ...p, external_url: e.target.value }))} placeholder="https://..." className="text-sm" />
              </div>
            </div>
          </div>

          {/* SEO Settings — Collapsible */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm border-b border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span>SEO &amp; Social Settings</span>
              {seoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {seoOpen && (
              <div className="p-4 space-y-4">
                {/* SEO Title */}
                <div>
                  <Label className="text-xs">
                    SEO Title{" "}
                    <span className={form.seo_title.length >= 60 ? "text-destructive font-medium" : "text-muted-foreground"}>
                      ({form.seo_title.length}/60)
                    </span>
                  </Label>
                  <Input
                    value={form.seo_title}
                    onChange={(e) => setForm((p) => ({ ...p, seo_title: e.target.value }))}
                    placeholder={form.title || "Page title for search engines"}
                    maxLength={200}
                    className="text-sm"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <Label className="text-xs">
                    Meta Description{" "}
                    <span className={form.seo_description.length >= 160 ? "text-destructive font-medium" : "text-muted-foreground"}>
                      ({form.seo_description.length}/160)
                    </span>
                  </Label>
                  <Textarea
                    value={form.seo_description}
                    onChange={(e) => setForm((p) => ({ ...p, seo_description: e.target.value }))}
                    placeholder={form.excerpt || "Description for search results"}
                    maxLength={500}
                    rows={3}
                    className="text-sm"
                  />
                </div>

                {/* Search Preview */}
                <div className="border border-border rounded p-3 bg-muted/20">
                  <p className="text-xs text-muted-foreground mb-1">Search preview:</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate">
                    {form.seo_title || form.title || "Post Title"}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-500 truncate">
                    voicera.com/media/{form.slug || "post-slug"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {form.seo_description || form.excerpt || "Post description will appear here…"}
                  </p>
                </div>

                {/* Canonical URL */}
                <div>
                  <Label className="text-xs">Canonical URL</Label>
                  <Input
                    value={form.canonical_url}
                    onChange={(e) => setForm((p) => ({ ...p, canonical_url: e.target.value }))}
                    placeholder={`https://voicera.com/media/${form.slug || ""}`}
                    className="text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Leave blank to use the default post URL</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-foreground mb-2">Open Graph</p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">OG Title</Label>
                      <Input
                        value={form.og_title}
                        onChange={(e) => setForm((p) => ({ ...p, og_title: e.target.value }))}
                        placeholder={form.seo_title || form.title || "Uses SEO title if empty"}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">OG Description</Label>
                      <Textarea
                        value={form.og_description}
                        onChange={(e) => setForm((p) => ({ ...p, og_description: e.target.value }))}
                        placeholder={form.seo_description || form.excerpt || "Uses meta description if empty"}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">OG Image</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={form.og_image}
                          onChange={(e) => setForm((p) => ({ ...p, og_image: e.target.value }))}
                          placeholder={form.image || "Uses featured image if empty"}
                          className="text-sm flex-1"
                        />
                        {form.image && !form.og_image && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs shrink-0 h-8"
                            onClick={() => setForm(p => ({ ...p, og_image: p.image }))}
                          >
                            Use Featured
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-foreground mb-2">Twitter Card</p>
                  <Select value={form.twitter_card} onValueChange={(v) => setForm(p => ({ ...p, twitter_card: v }))}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary (small image)</SelectItem>
                      <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs font-semibold text-foreground mb-2">Robots Meta</p>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <Checkbox
                        checked={form.robots_index}
                        onCheckedChange={(v) => setForm(p => ({ ...p, robots_index: !!v }))}
                      />
                      Allow search engines to index this page
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <Checkbox
                        checked={form.robots_follow}
                        onCheckedChange={(v) => setForm(p => ({ ...p, robots_follow: !!v }))}
                      />
                      Allow search engines to follow links
                    </label>
                    <p className="text-[10px] text-muted-foreground">
                      Robots: {form.robots_index ? "index" : "noindex"}, {form.robots_follow ? "follow" : "nofollow"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[280px] shrink-0 space-y-4">
          {/* Publish panel */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 font-semibold text-sm border-b border-border bg-muted/30">
              Publish
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save Draft"}
                </Button>
                {form.status === "published" && form.slug && (
                  <Button size="sm" variant="outline" className="text-xs" asChild>
                    <a href={`/media/${form.slug}`} target="_blank" rel="noopener">Preview</a>
                  </Button>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                    <SelectTrigger className="h-7 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                      {canPublish && <SelectItem value="scheduled">Scheduled</SelectItem>}
                      {canPublish && <SelectItem value="published">Published</SelectItem>}
                      {canPublish && <SelectItem value="private">Private</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Visibility:</span>
                  <Select value={form.visibility} onValueChange={(v) => setForm((p) => ({ ...p, visibility: v }))}>
                    <SelectTrigger className="h-7 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.status === "scheduled" && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Publish on:</Label>
                    <Input
                      type="datetime-local"
                      value={form.scheduled_at}
                      onChange={(e) => setForm((p) => ({ ...p, scheduled_at: e.target.value }))}
                      className="h-7 text-xs mt-1"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Author:</span>
                  <Input
                    value={form.author}
                    onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                    className="h-7 w-[130px] text-xs"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Read time:</span>
                  <span className="text-xs text-foreground">{autoReadTime} min (auto)</span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <Button className="w-full" onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? "Saving…" : canPublish && form.status === "published" ? "Publish" : form.status === "pending_review" ? "Submit for Review" : "Save"}
                </Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 font-semibold text-sm border-b border-border bg-muted/30">
              Tags
            </div>
            <div className="p-4 space-y-2">
              <div className="flex gap-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Add new tag"
                  className="h-7 text-xs flex-1"
                />
                <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={addTag}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-0.5 bg-muted text-xs px-2 py-0.5 rounded">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 font-semibold text-sm border-b border-border bg-muted/30">
              Categories
            </div>
            <div className="p-4">
              <div className="space-y-1.5">
                {CATEGORIES.map((c) => (
                  <label key={c.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={form.category === c.value}
                      onChange={() => setForm((p) => ({ ...p, category: c.value }))}
                      className="accent-primary"
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 font-semibold text-sm border-b border-border bg-muted/30">
              Featured Image
            </div>
            <div className="p-4">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm((p) => ({ ...p, image: url }))}
              />
            </div>
          </div>

          {/* Revisions */}
          <PostRevisions
            postId={isEdit ? id : postIdRef.current}
            onRestore={(rev) => setForm((p) => ({ ...p, ...rev }))}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
