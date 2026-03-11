const footerLinks = [
  {
    title: "Product",
    links: ["Transcribe API", "Analyze API", "Voice Search API", "Playground", "Pricing"],
  },
  {
    title: "Developers",
    links: ["Documentation", "API Reference", "SDKs", "Changelog", "Status"],
  },
  {
    title: "Solutions",
    links: ["Call Centers", "Media & Podcasts", "Healthcare", "Legal", "Education"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Security", "GDPR"],
  },
];

const Footer = () => (
  <footer id="company" className="bg-alt relative">
    {/* Gradient accent at top */}
    <div className="h-px w-full gradient-bg opacity-30" />

    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-body mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-body-muted hover:text-body transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
        <a href="/" className="text-xl font-bold gradient-text mb-4 md:mb-0">voicera</a>
        <p className="text-xs text-body-muted">© 2026 Voicera, Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
