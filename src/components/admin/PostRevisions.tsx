import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { History, RotateCcw, Eye, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Revision {
  id: string;
  revision_number: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
}

interface PostRevisionsProps {
  postId: string | undefined;
  onRestore: (revision: Omit<Revision, "id" | "revision_number" | "created_at">) => void;
}

const PostRevisions = ({ postId, onRestore }: PostRevisionsProps) => {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [previewRev, setPreviewRev] = useState<Revision | null>(null);
  const { toast } = useToast();

  const loadRevisions = async () => {
    if (!postId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("post_revisions" as any)
      .select("*")
      .eq("post_id", postId)
      .order("revision_number", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Failed to load revisions", error);
    } else {
      setRevisions((data as any[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (expanded && postId) loadRevisions();
  }, [expanded, postId]);

  const handleRestore = (rev: Revision) => {
    onRestore({
      title: rev.title,
      content: rev.content,
      excerpt: rev.excerpt,
      author: rev.author,
      category: rev.category,
      tags: rev.tags,
      image: rev.image,
      seo_title: rev.seo_title,
      seo_description: rev.seo_description,
    });
    toast({ title: `Restored revision #${rev.revision_number}`, description: "Save the post to keep changes." });
    setPreviewRev(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
      " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  if (!postId) return null;

  return (
    <>
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm border-b border-border bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <History className="w-4 h-4" /> Revisions
            {revisions.length > 0 && (
              <span className="text-xs text-muted-foreground font-normal">({revisions.length})</span>
            )}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="p-3 max-h-[300px] overflow-y-auto">
            {loading ? (
              <p className="text-xs text-muted-foreground text-center py-4">Loading…</p>
            ) : revisions.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No revisions yet. Revisions are created automatically when the post is saved.</p>
            ) : (
              <div className="space-y-1.5">
                {revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-muted/50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        #{rev.revision_number} — {rev.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(rev.created_at)}</p>
                    </div>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        title="Preview"
                        onClick={() => setPreviewRev(rev)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        title="Restore"
                        onClick={() => handleRestore(rev)}
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview dialog */}
      <Dialog open={!!previewRev} onOpenChange={() => setPreviewRev(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Revision #{previewRev?.revision_number}</span>
              <Button size="sm" onClick={() => previewRev && handleRestore(previewRev)}>
                <RotateCcw className="w-3 h-3 mr-1" /> Restore
              </Button>
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              {previewRev && formatDate(previewRev.created_at)}
            </p>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Title</p>
              <p className="text-sm font-medium">{previewRev?.title}</p>
            </div>
            {previewRev?.excerpt && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Excerpt</p>
                <p className="text-sm">{previewRev.excerpt}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Content</p>
              <div
                className="prose prose-sm dark:prose-invert max-w-none border border-border rounded p-3 text-sm"
                dangerouslySetInnerHTML={{ __html: previewRev?.content || "" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostRevisions;
