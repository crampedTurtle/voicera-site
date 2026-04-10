import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown, DollarSign, Users, Shield, Heart, Scale, BrainCircuit } from "lucide-react";
import voiceraLogo from "@/assets/voicera-logo-new.png";
import voiceraLogoWhite from "@/assets/voicera-logo-white.png";
import iconAnalyze from "@/assets/icon-analyze.png";
import iconApiDocs from "@/assets/icon-api-docs.png";

import { solutions } from "@/pages/SolutionPage";

const solutionIcons: Record<string, React.ReactNode> = {
  sales: <DollarSign className="w-4 h-4 text-primary" />,
  "revenue-intelligence": <BrainCircuit className="w-4 h-4 text-primary" />,
  hr: <Users className="w-4 h-4 text-primary" />,
  "law-enforcement": <Shield className="w-[18px] h-[18px] text-primary" />,
  dating: <Heart className="w-4 h-4 text-primary" />,
  legal: <Scale className="w-4 h-4 text-primary" />,
};

const productLinks = [
  { label: "Sincerity™ v2", href: "#product", icon: iconAnalyze },
  { label: "API Docs", href: "/api-docs" },
];

const navLinks = [
  { label: "Product", href: "#product", hasDropdown: true, dropdownType: "product" as const },
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
];

const platformColLinks = [
  { label: "Platform", href: "#product" },
  { label: "Case Studies", href: "/#case-studies" },
  { label: "Voicera Labs", href: "/voicera-labs" },
];

const partnersColLinks = [
  { label: "Become a Partner", href: "/partners" },
];

