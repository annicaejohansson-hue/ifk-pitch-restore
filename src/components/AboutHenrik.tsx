import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import henrikImage from "@/assets/henrik-nilsson.jpg";
import rehabImage from "@/assets/rehab-training.jpg";

const certifications = [
  "Ortopedisk medicin",
  "MDT McKenzie",
  "Idrottsfysioterapi",
  "Rehabilitering av senskador och överbelastningsproblem",
  "Utprovning av inlägg, skydd och ortoser"
];

const AboutHenrik = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Möt våra fysioterapeuter
          </h2>
          <p className="text-lg text-muted-foreground">
            Våra legitimerade fysioterapeuter har specialistkompetens inom idrottsmedicin och lång erfarenhet av att arbeta med unga idrottare.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
              <img
                src={henrikImage}
                alt="Henrik Nilsson - Fysioterapeut"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hidden lg:block">
              <img
                src={rehabImage}
                alt="Rehabilitering"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-2xl font-bold mb-4">Henrik Nilsson</h3>
              <p className="text-lg leading-relaxed mb-6">
                Legitimerad fysioterapeut med specialisering inom idrottsmedicin och lång erfarenhet av att arbeta med idrottare på både junior- och elitnivå. Henrik kombinerar klinisk expertis med ett genuint engagemang för att hjälpa varje idrottare förstå sin kropp och ta ansvar för sin utveckling.
              </p>
              
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/10 mb-6">
                <p className="text-base italic text-muted-foreground">
                  "Det bästa med mitt jobb är att se idrottare komma tillbaka – starkare, mer självmedvetna och redo att prestera."
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Vidareutbildningar:</h4>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-base">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHenrik;
