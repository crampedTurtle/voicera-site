import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import voiceraLogo from "@/assets/voicera-logo-new.png";
import { trackEvent } from "@/lib/gtag";
import { useNavigate } from "react-router-dom";

const StickyNavbar = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur-md border-b border-border shadow-[0_2px_16px_rgba(0,0,0,0.06)] hidden md:block"
        >
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center">
              <img src={voiceraLogo} alt="Voicera" className="h-[70px] w-auto" />
            </a>
            <div className="flex items-center gap-3">
              <a
                href="https://sincerity.voicera.io/auth/login"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_click", { cta_text: "Login", location: "sticky_nav" })}
                className="gradient-border-rect px-5 py-2 type-button rounded-xl inline-flex items-center gap-1.5"
              >
                <span className="btn-label inline-flex items-center gap-1.5">
                  Login <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#3B6FF5', WebkitTextFillColor: 'unset' }} />
                </span>
              </a>
              <button
                onClick={() => { trackEvent("cta_click", { cta_text: "Book a Demo", location: "sticky_nav" }); (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/kevins-voicera-calendar/30min' }); }}
                className="gradient-bg px-5 py-2 type-button text-white rounded-xl hover:scale-[1.03] transition-transform hover:shadow-[0_4px_20px_rgba(240,24,122,0.3)] inline-flex items-center gap-1.5"
              >
                Book a Demo <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyNavbar;
