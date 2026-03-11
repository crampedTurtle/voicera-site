const logos = [
  "NVIDIA", "Google Cloud", "Microsoft", "Spotify", "Zoom", "Salesforce", "Adobe", "Slack",
];

const SocialProof = () => (
  <section className="py-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
      <span className="gradient-pill">TRUSTED BY</span>
    </div>
    <div className="relative overflow-hidden">
      <div className="animate-marquee flex gap-16 items-center w-max">
        {[...logos, ...logos].map((name, i) => (
          <span
            key={i}
            className="text-xl font-bold tracking-tight text-body-muted/30 hover:text-body-muted transition-colors duration-300 whitespace-nowrap select-none"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
