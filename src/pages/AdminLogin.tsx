import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 1 minute lockout

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const attemptsRef = useRef(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkAdminAndRedirect(session.user.id);
      }
    });
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setLockoutSeconds(0);
        attemptsRef.current = 0;
      } else {
        setLockoutSeconds(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const checkAdminAndRedirect = async (userId: string) => {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (data) {
      navigate("/voicera-admin/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutUntil && Date.now() < lockoutUntil) {
      toast({ title: "Too many attempts", description: `Please wait ${lockoutSeconds}s before trying again.`, variant: "destructive" });
      return;
    }

    if (!email.trim() || !password) {
      toast({ title: "Missing fields", description: "Email and password are required.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockoutUntil(until);
        setLockoutSeconds(Math.ceil(LOCKOUT_MS / 1000));
        toast({ title: "Too many failed attempts", description: "Account temporarily locked for 60 seconds.", variant: "destructive" });
      } else {
        // Generic error message to avoid user enumeration
        toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
      }
      setLoading(false);
      return;
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You don't have admin privileges.", variant: "destructive" });
      setLoading(false);
      return;
    }

    navigate("/voicera-admin/dashboard");
  };

  const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Voicera Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage blog posts</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              maxLength={255}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              maxLength={128}
            />
          </div>
          {isLockedOut && (
            <p className="text-sm text-destructive text-center">
              Too many attempts. Try again in {lockoutSeconds}s.
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading || isLockedOut}>
            {loading ? "Signing in…" : isLockedOut ? `Locked (${lockoutSeconds}s)` : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
