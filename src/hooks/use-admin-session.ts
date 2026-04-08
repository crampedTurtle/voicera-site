import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes idle
const ABSOLUTE_SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours absolute
const SESSION_START_KEY = "voicera_session_start";
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"] as const;

export type UserRole = "admin" | "editor" | "contributor";

export function useAdminSession() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const absoluteTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async (reason: "idle" | "absolute" | "manual" = "idle") => {
    // Server-side invalidation — revokes refresh token
    await supabase.auth.signOut();
    sessionStorage.removeItem(SESSION_START_KEY);

    const messages: Record<string, string> = {
      idle: "You were signed out due to inactivity.",
      absolute: "Your session has expired. Please sign in again.",
      manual: "You have been signed out.",
    };

    toast({
      title: "Session ended",
      description: messages[reason],
      variant: "destructive",
    });
    navigate("/voicera-admin");
  }, [navigate, toast]);

  // Idle timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => logout("idle"), INACTIVITY_TIMEOUT_MS);
  }, [logout]);

  // Absolute session timer
  const startAbsoluteTimer = useCallback(() => {
    const startStr = sessionStorage.getItem(SESSION_START_KEY);
    let start = startStr ? parseInt(startStr, 10) : Date.now();

    if (!startStr) {
      sessionStorage.setItem(SESSION_START_KEY, String(start));
    }

    const elapsed = Date.now() - start;
    const remaining = ABSOLUTE_SESSION_MS - elapsed;

    if (remaining <= 0) {
      logout("absolute");
      return;
    }

    if (absoluteTimerRef.current) clearTimeout(absoluteTimerRef.current);
    absoluteTimerRef.current = setTimeout(() => logout("absolute"), remaining);
  }, [logout]);

  useEffect(() => {
    const init = async () => {
      // Listen for auth state changes first
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          setUserRole(null);
          setUserId(null);
          setLoading(false);
        }
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/voicera-admin");
        setLoading(false);
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

          // Start timers
          resetTimer();
          startAbsoluteTimer();

          return;
        }
      }

      // No valid role — sign out server-side
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You don't have a valid role.", variant: "destructive" });
      navigate("/voicera-admin");
      setLoading(false);

      return () => subscription.unsubscribe();
    };

    init();

    // Activity listener for idle reset
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
      if (absoluteTimerRef.current) clearTimeout(absoluteTimerRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
    };
  }, [navigate, resetTimer, startAbsoluteTimer, toast]);

  return { userRole, userId, loading, logout };
}
