import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const C = {
  blue: "#3D52F4",
  blueDeep: "#2B3DE8",
  dark: "#0F1235",
  mid: "#4A5080",
  light: "#8B90B8",
  border: "#E2E4F0",
  nearWhite: "#F4F5FA",
  green: "#22C55E",
};

const fields: { label: string; key: string; required?: boolean; type?: string; full?: boolean }[][] = [
  [
    { label: "First Name", key: "firstName", required: true },
    { label: "Last Name", key: "lastName", required: true },
  ],
  [
    { label: "Job Title", key: "jobTitle", required: true },
    { label: "Business Email", key: "businessEmail", required: true, type: "email" },
  ],
  [
    { label: "Company Name", key: "companyName", required: true },
    { label: "Company Website URL", key: "companyWebsite", type: "url" },
  ],
  [
    { label: "How would you like to use Voicera?", key: "useCase", required: true, full: true },
  ],
];

interface StartBuildingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StartBuildingModal = ({ open, onOpenChange }: StartBuildingModalProps) => {
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("start-building-form", {
        body: form,
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when closing
      setTimeout(() => {
        setSubmitted(false);
        setForm({});
        setError("");
      }, 300);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[520px] p-0 overflow-hidden border-0"
        style={{
          borderRadius: 20,
          boxShadow: `0 12px 56px ${C.blue}1A, 0 2px 16px rgba(0,0,0,0.07)`,
          border: `1px solid ${C.border}`,
        }}
      >
        <div className="p-8 pb-7">
          {submitted ? (
            /* ---- Thank You State ---- */
            <div className="flex flex-col items-center text-center py-6">
              <div
                className="flex items-center justify-center rounded-full mb-5"
                style={{
                  width: 56,
                  height: 56,
                  background: `linear-gradient(135deg, ${C.green}22, ${C.green}11)`,
                  border: `2px solid ${C.green}44`,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: C.dark,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                  margin: "0 0 10px",
                }}
              >
                Thank You!
              </h2>
              <p
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 14,
                  color: C.mid,
                  lineHeight: 1.6,
                  maxWidth: 340,
                }}
              >
                Your API Key is on its way. Please allow 24hrs to receive your key.
              </p>
              <button
                onClick={() => handleClose(false)}
                className="mt-6 rounded-lg border-none text-xs font-bold cursor-pointer transition-shadow hover:shadow-lg"
                style={{
                  padding: "10px 28px",
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`,
                  color: "#fff",
                  boxShadow: `0 4px 14px ${C.blue}44`,
                }}
              >
                Close
              </button>
            </div>
          ) : (
            /* ---- Form State ---- */
            <>
              <DialogHeader className="mb-1">
                <DialogTitle
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontWeight: 800,
                    fontSize: 22,
                    color: C.dark,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  Get Started with Voicera
                </DialogTitle>
                <DialogDescription
                  className="mt-1"
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 13,
                    color: C.light,
                    lineHeight: 1.5,
                  }}
                >
                  Provide us some information to receive your free API key with access to 2 hours of Composite Analysis. Limit 1 per customer. Your key will be emailed to the address provided within 24hrs.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5">
                {fields.map((row, i) => (
                  <div key={i} className="flex gap-2.5">
                    {row.map((f) => (
                      <div key={f.key} className="flex-1">
                        <input
                          type={f.type || "text"}
                          placeholder={`${f.label}${f.required ? " *" : ""}`}
                          value={form[f.key] || ""}
                          onChange={(e) => handleChange(f.key, e.target.value)}
                          required={f.required}
                          disabled={submitting}
                          className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-all focus:ring-2 disabled:opacity-50"
                          style={{
                            fontFamily: "system-ui, sans-serif",
                            background: "#fff",
                            border: `1px solid ${C.border}`,
                            color: C.dark,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}

                {error && (
                  <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                    {error}
                  </p>
                )}

                {/* Progress bar */}
                <div
                  className="h-[5px] rounded-sm overflow-hidden mt-1"
                  style={{ background: C.border }}
                >
                  <div
                    className="h-full rounded-sm transition-all duration-300"
                    style={{ background: C.dark, width: "100%" }}
                  />
                </div>

                <div className="flex justify-end items-center mt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg border-none text-xs font-bold cursor-pointer transition-shadow hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      padding: "10px 24px",
                      background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`,
                      color: "#fff",
                      boxShadow: `0 4px 14px ${C.blue}44`,
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit →"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartBuildingModal;
