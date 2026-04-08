import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"] as const;

export type UserRole = "admin" | "editor" | "contributor";

export function useAdminSession() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    toast({
      title: "Session expired",
      description: "You were signed out due to inactivity.",
      variant: "destructive",
    });
    navigate("/voicera-admin");
  }, [navigate, toast]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, INACTIVITY_TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/voicera-admin");
        return;
      }

      setUserId(session.user.id);

      // Check roles in priority order
      for (const role of ["admin", "editor", "contributor"] as const) {
        const { data } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: role,
        });
        if (data) {
          setUserRole(role);
          setLoading(false);
          return;
        }
      }

      // No valid role
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You don't have a valid role.", variant: "destructive" });
      navigate("/voicera-admin");
    };
    checkAuth();

    resetTimer();

    let lastActivity = Date.now();
    const onActivity = () => {
      const now = Date.now();
      if (now - lastActivity > 5000) {
        lastActivity = now;
        resetTimer();
      }
    };

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
    };
  }, [navigate, resetTimer, toast]);

  return { userRole, userId, loading };
}
