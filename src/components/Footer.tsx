import { Link } from "react-router-dom";
import voiceraLogoBlack from "@/assets/voicera-logo-new.png";
import badgeSoc from "@/assets/badge-soc.png";
import badgeGdpr from "@/assets/badge-gdpr.png";
import badgeTpn from "@/assets/badge-tpn.png";

const footerLinks = [
  {
    title: "Product",
    links: ["Transcribe API", "Analyze API", "Voice Search API", "Credibility Score", "Pricing"],
  },
  {
    title: "Solutions",
    links: ["Sales Enablement", "Sales Coaching", "Remote Hiring", "Investor Relations", "Compliance"],
  },
  {
    title: "Developers",
    links: ["Documentation", "API Reference", "SDKs", "Changelog", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press", "Contact", "Sitemap"],
  },
];

const complianceBadges = [
  { src: badgeSoc, alt: "AICPA SOC Certified" },
  { src: badgeGdpr, alt: "GDPR Compliant" },
  { src: badgeTpn, alt: "TPN Trusted Partner Network" },
];

const Footer = () => (
  <footer id="company" className="bg-alt relative">
    {/* Gradient accent at top */}
    <div className="h-px w-full gradient-bg opacity-30" />

    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="type-button text-body mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  {link === "Sitemap" ? (
                    <Link to="/sitemap" className="type-footer hover:text-body transition-colors">
                      {link}
                    </Link>
                  ) : (
                    <a href="#" className="type-footer hover:text-body transition-colors">
                      {link}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Compliance badges column */}
        <div>
          <h4 className="type-button text-body mb-4">Legal</h4>
          <ul className="space-y-2.5 mb-5">
            <li><a href="#" className="type-footer hover:text-body transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="type-footer hover:text-body transition-colors">Terms of Service</a></li>
          </ul>
          <div className="flex items-center gap-3">
            {complianceBadges.map((badge) => (
              <img
                key={badge.alt}
                src={badge.src}
                alt={badge.alt}
                className="h-9 w-auto opacity-50 hover:opacity-70 transition-opacity duration-200"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
        <a href="#" onClick={(e) => e.preventDefault()} className="mb-4 md:mb-0">
          <img src={voiceraLogoBlack} alt="Voicera" className="h-[60px] w-auto" />
        </a>
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <a href="https://www.youtube.com/@VoiceraAI" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="https://www.linkedin.com/company/voiceraai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://x.com/VoiceraAI" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="X">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
        <p className="text-xs text-body-muted">© 2026 Voicera, Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;