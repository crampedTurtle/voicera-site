import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/hooks/use-admin-session";
import AdminCsp from "@/components/admin/AdminCsp";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface AuditEntry {
  id: string;
  post_id: string | null;
  action: string;
  user_id: string | null;
  changes: Record<string, any>;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  created: "text-primary",
  updated: "text-muted-foreground",
  published: "text-primary",
  scheduled: "text-blue-600 dark:text-blue-400",
  trashed: "text-destructive",
  restored: "text-primary",
  permanently_deleted: "text-destructive",
};

const AdminAuditLog = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const perPage = 50;
  const { loading: sessionLoading } = useAdminSession();

  useEffect(() => {
    if (sessionLoading) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .range(page * perPage, (page + 1) * perPage);

      if (!error && data) {
        setEntries(data as AuditEntry[]);
        setHasMore(data.length > perPage);
      }
      setLoading(false);
    };
    fetch();
  }, [sessionLoading, page]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const renderChanges = (changes: Record<string, any>) => {
    const keys = Object.keys(changes);
    if (keys.length === 0) return <span className="text-muted-foreground">—</span>;
    return (
      <div className="space-y-0.5">
        {keys.slice(0, 5).map(key => {
          const val = changes[key];
          if (val?.changed) return <div key={key} className="text-[10px]"><span className="font-medium">{key}</span>: modified</div>;
          if (val?.from !== undefined) return (
            <div key={key} className="text-[10px]">
              <span className="font-medium">{key}</span>:{" "}
              <span className="line-through text-muted-foreground">{String(val.from).slice(0, 40)}</span>
              {" → "}
              <span>{String(val.to).slice(0, 40)}</span>
            </div>
          );
          return <div key={key} className="text-[10px]"><span className="font-medium">{key}</span>: {String(val).slice(0, 60)}</div>;
        })}
        {keys.length > 5 && <div className="text-[10px] text-muted-foreground">+{keys.length - 5} more</div>}
      </div>
    );
  };

  if (sessionLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminCsp />
      <header className="border-b border-border px-6 py-3 flex items-center gap-3 bg-muted/30">
        <Button asChild variant="ghost" size="sm">
          <Link to="/voicera-admin/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
        </Button>
        <h1 className="text-xl font-bold text-foreground">Audit Log</h1>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-4">
        {loading ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Loading audit log…</p>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No audit entries yet.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground w-[160px]">Date</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground w-[120px]">Action</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground w-[200px]">User</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-foreground">Changes</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 text-xs text-muted-foreground">{formatDate(entry.created_at)}</td>
                    <td className={`px-3 py-2 text-xs font-medium capitalize ${ACTION_COLORS[entry.action] || "text-foreground"}`}>
                      {entry.action.replace("_", " ")}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground font-mono">
                      {entry.user_id ? entry.user_id.slice(0, 8) + "…" : "system"}
                    </td>
                    <td className="px-3 py-2">{renderChanges(entry.changes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-end gap-1 mt-3">
          <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground px-2">Page {page + 1}</span>
          <Button variant="outline" size="icon" className="h-7 w-7" disabled={!hasMore} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminAuditLog;
