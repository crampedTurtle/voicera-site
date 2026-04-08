import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2 } from "lucide-react";

interface MfaVerifyProps {
  onVerified: () => void;
  onCancel: () => void;
}

const MfaVerify = ({ onVerified, onCancel }: MfaVerifyProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getFactors = async () => {
      const { data } = await supabase.auth.mfa.listFactors();
      const totp = data?.totp?.[0];
      if (totp) setFactorId(totp.id);
    };
    getFactors();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || !code.trim()) return;

    setLoading(true);
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      toast({ title: "Invalid credentials.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });

    if (verifyError) {
      toast({ title: "Invalid credentials.", variant: "destructive" });
      setCode("");
    } else {
      onVerified();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Shield className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <Label htmlFor="totp-code">Verification Code</Label>
          <Input
            id="totp-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            autoComplete="one-time-code"
            autoFocus
            className="text-center text-lg tracking-widest"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Verifying…</> : "Verify"}
        </Button>
        <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default MfaVerify;
