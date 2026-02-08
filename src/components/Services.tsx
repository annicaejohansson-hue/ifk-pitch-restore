import { Card } from "@/components/ui/card";
import { Activity, Shield, TrendingUp } from "lucide-react";
import comebackImage from "@/assets/comeback-training.jpg";
import preventionImage from "@/assets/prevention-training.jpg";
import teenTraining from "@/assets/teen-training.svg";

const services = [
  { 
    icon: Activity, 
    title: "Från skada tillbaka till spel", 
    description: "Från första undersökning till återgång på plan – evidensbaserad behandling och individuell rehab. Vi erbjuder även tillverkning av individuella hälkoppar som är effektiva vid smärta i hälen.",
    image: comebackImage
  },
  { 
    icon: Shield, 
    title: "Skadeförebyggande träning", 
    description: "Förebygg skador innan de uppstår. Vi hjälper dig identifiera riskfaktorer, bygga motståndskraft och utveckla tekniker som gör dig mer robust. Träningen sker på fotbollsplan och i gym – smartare träning för längre karriärer.",
    image: preventionImage
  },
  { 
    icon: TrendingUp, 
    title: "Optimera din prestation", 
    description: "Ta ditt idrottande till nästa nivå. Genom rörelsescreening, styrketester och prestandaanalys hittar vi dina utvecklingsområden.",
    image: teenTraining
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 whitespace-nowrap tracking-tight">
            Trygg återgång och starkare prestation
          </h2>
          <p className="text-lg text-muted-foreground">
            Caselo Idrottsmedicin erbjuder professionell idrottsfysioterapi för satsande idrottare.<br />
            Oavsett sport – vi hjälper dig nå dina mål.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
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
                  <div className="absolute bottom-4 left-4">
                    <div className="p-3 rounded-lg bg-primary/90 text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
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
