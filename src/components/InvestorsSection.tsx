import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Lock, Unlock, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import FloatingCapsules from "./FloatingCapsules";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});

const InvestorsSection = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY1 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [20, -80]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse({ email, consent });
    if (!result.success) {
      const fieldErrors: { email?: string; consent?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field as keyof typeof fieldErrors] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setUnlocked(true), 1200);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, var(--bg-alt) 30%, var(--bg-alt) 70%, hsl(0 0% 100%) 100%)",
      }}
    >
      {/* Timeline line – left side framing */}
      <div
        className="absolute top-0 bottom-0 w-px pointer-events-none hidden md:block"
        style={{
          left: "calc(50% - 560px)",
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.05) 75%, transparent 100%)",
        }}
      />

      {/* Floating capsules in background */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.35 }}>
        <FloatingCapsules variant="cta" count={10} />
      </div>

      {/* Parallax ambient orbs */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(66,133,244,0.08) 0%, transparent 70%)",
          top: "5%",
          left: "-8%",
          y: orbY1,
        }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(52,168,83,0.06) 0%, transparent 70%)",
          bottom: "5%",
          right: "-3%",
          y: orbY2,
        }}
      />

      <div id="investors" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient-pill">THE THESIS</span>
            <h2 className="type-display text-body mt-6 mb-6">
              The Trust Economy is the next Trillion-dollar market.
            </h2>
            <p className="type-body mb-10 max-w-lg">
              Deepfakes are skyrocketing. The demand for verification is
              outpacing supply.
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5 max-w-md"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-body">
                      Email<span style={{ color: "#EA4335" }}>*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johnsmith@company.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        style={{
                          background: "rgba(255,255,255,0.8)",
                          borderColor: errors.email ? "#EA4335" : "rgba(0,0,0,0.1)",
                          color: "var(--color-body)",
                        }}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs mt-1.5" style={{ color: "#EA4335" }}>{errors.email}</p>
                    )}
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className="w-[18px] h-[18px] rounded border flex items-center justify-center transition-all duration-200"
                        style={{
                          borderColor: errors.consent ? "#EA4335" : consent ? "#4285F4" : "rgba(0,0,0,0.15)",
                          background: consent ? "#4285F4" : "transparent",
                        }}
                      >
                        {consent && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <span className="text-xs leading-relaxed text-body-muted">
                      Consent to be added to our mailing list for any future updates<span style={{ color: "#EA4335" }}>*</span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-xs" style={{ color: "#EA4335" }}>{errors.consent}</p>
                  )}

                  <button
                    type="submit"
                    className="gradient-bg px-8 py-3.5 type-button text-white rounded-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(234,67,53,0.25)] inline-flex items-center gap-2"
                  >
                    Submit <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 max-w-md"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(66,133,244,0.1)" }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: "#4285F4" }} />
                  </div>
                  <p className="text-sm text-body-muted">
                    Access granted — enjoy the pitch.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Locked Video Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div
              className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden card-surface"
              style={{
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* Scanning line animation */}
              <AnimatePresence>
                {!unlocked && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="absolute left-0 right-0 h-px"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(52,168,83,0.4), transparent)",
                        boxShadow: "0 0 20px rgba(52,168,83,0.15)",
                      }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner accent marks */}
              {[
                { top: 12, left: 12, borderTop: true, borderLeft: true },
                { top: 12, right: 12, borderTop: true, borderRight: true },
                { bottom: 12, left: 12, borderBottom: true, borderLeft: true },
                { bottom: 12, right: 12, borderBottom: true, borderRight: true },
              ].map((corner, i) => (
                <div
                  key={i}
                  className="absolute w-5 h-5 pointer-events-none"
                  style={{
                    ...corner.top !== undefined && { top: corner.top },
                    ...corner.bottom !== undefined && { bottom: corner.bottom },
                    ...corner.left !== undefined && { left: corner.left },
                    ...corner.right !== undefined && { right: corner.right },
                    ...(corner.borderTop && { borderTop: "1px solid rgba(52,168,83,0.3)" }),
                    ...(corner.borderBottom && { borderBottom: "1px solid rgba(52,168,83,0.3)" }),
                    ...(corner.borderLeft && { borderLeft: "1px solid rgba(52,168,83,0.3)" }),
                    ...(corner.borderRight && { borderRight: "1px solid rgba(52,168,83,0.3)" }),
                  }}
                />
              ))}

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                <AnimatePresence mode="wait">
                  {!unlocked ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        className="relative mb-6"
                        animate={submitted ? { scale: [1, 1.2, 0.8], rotateY: [0, 180, 360] } : {}}
                        transition={{ duration: 1 }}
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, rgba(66,133,244,0.1), rgba(52,168,83,0.1))",
                            border: "1px solid rgba(52,168,83,0.15)",
                          }}
                        >
                          {submitted ? (
                            <Unlock className="w-7 h-7" style={{ color: "#EA4335" }} />
                          ) : (
                            <Lock className="w-7 h-7" style={{ color: "#EA4335" }} />
                          )}
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{ border: "1px solid rgba(52,168,83,0.2)" }}
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      <h3 className="type-card-title text-body mb-2">
                        Investor Pitch
                      </h3>
                      <p className="text-sm text-body-muted">
                        Submit your email to unlock this video
                      </p>

                      {/* Data visualization dots */}
                      <div className="flex gap-1.5 mt-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full"
                            style={{ background: "rgba(52,168,83,0.2)" }}
                            animate={{
                              height: [8, Math.random() * 24 + 8, 8],
                              background: [
                                "rgba(52,168,83,0.15)",
                                `rgba(${75 + i * 10},${110 - i * 3},245,0.35)`,
                                "rgba(52,168,83,0.15)",
                              ],
                            }}
                            transition={{
                              duration: 1.5 + Math.random(),
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{
                            background: "linear-gradient(135deg, rgba(66,133,244,0.1), rgba(52,168,83,0.1))",
                          }}
                        >
                          <Unlock className="w-7 h-7" style={{ color: "#EA4335" }} />
                        </div>
                        <p className="text-sm font-medium text-body-muted">
                          Video unlocked — coming soon
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestorsSection;
