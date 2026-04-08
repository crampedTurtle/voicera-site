import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, ShieldCheck, UserX, Users } from "lucide-react";
import { useAdminSession } from "@/hooks/use-admin-session";

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin", description: "Full access" },
  { value: "editor", label: "Editor", description: "Can publish & edit all posts" },
  { value: "contributor", label: "Contributor", description: "Own posts only, submit for review" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, userId, loading: sessionLoading } = useAdminSession();

  useEffect(() => {
    if (!sessionLoading) {
      if (userRole !== "admin") {
        toast({ title: "Access denied", variant: "destructive" });
        navigate("/voicera-admin/dashboard");
        return;
      }
      fetchUsers();
    }
  }, [sessionLoading, userRole]);

  const fetchUsers = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await supabase.functions.invoke("admin-users", {
      body: null,
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });

    // supabase.functions.invoke doesn't support query params well, use fetch
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users?action=list`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    });
    const data = await response.json();
    if (data.error) {
      toast({ title: "Error", description: data.error, variant: "destructive" });
    } else {
      setUsers(data.users || []);
    }
    setLoading(false);
  };

  const setRole = async (targetUserId: string, role: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users?action=set-role`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: targetUserId, role }),
    });
    const data = await response.json();
    if (data.error) {
      toast({ title: "Error", description: data.error, variant: "destructive" });
    } else {
      toast({ title: "Role updated" });
      fetchUsers();
    }
  };

  const removeRole = async (targetUserId: string) => {
    if (!confirm("Remove all roles from this user? They will lose dashboard access.")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users?action=remove-role`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: targetUserId }),
    });
    const data = await response.json();
    if (data.error) {
      toast({ title: "Error", description: data.error, variant: "destructive" });
    } else {
      toast({ title: "Roles removed" });
      fetchUsers();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "editor": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "contributor": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  if (sessionLoading || loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/voicera-admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Posts
          </Button>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5" /> User Management
          </h1>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 py-6">
        <p className="text-sm text-muted-foreground mb-4">
          Assign roles to control what each user can do in the blog dashboard.
        </p>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-2.5 font-semibold text-foreground">Email</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground w-[120px]">Current Role</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground w-[100px]">Joined</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground w-[100px]">Last Login</th>
                <th className="text-left px-4 py-2.5 font-semibold text-foreground w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const currentRole = u.roles[0] || null;
                const isCurrentUser = u.id === userId;
                return (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{u.email}</span>
                      {isCurrentUser && <span className="text-xs text-muted-foreground ml-2">(you)</span>}
                    </td>
                    <td className="px-4 py-3">
                      {currentRole ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getRoleBadgeColor(currentRole)}`}>
                          <ShieldCheck className="w-3 h-3" />
                          {currentRole}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No role</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.last_sign_in_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Select
                          value={currentRole || ""}
                          onValueChange={(role) => setRole(u.id, role)}
                          disabled={isCurrentUser}
                        >
                          <SelectTrigger className="h-7 w-[120px] text-xs">
                            <SelectValue placeholder="Set role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((r) => (
                              <SelectItem key={r.value} value={r.value}>
                                <span className="capitalize">{r.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {currentRole && !isCurrentUser && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeRole(u.id)}
                            title="Remove role"
                          >
                            <UserX className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p><strong>Admin</strong> — Full access: publish, delete, manage users</p>
          <p><strong>Editor</strong> — Can publish and edit all posts, cannot delete or manage users</p>
          <p><strong>Contributor</strong> — Can only manage their own posts, submit for review</p>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
