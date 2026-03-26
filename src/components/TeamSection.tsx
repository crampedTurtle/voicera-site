import chandraImg from "@/assets/team/chandra.png";
import brettImg from "@/assets/team/brett-wilson.png";
import brittImg from "@/assets/team/britt-alexander.png";
import jasleenImg from "@/assets/team/jasleen-deol.png";
import kevinImg from "@/assets/team/kevin-wright.png";
import ryanImg from "@/assets/team/ryan-park.png";

const teamMembers = [
  {
    name: "Chandra",
    title: "CEO",
    image: chandraImg,
  },
  {
    name: "Brett Wilson",
    title: "Advisor",
    image: brettImg,
  },
  {
    name: "Britt Alexander",
    title: "Advisor",
    image: brittImg,
  },
  {
    name: "Jasleen Deol",
    title: "Advisor",
    image: jasleenImg,
  },
  {
    name: "Kevin Wright",
    title: "Advisor",
    image: kevinImg,
  },
  {
    name: "Ryan Park",
    title: "Advisor",
    image: ryanImg,
  },
];

const TeamSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tag */}
        <div className="flex justify-center mb-6">
          <span className="type-tag border border-border rounded-full px-4 py-1.5 text-foreground">
            OUR TEAM
          </span>
        </div>

        {/* Heading */}
        <h2 className="type-display text-center mb-16">Meet Our Founding Team</h2>

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
