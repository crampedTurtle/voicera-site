import voiceraLogoBlack from "@/assets/voicera-logo-black.png";
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
    links: ["About", "Blog", "Careers", "Press", "Contact"],
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
                  <a href="#" className="type-footer hover:text-body transition-colors">
                    {link}
                  </a>
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
          <img src={voiceraLogoBlack} alt="Voicera" className="h-8 w-auto" />
        </a>
        <p className="text-xs text-body-muted">© 2026 Voicera, Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;