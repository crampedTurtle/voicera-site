const teamMembers = [
  {
    name: "Fei-Fei Li",
    title: "Professor at Stanford University",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  },
  {
    name: "Silvio Savarese",
    title: "Professor at Stanford University",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
  {
    name: "Jeffrey Katzenberg",
    title: "Former Dreamworks Animation CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Alex Wang",
    title: "Founder, CEO of Scale AI",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
  },
  {
    name: "Lukas Biewald",
    title: "Founder, CEO of Weights and Biases",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    name: "Nicolas Dessaigne",
    title: "Founder, CEO of Algolia",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&q=80",
  },
  {
    name: "Jay Simons",
    title: "President of Atlassian",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80",
  },
];

const TeamSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tag */}
        <div className="flex justify-center mb-6">
          <span className="type-tag border border-border rounded-full px-4 py-1.5 text-foreground">
            OUR ADVISORS
          </span>
        </div>

        {/* Heading */}
        <h2 className="type-display text-center mb-16">{"\n"}</h2>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex items-center gap-4 border-l-2 border-border pl-4">
              <img
                src={member.image}
                alt={member.name}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="w-16 h-16 rounded-full object-cover flex-shrink-0 bg-secondary"
              />
              <div className="min-w-0">
                <p className="type-card-title text-foreground text-sm font-semibold leading-tight">
                  {member.name}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5 leading-snug">
                  {member.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
