import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import MfaVerify from "@/components/admin/MfaVerify";
import MfaSetup from "@/components/admin/MfaSetup";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout
const MFA_PROMPTED_KEY = "voicera_mfa_prompted";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [step, setStep] = useState<"login" | "mfa-verify" | "mfa-setup">("login");
  const attemptsRef = useRef(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkRoleAndProceed(session.user.id);
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

  const checkRoleAndProceed = async (userId: string) => {
    // Check if user has any valid admin/editor/contributor role
    for (const role of ["admin", "editor", "contributor"] as const) {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: role });
      if (data) {
        // Check if MFA is enrolled — if so, verification already happened
        // Check if we should prompt MFA setup
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const hasTotp = factors?.totp && factors.totp.length > 0;

        if (!hasTotp) {
          const prompted = sessionStorage.getItem(MFA_PROMPTED_KEY);
          if (!prompted) {
            sessionStorage.setItem(MFA_PROMPTED_KEY, "1");
            setStep("mfa-setup");
            return;
          }
        }

        navigate("/voicera-admin/dashboard");
        return;
      }
    }

    // No valid role
    await supabase.auth.signOut();
    toast({ title: "Invalid credentials.", variant: "destructive" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutUntil && Date.now() < lockoutUntil) {
      return; // silently block — lockout message already visible
    }

    if (!email.trim() || !password) {
      toast({ title: "Invalid credentials.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockoutUntil(until);
        setLockoutSeconds(Math.ceil(LOCKOUT_MS / 1000));
        // Generic message — don't reveal whether email exists
        toast({ title: "Too many attempts", description: "Please try again later.", variant: "destructive" });
      } else {
        // Single generic error — never reveal which field is wrong
        toast({ title: "Invalid credentials.", variant: "destructive" });
      }
      setLoading(false);
      return;
    }

    // Check if MFA is required
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const hasTotp = factors?.totp && factors.totp.length > 0;

    if (hasTotp) {
      setStep("mfa-verify");
      setLoading(false);
      return;
    }

    // No MFA — proceed to role check
    await checkRoleAndProceed(data.user.id);
    setLoading(false);
  };

  const handleMfaVerified = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await checkRoleAndProceed(session.user.id);
    }
  };

  const handleMfaCancelled = async () => {
    await supabase.auth.signOut();
    setStep("login");
  };

  const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;
  const lockoutMinutes = Math.ceil(lockoutSeconds / 60);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Voicera Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage blog posts</p>
        </div>

        {step === "login" && (
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
                Too many attempts. Try again in {lockoutMinutes > 1 ? `${lockoutMinutes} minutes` : `${lockoutSeconds}s`}.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading || isLockedOut}>
              {loading ? "Signing in…" : isLockedOut ? `Locked (${lockoutMinutes}m)` : "Sign In"}
            </Button>
          </form>
        )}

        {step === "mfa-verify" && (
          <MfaVerify onVerified={handleMfaVerified} onCancel={handleMfaCancelled} />
        )}

        {step === "mfa-setup" && (
          <MfaSetup
            onComplete={() => navigate("/voicera-admin/dashboard")}
            onSkip={() => navigate("/voicera-admin/dashboard")}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
