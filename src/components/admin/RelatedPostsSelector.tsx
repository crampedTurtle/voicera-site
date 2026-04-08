import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, Link2 } from "lucide-react";

interface RelatedPostsSelectorProps {
  value: string[];
  onChange: (ids: string[]) => void;
  currentPostId?: string;
}

interface PostOption {
  id: string;
  title: string;
  slug: string;
}

const RelatedPostsSelector = ({ value, onChange, currentPostId }: RelatedPostsSelectorProps) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<PostOption[]>([]);
  const [selected, setSelected] = useState<PostOption[]>([]);
  const [searching, setSearching] = useState(false);

  // Load selected post titles on mount
  useEffect(() => {
    if (value.length === 0) return;
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug")
        .in("id", value);
      if (data) setSelected(data);
    };
    load();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearch(query);
    if (query.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug")
      .ilike("title", `%${query.trim()}%`)
      .neq("id", currentPostId || "")
      .limit(8);
    setResults((data || []).filter(p => !value.includes(p.id)));
    setSearching(false);
  }, [value, currentPostId]);

  const addPost = (post: PostOption) => {
    if (value.length >= 3) return;
    onChange([...value, post.id]);
    setSelected(prev => [...prev, post]);
    setResults(prev => prev.filter(p => p.id !== post.id));
    setSearch("");
  };

  const removePost = (id: string) => {
    onChange(value.filter(v => v !== id));
    setSelected(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="space-y-1">
          {selected.filter(s => value.includes(s.id)).map(post => (
            <div key={post.id} className="flex items-center gap-1.5 bg-muted rounded px-2 py-1">
              <Link2 className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs truncate flex-1">{post.title}</span>
              <button onClick={() => removePost(post.id)} className="hover:text-destructive shrink-0">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      {value.length < 3 && (
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search posts by title…"
            className="h-7 text-xs pl-7"
          />
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-md max-h-40 overflow-y-auto">
              {results.map(post => (
                <button
                  key={post.id}
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors truncate"
                  onClick={() => addPost(post)}
                >
                  {post.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <p className="text-[10px] text-muted-foreground">
        {value.length}/3 related posts selected
      </p>
    </div>
  );
};

export default RelatedPostsSelector;
