import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"] as const;

export function useAdminSession() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

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
    // Verify admin on mount
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/voicera-admin");
        return;
      }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (!isAdmin) {
        await supabase.auth.signOut();
        navigate("/voicera-admin");
      }
    };
    checkAuth();

    // Start inactivity timer
    resetTimer();

    // Reset on user activity (throttled)
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
  }, [navigate, resetTimer]);
}
