import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldCheck, Loader2, Copy, Check } from "lucide-react";

interface MfaSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const MfaSetup = ({ onComplete, onSkip }: MfaSetupProps) => {
  const [step, setStep] = useState<"intro" | "enroll" | "verify">("intro");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Check if already enrolled
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.mfa.listFactors();
      if (data?.totp && data.totp.length > 0) {
        // Already enrolled
        onComplete();
      }
    };
    check();
  }, [onComplete]);

  const startEnroll = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Voicera Admin",
    });

    if (error || !data) {
      toast({ title: "Setup failed", description: "Could not start 2FA setup.", variant: "destructive" });
      setLoading(false);
      return;
    }

    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setFactorId(data.id);
    setStep("enroll");
    setLoading(false);
  };

  const verifyEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 6) return;

    setLoading(true);
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      toast({ title: "Verification failed", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });

    if (verifyError) {
      toast({ title: "Invalid code", description: "Please check and try again.", variant: "destructive" });
      setCode("");
    } else {
      toast({ title: "2FA enabled", description: "Your account is now protected with two-factor authentication." });
      onComplete();
    }
    setLoading(false);
  };

  const copySecret = async () => {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === "intro") {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Shield className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <h2 className="text-lg font-semibold text-foreground">Secure Your Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We strongly recommend enabling two-factor authentication (2FA) to protect your admin account.
          </p>
        </div>
        <Button className="w-full" onClick={startEnroll} disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Setting up…</> : <>
            <ShieldCheck className="w-4 h-4 mr-1" /> Set Up 2FA
          </>}
        </Button>
        <Button variant="ghost" className="w-full text-muted-foreground" onClick={onSkip}>
          Skip for now
        </Button>
      </div>
    );
  }

  if (step === "enroll") {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">Scan QR Code</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Scan this QR code with Google Authenticator, Authy, or any TOTP app.
          </p>
        </div>

        {qrCode && (
          <div className="flex justify-center">
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 rounded border border-border" />
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Or enter this key manually:</p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all select-all">
              {secret}
            </code>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={copySecret}>
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        <form onSubmit={verifyEnrollment} className="space-y-3">
          <div>
            <Label htmlFor="verify-code">Enter the 6-digit code from your app</Label>
            <Input
              id="verify-code"
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
            {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Verifying…</> : "Verify & Enable 2FA"}
          </Button>
        </form>
      </div>
    );
  }

  return null;
};

export default MfaSetup;
