import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown, DollarSign, Users, Shield, Heart, Scale } from "lucide-react";
import voiceraLogo from "@/assets/voicera-logo-new.png";
import { solutions } from "@/pages/SolutionPage";

const solutionIcons: Record<string, React.ReactNode> = {
  sales: <DollarSign className="w-4 h-4 text-primary" />,
  hr: <Users className="w-4 h-4 text-primary" />,
  "law-enforcement": <Shield className="w-4 h-4 text-primary" />,
  dating: <Heart className="w-4 h-4 text-primary" />,
  legal: <Scale className="w-4 h-4 text-primary" />,
};

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions", hasDropdown: true, dropdownType: "solutions" as const },
  
  {
    label: "Company",
    href: "#company",
    hasDropdown: true,
    dropdownType: "company" as const,
  },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Media", href: "/media" },
  { label: "Investors", href: "/investors" },
  { label: "Become a Partner", href: "/partners" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href.startsWith("/")) {
      navigate(href);
      setMobileOpen(false);
      return;
    }
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const handleDropdownEnter = (type: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(type);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(null), 150);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center">
          <img src={voiceraLogo} alt="Voicera" className="h-[90px] w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(link.dropdownType)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="type-nav text-body-muted hover:text-body transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen === link.dropdownType ? "rotate-180" : ""}`} />
                  </a>

                  <AnimatePresence>
                    {dropdownOpen === link.dropdownType && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl border border-border bg-card shadow-lg overflow-hidden"
                      >
                        {link.dropdownType === "solutions"
                          ? solutions.map((s) => (
                              <a
                                key={s.slug}
                                href={`/solutions/${s.slug}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDropdownOpen(null);
                                  navigate(`/solutions/${s.slug}`);
                                }}
                                className="block px-5 py-3 type-nav text-body-muted hover:bg-muted hover:text-body transition-colors border-b border-border last:border-b-0"
                              >
                                {s.name}
                              </a>
                            ))
                          : companyLinks.map((cl) => (
                              <a
                                key={cl.label}
                                href={cl.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDropdownOpen(null);
                                  navigate(cl.href);
                                }}
                                className="block px-5 py-3 type-nav text-body-muted hover:bg-muted hover:text-body transition-colors border-b border-border last:border-b-0"
                              >
                                {cl.label}
                              </a>
                            ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="type-nav text-body-muted hover:text-body transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              )
            )}
          </div>
          <div className="flex items-center gap-3">
            <a href="https://sincerity.voicera.io/auth/login" target="_blank" rel="noopener noreferrer" className="gradient-border-rect px-5 py-2 type-button rounded-xl inline-flex items-center gap-1.5">
              <span className="btn-label inline-flex items-center gap-1.5">Login <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#3B6FF5', WebkitTextFillColor: 'unset' }} /></span>
            </a>
            <button onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/kevins-voicera-calendar/30min' })} className="gradient-bg px-5 py-2 type-button text-white rounded-xl hover:scale-[1.03] transition-transform hover:shadow-[0_4px_20px_rgba(240,24,122,0.3)] inline-flex items-center gap-1.5">
              Book a Demo <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background border-t border-border px-6 py-6 space-y-4"
        >
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.label}>
                <button
                  onClick={() => setMobileDropdownOpen(mobileDropdownOpen === link.dropdownType ? null : link.dropdownType)}
                  className="flex items-center gap-1 type-nav text-body-muted cursor-pointer w-full"
                >
                  {link.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileDropdownOpen === link.dropdownType ? "rotate-180" : ""}`} />
                </button>
                {mobileDropdownOpen === link.dropdownType && (
                  <div className="pl-4 mt-2 space-y-2 border-l-2 border-border">
                    {link.dropdownType === "solutions"
                      ? solutions.map((s) => (
                          <a
                            key={s.slug}
                            href={`/solutions/${s.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setMobileOpen(false);
                              setMobileDropdownOpen(null);
                              navigate(`/solutions/${s.slug}`);
                            }}
                            className="block type-nav text-body-muted hover:text-body text-sm"
                          >
                            {s.name}
                          </a>
                        ))
                      : companyLinks.map((cl) => (
                          <a
                            key={cl.label}
                            href={cl.href}
                            onClick={(e) => {
                              e.preventDefault();
                              setMobileOpen(false);
                              setMobileDropdownOpen(null);
                              navigate(cl.href);
                            }}
                            className="block type-nav text-body-muted hover:text-body text-sm"
                          >
                            {cl.label}
                          </a>
                        ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="block type-nav text-body-muted cursor-pointer">
                {link.label}
              </a>
            )
          )}
          <div className="flex flex-col gap-3 pt-4">
            <a href="https://sincerity.voicera.io/auth/login" target="_blank" rel="noopener noreferrer" className="gradient-border-rect px-5 py-2 type-button rounded-xl inline-flex items-center gap-1.5">
              <span className="btn-label inline-flex items-center gap-1.5">Login <ArrowUpRight className="w-3.5 h-3.5" /></span>
            </a>
            <button onClick={() => { setMobileOpen(false); (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/kevins-voicera-calendar/30min' }); }} className="gradient-bg px-5 py-2 type-button text-white rounded-xl inline-flex items-center gap-1.5">
              Book a Demo <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