const Navbar = ({ lightText = false }: { lightText?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const topLinkClass = lightText
    ? "!text-primary-foreground hover:!text-primary-foreground"
    : "text-body-muted hover:text-body";
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
          <img src={lightText ? voiceraLogoWhite : voiceraLogo} alt="Voicera" className={lightText ? "h-[30px] w-auto" : "h-[90px] w-auto"} />
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
                    className={`type-nav ${topLinkClass} transition-colors cursor-pointer inline-flex items-center gap-1`}
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
                        className={`absolute top-full mt-2 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50 ${
                          link.dropdownType === "solutions"
                            ? "left-1/2 -translate-x-[65%] ml-[-350px] w-[720px] max-w-[calc(100vw-2rem)]"
                            : "left-1/2 -translate-x-1/2 w-64"
                        }`}
                      >
                        {link.dropdownType === "solutions" ? (
                          <div className="grid grid-cols-3 divide-x divide-border">
                            {/* Column 1: Platform */}
                            <div className="py-3">
                              <div className="px-5 pb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Platform</div>
                              {platformColLinks.map((pl) => (
                                <a
                                  key={pl.label}
                                  href={pl.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setDropdownOpen(null);
                                    if (pl.href.startsWith("#")) {
                                      handleNavClick(e, pl.href);
                                    } else {
                                      navigate(pl.href);
                                    }
                                  }}
                                  className="flex items-center gap-2.5 px-5 py-2.5 type-nav text-body-muted hover:bg-muted hover:text-body transition-colors"
                                >
                                  {pl.label}
                                </a>
                              ))}
                            </div>
                            {/* Column 2: Solutions */}
                            <div className="py-3">
                              <div className="px-5 pb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Solutions</div>
                              {solutions.map((s) => (
                                <a
                                  key={s.slug}
                                  href={`/solutions/${s.slug}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setDropdownOpen(null);
                                    navigate(`/solutions/${s.slug}`);
                                  }}
                                  className="flex items-center gap-2.5 px-5 py-2.5 type-nav text-body-muted hover:bg-muted hover:text-body transition-colors"
                                >
                                  {solutionIcons[s.slug]}
                                  {s.name}
                                </a>
                              ))}
                            </div>
                            {/* Column 3: Partners */}
                            <div className="py-3">
                              <div className="px-5 pb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Partners</div>
                              {partnersColLinks.map((pl) => (
                                <a
                                  key={pl.label}
                                  href={pl.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setDropdownOpen(null);
                                    navigate(pl.href);
                                  }}
                                  className="flex items-center gap-2.5 px-5 py-2.5 type-nav text-body-muted hover:bg-muted hover:text-body transition-colors"
                                >
                                  {pl.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ) : link.dropdownType === "product"
                          ? productLinks.map((pl) => (
                              <a
                                key={pl.label}
                                href={pl.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDropdownOpen(null);
                                  handleNavClick(e, pl.href);
                                }}
                                className="flex items-center gap-2.5 px-5 py-3 type-nav text-body-muted hover:bg-muted hover:text-body transition-colors border-b border-border last:border-b-0"
                              >
                                {pl.icon && <img src={pl.icon} alt="" className="w-[50px] h-[50px] -my-3" style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(52%) saturate(2057%) hue-rotate(209deg) brightness(101%) contrast(92%)' }} />}
                                {pl.label}
                              </a>
                            ))
                          : (
                            <>
                              {companyLinks.map((cl) => (
                                <a
                                  key={cl.label}
                                  href={cl.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setDropdownOpen(null);
                                    navigate(cl.href);
                                  }}
                                  className="flex items-center gap-2.5 px-5 py-3 type-nav text-body-muted hover:bg-muted hover:text-body transition-colors border-b border-border"
                                >
                                  {cl.label}
                                </a>
                              ))}
                              <div className="flex items-center gap-3 px-5 py-3">
                                <a href="https://www.linkedin.com/company/voiceraai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </a>
                                <a href="https://x.com/VoiceraAI" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="X">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                              </div>
                            </>
                          )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`type-nav ${topLinkClass} transition-colors cursor-pointer`}
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
                      ? (
                        <>
                          <div className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase pt-1">Platform</div>
                          {platformColLinks.map((pl) => (
                            <a key={pl.label} href={pl.href} onClick={(e) => { e.preventDefault(); setMobileOpen(false); setMobileDropdownOpen(null); if (pl.href.startsWith("#")) handleNavClick(e, pl.href); else navigate(pl.href); }} className="flex items-center gap-2 type-nav text-body-muted hover:text-body text-sm">{pl.label}</a>
                          ))}
                          <div className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase pt-3">Solutions</div>
                          {solutions.map((s) => (
                            <a key={s.slug} href={`/solutions/${s.slug}`} onClick={(e) => { e.preventDefault(); setMobileOpen(false); setMobileDropdownOpen(null); navigate(`/solutions/${s.slug}`); }} className="flex items-center gap-2 type-nav text-body-muted hover:text-body text-sm">
                              {solutionIcons[s.slug]}
                              {s.name}
                            </a>
                          ))}
                          <div className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase pt-3">Partners</div>
                          {partnersColLinks.map((pl) => (
                            <a key={pl.label} href={pl.href} onClick={(e) => { e.preventDefault(); setMobileOpen(false); setMobileDropdownOpen(null); navigate(pl.href); }} className="flex items-center gap-2 type-nav text-body-muted hover:text-body text-sm">{pl.label}</a>
                          ))}
                        </>
                      )
                      : link.dropdownType === "product"
                      ? productLinks.map((pl) => (
                          <a
                            key={pl.label}
                            href={pl.href}
                            onClick={(e) => {
                              e.preventDefault();
                              setMobileOpen(false);
                              setMobileDropdownOpen(null);
                              handleNavClick(e, pl.href);
                            }}
                            className="flex items-center gap-2 type-nav text-body-muted hover:text-body text-sm"
                          >
                            {pl.icon && <img src={pl.icon} alt="" className="w-10 h-10 -my-2" style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(52%) saturate(2057%) hue-rotate(209deg) brightness(101%) contrast(92%)' }} />}
                            {pl.label}
                          </a>
                        ))
                      : (
                        <>
                          {companyLinks.map((cl) => (
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
                          <div className="flex items-center gap-3 pt-1">
                            <a href="https://www.linkedin.com/company/voiceraai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </a>
                            <a href="https://x.com/VoiceraAI" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="X">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                          </div>
                        </>
                      )}
                  </div>
                )}
              </div>
            ) : (
              <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="block type-nav text-body-muted cursor-pointer">
                {link.label}
              </a>
            )
          )}
          <div className="flex flex-row gap-3 pt-4">
            <a href="https://sincerity.voicera.io/auth/login" target="_blank" rel="noopener noreferrer" className="flex-1 gradient-border-rect px-5 py-3.5 type-button rounded-2xl inline-flex items-center justify-center gap-1.5">
              <span className="btn-label inline-flex items-center gap-1.5">Login <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#3B6FF5', WebkitTextFillColor: 'unset' }} /></span>
            </a>
            <button onClick={() => { setMobileOpen(false); (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/kevins-voicera-calendar/30min' }); }} className="flex-1 gradient-bg px-5 py-3.5 type-button text-white rounded-2xl inline-flex items-center justify-center gap-1.5">
              Book a Demo <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
