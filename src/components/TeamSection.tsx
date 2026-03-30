import chandraImg from "@/assets/team/chandra.png";
import danImg from "@/assets/team/dan-stoks.png";
import brettImg from "@/assets/team/brett-wilson.png";
import brittImg from "@/assets/team/britt-alexander.png";
import jasleenImg from "@/assets/team/jasleen-deol.png";
import kevinImg from "@/assets/headshot-kevin.png";
import ryanImg from "@/assets/team/ryan-park.png";
import raghavanImg from "@/assets/team/raghavan-rajagopalan.png";
import andrewImg from "@/assets/team/andrew-friedman.jpg";

const teamMembers = [
  { name: "Chandra de Keyser", title: "CEO, ex-Northrop w/ 2 exits", image: chandraImg },
  { name: "Kevin Wright", title: "CRO, ex-ContentSquare", image: kevinImg },
  { name: "Brett Wilson", title: "CTO, ex-VMware", image: brettImg },
  { name: "Jasleen Deol", title: "Head of Product, ex-AMD & L3Harris", image: jasleenImg },
  { name: "Ryan Park", title: "Head of Marketing & Executive Comms", image: ryanImg },
  { name: "Andrew Friedman", title: "Head of Business Operation & Legal", image: andrewImg },
  { name: "Britt Alexander", title: "Product Lead, Columbia University", image: brittImg },
];

const advisors = [
  { name: "Dan Stoks", title: "Advisor, 26yrs Oracle", image: danImg },
  { name: "Raghavan Rajagopalan", title: "Advisor, 20yrs Pearson", image: raghavanImg },
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
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
                className="w-20 h-20 rounded-full object-cover flex-shrink-0 bg-secondary"
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

        {/* Advisors */}
        <div className="flex justify-center mt-16 mb-6">
          <span className="type-tag border border-border rounded-full px-4 py-1.5 text-foreground">
            ADVISORS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-10 max-w-2xl mx-auto">
          {advisors.map((member) => (
            <div key={member.name} className="flex items-center gap-4 border-l-2 border-border pl-4">
              <img
                src={member.image}
                alt={member.name}
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
                className="w-20 h-20 rounded-full object-cover flex-shrink-0 bg-secondary"
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
