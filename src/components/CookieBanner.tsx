import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "voicera_cookie_consent";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CookieBanner = forwardRef<HTMLDivElement>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) return; // Already consented

    const timer = setTimeout(() => setVisible(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const saveConsent = (state: ConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...state, timestamp: new Date().toISOString() }));
    setVisible(false);
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () => saveConsent({ necessary: true, analytics: false, marketing: false });
  const savePreferences = () => saveConsent(consent);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-3">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-accent" />
              <span className="font-display font-semibold text-sm">Cookie Preferences</span>
            </div>
            <button onClick={rejectAll} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 pb-4">
            <p className="text-muted-foreground text-xs leading-relaxed">
              We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. You can customize your preferences or accept all cookies.
            </p>

            {/* Preferences panel */}
            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    <CookieToggle
                      label="Necessary"
                      description="Required for the website to function"
                      checked={true}
                      disabled
                    />
                    <CookieToggle
                      label="Analytics"
                      description="Help us understand how visitors interact"
                      checked={consent.analytics}
                      onChange={(v) => setConsent((c) => ({ ...c, analytics: v }))}
                    />
                    <CookieToggle
                      label="Marketing"
                      description="Used to deliver relevant advertisements"
                      checked={consent.marketing}
                      onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 px-5 pb-5">
            {showPreferences ? (
              <>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 text-xs font-medium py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={savePreferences}
                  className="flex-1 text-xs font-medium py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Save Preferences
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 text-xs font-medium py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 text-xs font-medium py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 text-xs font-medium py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Accept All
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CookieToggle = ({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) => (
  <label className="flex items-center justify-between gap-3 cursor-pointer">
    <div>
      <span className="text-xs font-medium text-foreground">{label}</span>
      <p className="text-[11px] text-muted-foreground leading-snug">{description}</p>
    </div>
    <div
      className={`relative w-9 h-5 rounded-full transition-colors ${
        disabled ? "bg-accent/50 cursor-not-allowed" : checked ? "bg-accent" : "bg-muted-foreground/30"
      }`}
      onClick={(e) => {
        if (disabled) return;
        e.preventDefault();
        onChange?.(!checked);
      }}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </div>
  </label>
);

export default CookieBanner;
