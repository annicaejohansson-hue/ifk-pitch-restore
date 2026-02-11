import { Card } from "@/components/ui/card";
import henrikFoto from "@/assets/Henrik Foto.jpeg";

const Therapists = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30 border-t-4 border-primary">
      <div className="container px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">Kompetens och erfarenhet</h2>
        <Card className="max-w-5xl mx-auto p-6 md:p-10 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="grid sm:grid-cols-2 gap-6 md:gap-10 items-start">
            <div className="rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
              <img
                src={henrikFoto}
                alt="Henrik Nilsson"
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="self-start min-w-0">
              <h3 className="text-xl md:text-2xl font-semibold mb-3">Henrik Nilsson</h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Henrik Nilsson har tio års erfarenhet som fysioterapeut med specialisering inom idrottsskador. Han är
                fotbollstränare med UEFA A-utbildning samt före detta elitfotbollsspelare.
              </p>
              <div className="mt-5 p-4 md:p-5 rounded-lg border border-border/60 bg-muted/30">
                <p className="italic text-sm md:text-base text-foreground">
                  “Jag hade en vristvrickning och ville få hjälp tillbaka till träningen. Jag träffade Henrik som var extremt professionell, tålmodig och tog sig tid att förklara allt. Riktigt bra erfarenhet - han undersökte min fot noggrant, var engagerad och intresserad. Jag skulle definitivt återvända.”
                </p>
              </div>
              <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
                Henrik har de senaste fem åren arbetat på OrtoMed i Stockholm med särskilt fokus på fotskador och har
                därigenom haft samarbeten med fotbollsklubbar i bl.a. Stockholm, Linköping och Göteborg. Tidigare har
                han varit fysioterapeut vid Motions- och idrottsskadeenheten i Norrköping, en specialistklinik för
                idrottare, där han var delaktig i diagnostiseringen och rehaben av bl.a. akuta korsbandsskador. Dessförinnan
                arbetade han i öppenvården på Rehab Öst.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Therapists;

