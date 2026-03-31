import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const C = {
  blue: "#3D52F4",
  blueDeep: "#2B3DE8",
  dark: "#0F1235",
  mid: "#4A5080",
  light: "#8B90B8",
  border: "#E2E4F0",
  nearWhite: "#F4F5FA",
};

const fields: { label: string; required?: boolean; type?: string; full?: boolean }[][] = [
  [
    { label: "First Name", required: true },
    { label: "Last Name", required: true },
  ],
  [
    { label: "Job Title", required: true },
    { label: "Business Email", required: true, type: "email" },
  ],
  [
    { label: "Company Name", required: true },
    { label: "Company Website URL", type: "url" },
  ],
  [
    { label: "How would you like to use Voicera?", required: true, full: true },
  ],
];

interface StartBuildingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StartBuildingModal = ({ open, onOpenChange }: StartBuildingModalProps) => {
  const [form, setForm] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up form submission
    console.log("Form submitted:", form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[520px] p-0 overflow-hidden border-0"
        style={{
          borderRadius: 20,
          boxShadow: `0 12px 56px ${C.blue}1A, 0 2px 16px rgba(0,0,0,0.07)`,
          border: `1px solid ${C.border}`,
        }}
      >
        <div className="p-8 pb-7">
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
              Fill in your details and we'll get you set up right away.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5">
            {fields.map((row, i) => (
              <div key={i} className="flex gap-2.5">
                {row.map((f) => (
                  <div
                    key={f.label}
                    className="flex-1"
                  >
                    <input
                      type={f.type || "text"}
                      placeholder={`${f.label}${f.required ? " *" : ""}`}
                      value={form[f.label] || ""}
                      onChange={(e) => handleChange(f.label, e.target.value)}
                      required={f.required}
                      className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-all focus:ring-2"
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
                className="rounded-lg border-none text-xs font-bold cursor-pointer transition-shadow hover:shadow-lg"
                style={{
                  padding: "10px 24px",
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`,
                  color: "#fff",
                  boxShadow: `0 4px 14px ${C.blue}44`,
                }}
              >
                Submit →
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartBuildingModal;
