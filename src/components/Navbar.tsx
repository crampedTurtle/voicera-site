import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import voiceraLogo from "@/assets/voicera-logo-new.png";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions" },
  { label: "Partners", href: "#developers" },
  { label: "Pricing", href: "#pricing" },
  { label: "Company", href: "#company" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.95)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center">
          <img src={voiceraLogo} alt="Voicera" className="h-[72px] w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="type-nav text-body-muted hover:text-body transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="gradient-border-rect px-5 py-2 type-button rounded-xl inline-flex items-center gap-1.5">
            <span className="btn-label inline-flex items-center gap-1.5">Try Free <ArrowUpRight className="w-3.5 h-3.5" /></span>
          </button>
          <button className="gradient-bg px-5 py-2 type-button text-white rounded-xl hover:scale-[1.03] transition-transform hover:shadow-[0_4px_20px_rgba(240,24,122,0.3)] inline-flex items-center gap-1.5">
            Book a Demo <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-border px-6 py-6 space-y-4"
        >
          {navLinks.map((link) => (
            <a key={link.label} href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); }} className="block type-nav text-body-muted cursor-pointer">
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <button className="gradient-border-rect px-5 py-2 type-button rounded-xl inline-flex items-center gap-1.5">
              <span className="btn-label inline-flex items-center gap-1.5">Try Free <ArrowUpRight className="w-3.5 h-3.5" /></span>
            </button>
            <button className="gradient-bg px-5 py-2 type-button text-white rounded-xl inline-flex items-center gap-1.5">
              Book a Demo <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
