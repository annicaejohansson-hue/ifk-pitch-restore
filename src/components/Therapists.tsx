import { Card } from "@/components/ui/card";
import henrikFoto from "@/assets/Henrik Foto.jpeg";

const Therapists = () => {
  return (
    <section className="border-t-4 border-primary bg-gradient-to-b from-background to-muted/30 py-12 md:py-20">
      <div className="container px-4">
        <div className="mx-auto mb-8 max-w-5xl">
          <h2 className="mb-4 text-left text-balance text-3xl font-bold sm:text-4xl md:text-5xl">
            Om Caselo Idrottsmedicin
          </h2>
          <p className="max-w-3xl text-left text-base text-muted-foreground sm:text-lg">
            Caselo Idrottsmedicin erbjuder specialistvård inom idrottsskador – med trygg bedömning, tydlig
            rehabilitering och en hållbar väg tillbaka till träning och tävling. Caselo Idrottsmedicin
            erbjuder sina tjänster i direkt anslutning till fotbollsplan och löparbana.
          </p>
        </div>
        <Card className="mx-auto max-w-5xl border-border/50 bg-card/80 p-5 backdrop-blur-sm sm:p-6 md:p-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row md:gap-6">
            <div className="mx-auto w-full max-w-[200px] shrink-0 overflow-hidden rounded-xl shadow-[var(--shadow-card)] sm:mx-0 sm:max-w-[220px] md:max-w-[260px]">
              <img
                src={henrikFoto}
                alt="Henrik Nilsson"
                className="h-auto w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Caselo Idrottsmedicin drivs av Henrik Nilsson som har tio års erfarenhet som fysioterapeut med
                specialisering inom idrottsskador. Han är fotbollstränare med UEFA A-utbildning samt före detta
                fotbollsspelare på elitnivå.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 md:text-lg">
                Henrik har de senaste fem åren arbetat på OrtoMed i Stockholm med särskilt fokus på fotskador. Tidigare
                har han varit fysioterapeut vid Motions- och idrottsskadeenheten i Norrköping, en specialistklinik för
                idrottare. Dessförinnan arbetade han i öppenvården på Rehab Öst.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Therapists;

