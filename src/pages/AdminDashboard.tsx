import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import AdminCsp from "@/components/admin/AdminCsp";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, LogOut, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Users, Loader2 } from "lucide-react";
import { useAdminSession, type UserRole } from "@/hooks/use-admin-session";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategoryLabel } from "@/lib/blog-data";

type PostStatus = "draft" | "pending_review" | "scheduled" | "published" | "private";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  status: string;
  published: boolean;
  date: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  scheduled_at: string | null;
}

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "pending_review", label: "Pending" },
  { key: "scheduled", label: "Scheduled" },
  { key: "private", label: "Private" },
];

function canDelete(role: UserRole | null) {
  return role === "admin";
}

function canPublish(role: UserRole | null) {
  return role === "admin" || role === "editor";
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bulkAction, setBulkAction] = useState("");
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
  const [perPage, setPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});

  // Cursor-based pagination state
  const [cursorStack, setCursorStack] = useState<Array<{ updated_at: string; id: string }>>([]);
  const [currentCursor, setCurrentCursor] = useState<{ updated_at: string; id: string } | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const currentPageNum = cursorStack.length + 1;

  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, userId, loading: sessionLoading, logout } = useAdminSession();

  // Debounce search input (300ms)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery]);

  // Reset cursor when filters change
  useEffect(() => {
    setCursorStack([]);
    setCurrentCursor(null);
  }, [activeTab, debouncedSearch, perPage]);

  // Fetch tab counts
  const fetchCounts = useCallback(async () => {
    const statuses = ["published", "draft", "pending_review", "scheduled", "private"];
    const counts: Record<string, number> = {};
    
    const { count: allCount } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true });
    counts.all = allCount || 0;

    await Promise.all(statuses.map(async (status) => {
      const { count } = await supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", status);
      counts[status] = count || 0;
    }));

    setTabCounts(counts);
  }, []);

  // Fetch posts with cursor-based pagination and server-side filtering
  const fetchPosts = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("blog_posts")
      .select("id, title, slug, author, category, status, published, date, created_at, updated_at, created_by, scheduled_at", { count: "exact" })
      .order("updated_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(perPage + 1); // fetch one extra to detect next page

    // Status filter
    if (activeTab !== "all") {
      query = query.eq("status", activeTab);
    }

    // Full-text search (server-side)
    if (debouncedSearch.trim()) {
      const searchTerms = debouncedSearch.trim().split(/\s+/).join(" & ");
      query = query.textSearch("fts", searchTerms, { type: "plain", config: "english" });
    }

    // Cursor: fetch rows after the current cursor
    if (currentCursor) {
      query = query.or(
        `updated_at.lt.${currentCursor.updated_at},and(updated_at.eq.${currentCursor.updated_at},id.lt.${currentCursor.id})`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      toast({ title: "Error loading posts", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const rows = (data as BlogPost[]) || [];
    
    // If we got more than perPage, there's a next page
    if (rows.length > perPage) {
      setHasNextPage(true);
      setPosts(rows.slice(0, perPage));
    } else {
      setHasNextPage(false);
      setPosts(rows);
    }

    if (count !== null && !currentCursor) {
      setTotalCount(count);
    }

    setLoading(false);
  }, [activeTab, debouncedSearch, perPage, currentCursor, toast]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchPosts();
      fetchCounts();
    }
  }, [sessionLoading, fetchPosts, fetchCounts]);

  const goNextPage = () => {
    if (posts.length === 0) return;
    const lastPost = posts[posts.length - 1];
    setCursorStack(prev => [...prev, currentCursor || { updated_at: "", id: "" }]);
    setCurrentCursor({ updated_at: lastPost.updated_at, id: lastPost.id });
  };

  const goPrevPage = () => {
    if (cursorStack.length === 0) return;
    const prev = [...cursorStack];
    const prevCursor = prev.pop()!;
    setCursorStack(prev);
    setCurrentCursor(prevCursor.updated_at ? prevCursor : null);
  };

  const goFirstPage = () => {
    setCursorStack([]);
    setCurrentCursor(null);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === posts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(posts.map((p) => p.id)));
    }
  };

  // Async bulk actions with progress
  const handleBulkAction = async () => {
    if (!bulkAction || selected.size === 0) return;
    const ids = Array.from(selected);

    if (bulkAction === "delete") {
      if (!canDelete(userRole)) {
        toast({ title: "Permission denied", variant: "destructive" });
        return;
      }
      if (!confirm(`Delete ${ids.length} post(s)?`)) return;
    } else if ((bulkAction === "published" || bulkAction === "private") && !canPublish(userRole)) {
      toast({ title: "Permission denied", description: "You don't have permission to publish.", variant: "destructive" });
      return;
    }

    setBulkProcessing(true);
    setBulkProgress({ done: 0, total: ids.length });

    // Process in batches of 10 to avoid blocking
    const BATCH_SIZE = 10;
    let processed = 0;
    let errorCount = 0;

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);

      if (bulkAction === "delete") {
        const { error } = await supabase.from("blog_posts").delete().in("id", batch);
        if (error) errorCount++;
      } else {
        const update: Record<string, unknown> = { status: bulkAction };
        update.published = bulkAction === "published";
        const { error } = await supabase.from("blog_posts").update(update).in("id", batch);
        if (error) errorCount++;
      }

      processed += batch.length;
      setBulkProgress({ done: processed, total: ids.length });
    }

    setBulkProcessing(false);
    setSelected(new Set());
    setBulkAction("");

    if (errorCount > 0) {
      toast({ title: "Some operations failed", description: `${errorCount} batch(es) had errors.`, variant: "destructive" });
    } else {
      toast({ title: `${ids.length} post(s) ${bulkAction === "delete" ? "deleted" : "updated"}` });
    }

    fetchPosts();
    fetchCounts();
  };

  const deletePost = async (id: string) => {
    if (!canDelete(userRole)) {
      toast({ title: "Permission denied", variant: "destructive" });
      return;
    }
    if (!confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      fetchPosts();
      fetchCounts();
      toast({ title: "Post deleted" });
    }
  };

  const handleLogout = async () => {
    await logout("manual");
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "Draft",
      published: "Published",
      pending_review: "Pending Review",
      scheduled: "Scheduled",
      private: "Private",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "text-muted-foreground",
      published: "text-primary",
      pending_review: "text-orange-600 dark:text-orange-400",
      scheduled: "text-blue-600 dark:text-blue-400",
      private: "text-purple-600 dark:text-purple-400",
    };
    return colors[status] || "text-muted-foreground";
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }) +
      " at " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  if (sessionLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminCsp />
      {/* Top bar */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">Posts</h1>
          <Button asChild size="sm" variant="outline" className="h-7 text-xs">
            <Link to="/voicera-admin/editor">
              <Plus className="w-3 h-3 mr-1" /> Add New Post
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {userRole === "admin" && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/voicera-admin/users">
                <Users className="w-4 h-4 mr-1" /> Users
              </Link>
            </Button>
          )}
          <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-4">
        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-1 text-sm mb-3">
          {STATUS_TABS.map((tab, i) => (
            <span key={tab.key} className="flex items-center">
              {i > 0 && <span className="text-muted-foreground mx-1">|</span>}
              <button
                onClick={() => { setActiveTab(tab.key); setSelected(new Set()); }}
                className={`hover:underline ${activeTab === tab.key ? "text-foreground font-semibold" : "text-muted-foreground"}`}
              >
                {tab.label} <span className="text-xs">({tabCounts[tab.key] || 0})</span>
              </button>
            </span>
          ))}
        </div>

        {/* Bulk actions + search bar */}
        <div className="flex items-center justify-between mb-3 gap-4">
          <div className="flex items-center gap-2">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Move to Draft</SelectItem>
                {canPublish(userRole) && <SelectItem value="published">Publish</SelectItem>}
                {canPublish(userRole) && <SelectItem value="private">Make Private</SelectItem>}
                <SelectItem value="pending_review">Submit for Review</SelectItem>
                {canDelete(userRole) && <SelectItem value="delete">Move to Trash</SelectItem>}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleBulkAction} disabled={!bulkAction || selected.size === 0 || bulkProcessing}>
              {bulkProcessing ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {bulkProgress.done}/{bulkProgress.total}
                </span>
              ) : "Apply"}
            </Button>
            {selected.size > 0 && !bulkProcessing && (
              <span className="text-xs text-muted-foreground">{selected.size} selected</span>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts…"
              className="h-8 w-[200px] pl-8 text-xs"
            />
          </div>
        </div>

        {/* Posts table */}
        {loading ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Loading posts…</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg">
            <p className="text-muted-foreground mb-4 text-sm">No posts found.</p>
            <Button asChild size="sm">
              <Link to="/voicera-admin/editor">
                <Plus className="w-4 h-4 mr-1" /> Create your first post
              </Link>
            </Button>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="w-8 px-3 py-2.5">
                    <Checkbox
                      checked={selected.size === posts.length && posts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground">Title</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground w-[120px]">Author</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground w-[140px]">Category</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground w-[100px]">Status</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground w-[160px]">Date</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-3 py-2.5">
                      <Checkbox
                        checked={selected.has(post.id)}
                        onCheckedChange={() => toggleSelect(post.id)}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div>
                        <Link
                          to={`/voicera-admin/editor/${post.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {post.title || "(no title)"}
                        </Link>
                        {post.status !== "published" && (
                          <span className="text-xs text-muted-foreground ml-1.5">
                            — {getStatusLabel(post.status)}
                          </span>
                        )}
                      </div>
                      {/* Row actions on hover */}
                      <div className="flex items-center gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        <Link to={`/voicera-admin/editor/${post.id}`} className="text-primary hover:underline">
                          Edit
                        </Link>
                        {post.status === "published" && (
                          <>
                            <span className="text-muted-foreground">|</span>
                            <Link to={`/media/${post.slug}`} className="text-muted-foreground hover:text-primary hover:underline">
                              View
                            </Link>
                          </>
                        )}
                        {canDelete(userRole) && (
                          <>
                            <span className="text-muted-foreground">|</span>
                            <button onClick={() => deletePost(post.id)} className="text-destructive hover:underline">
                              Trash
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{post.author}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{getCategoryLabel(post.category)}</td>
                    <td className={`px-3 py-2.5 text-xs font-medium ${getStatusColor(post.status)}`}>
                      {getStatusLabel(post.status)}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {post.status === "scheduled" && post.scheduled_at
                        ? `Scheduled\n${formatDate(post.scheduled_at)}`
                        : post.status === "published"
                          ? `Published\n${formatDate(post.date)}`
                          : `Last Modified\n${formatDate(post.updated_at)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{tabCounts[activeTab] || 0} item{(tabCounts[activeTab] || 0) !== 1 ? "s" : ""}</span>
            <span>·</span>
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); }}>
              <SelectTrigger className="h-7 w-[70px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              disabled={currentPageNum === 1}
              onClick={goFirstPage}
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              disabled={currentPageNum === 1}
              onClick={goPrevPage}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              Page {currentPageNum}
            </span>
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              disabled={!hasNextPage}
              onClick={goNextPage}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
