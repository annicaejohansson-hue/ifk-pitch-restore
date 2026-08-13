import { Card } from "@/components/ui/card";

const agilityImageUrl = "https://nwscdn.com/media/wysiwyg/forza/Agility-football-training-ladder.jpg?odnHeight=117&odnWidth=117&odnBg=FFFFFF";
const leftImageUrl = "https://simplifaster.com/wp-content/uploads/2025/06/Female-Soccer-Striker.jpg";
const heelCupImageUrl =
  "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80";

const services = [
  {
    title: "Bedömning och behandling vid skada",
    description:
      "När du har ont eller är skadad hjälper vi dig med tydlig bedömning, diagnos och individuellt anpassad behandling. Målet är att minska besvären och få dig tillbaka till idrott, arbetsliv eller rörelse i vardagen – tryggt och steg för steg.",
    image: leftImageUrl,
  },
  {
    title: "Skräddarsydda hälkoppsinlägg",
    description:
      "Personligt utformade hälkoppsinlägg som ger stöd och avlastning vid hälsmärta, hälsporre och Severs skada. Vi undersöker, formar och anpassar inlägget efter dig – för både vuxna och barn.",
    image: heelCupImageUrl,
  },
  {
    title: "Snabbare och starkare prestation",
    description:
      "Vill du bli snabbare och starkare? Vi hjälper dig hitta vad som håller dig tillbaka och bygger ett träningsupplägg som tar dig vidare – mer kraft, mer snabbhet och hållbar prestation.",
    image: agilityImageUrl,
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xl sm:text-3xl md:text-5xl font-bold mb-6 tracking-tight text-balance">
            Trygg återgång och starkare prestation
          </h2>
          <p className="text-lg text-muted-foreground">
            Caselo Idrottsmedicin erbjuder professionell idrottsfysioterapi för satsande idrottare.<br />
            Oavsett sport – vi hjälper dig nå dina mål.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {services.map((service, index) => {
            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-[var(--shadow-card)] transition-[var(--transition-smooth)] border-border/50 bg-card/50 backdrop-blur-sm group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        
      </div>
    </section>
  );
};

export default Services;
