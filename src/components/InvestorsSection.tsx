import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { z } from "zod";

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
    // Simulate unlock after brief animation
    setTimeout(() => setUnlocked(true), 1200);
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0F1629 0%, #141B2D 50%, #0F1629 100%)" }}>
      {/* Ambient gradient orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none animate-float-orb"
        style={{
          background: "radial-gradient(circle, rgba(75,110,245,0.12) 0%, transparent 70%)",
          top: "10%",
          left: "-10%",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-float-orb"
        style={{
          background: "radial-gradient(circle, rgba(155,77,235,0.08) 0%, transparent 70%)",
          bottom: "10%",
          right: "-5%",
          animationDelay: "3s",
        }}
      />

      {/* Thin scanline grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.5) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.5) 60px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ color: "#4B6EF5" }}
            >
              THE THESIS
            </span>
            <h2
              className="font-display font-bold tracking-tight mb-6"
              style={{
                fontSize: "clamp(36px, 4.5vw, 56px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
              }}
            >
              The Trust Economy is the next Trillion-dollar market.
            </h2>
            <p
              className="mb-10 max-w-lg"
              style={{ fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}
            >
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
                    <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                      Email<span style={{ color: "#F0187A" }}>*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johnsmith@company.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          borderColor: errors.email ? "#F0187A" : "rgba(255,255,255,0.1)",
                          color: "#FFFFFF",
                        }}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs mt-1.5" style={{ color: "#F0187A" }}>{errors.email}</p>
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
                        className="w-4.5 h-4.5 w-[18px] h-[18px] rounded border flex items-center justify-center transition-all duration-200"
                        style={{
                          borderColor: errors.consent ? "#F0187A" : consent ? "#4B6EF5" : "rgba(255,255,255,0.2)",
                          background: consent ? "#4B6EF5" : "transparent",
                        }}
                      >
                        {consent && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                      Consent to be added to our mailing list for any future updates<span style={{ color: "#F0187A" }}>*</span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-xs" style={{ color: "#F0187A" }}>{errors.consent}</p>
                  )}

                  <button
                    type="submit"
                    className="gradient-bg px-8 py-3.5 type-button text-white rounded-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)] inline-flex items-center gap-2"
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(75,110,245,0.15)" }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: "#4B6EF5" }} />
                  </div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
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
              className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
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
                        background: "linear-gradient(90deg, transparent, rgba(75,110,245,0.6), transparent)",
                        boxShadow: "0 0 20px rgba(75,110,245,0.3)",
                      }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner accent marks */}
              <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none" style={{ borderTop: "1px solid rgba(75,110,245,0.4)", borderLeft: "1px solid rgba(75,110,245,0.4)" }} />
              <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none" style={{ borderTop: "1px solid rgba(75,110,245,0.4)", borderRight: "1px solid rgba(75,110,245,0.4)" }} />
              <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none" style={{ borderBottom: "1px solid rgba(75,110,245,0.4)", borderLeft: "1px solid rgba(75,110,245,0.4)" }} />
              <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none" style={{ borderBottom: "1px solid rgba(75,110,245,0.4)", borderRight: "1px solid rgba(75,110,245,0.4)" }} />

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
                      {/* Animated lock icon */}
                      <motion.div
                        className="relative mb-6"
                        animate={submitted ? { scale: [1, 1.2, 0.8], rotateY: [0, 180, 360] } : {}}
                        transition={{ duration: 1 }}
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, rgba(75,110,245,0.15), rgba(155,77,235,0.15))",
                            border: "1px solid rgba(75,110,245,0.2)",
                          }}
                        >
                          {submitted ? (
                            <Unlock className="w-7 h-7" style={{ color: "#4B6EF5" }} />
                          ) : (
                            <Lock className="w-7 h-7" style={{ color: "#4B6EF5" }} />
                          )}
                        </div>
                        {/* Pulse ring */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{ border: "1px solid rgba(75,110,245,0.3)" }}
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      <h3
                        className="font-display font-bold text-xl mb-2"
                        style={{ color: "#FFFFFF" }}
                      >
                        Investor Pitch
                      </h3>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Submit your email to unlock this video
                      </p>

                      {/* Data visualization dots */}
                      <div className="flex gap-1.5 mt-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full"
                            style={{ background: "rgba(75,110,245,0.3)" }}
                            animate={{
                              height: [8, Math.random() * 24 + 8, 8],
                              background: [
                                "rgba(75,110,245,0.2)",
                                `rgba(${75 + i * 10},${110 - i * 3},245,0.5)`,
                                "rgba(75,110,245,0.2)",
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
                            background: "linear-gradient(135deg, rgba(75,110,245,0.2), rgba(155,77,235,0.2))",
                          }}
                        >
                          <Unlock className="w-7 h-7" style={{ color: "#4B6EF5" }} />
                        </div>
                        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
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
