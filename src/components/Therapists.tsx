import { Card } from "@/components/ui/card";
import henrikFoto from "@/assets/IMG_9111.jpg";

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
            rehabilitering och en hållbar väg tillbaka till träning och tävling.
          </p>
        </div>
        <Card className="mx-auto max-w-5xl border-border/50 bg-card/80 p-5 backdrop-blur-sm sm:p-6 md:p-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row md:gap-6">
            <figure className="mx-auto w-full max-w-[200px] shrink-0 sm:mx-0 sm:max-w-[220px] md:max-w-[260px]">
              <div className="overflow-hidden rounded-xl shadow-[var(--shadow-card)]">
                <img
                  src={henrikFoto}
                  alt="Henrik Nilsson, leg. fysioterapeut"
                  className="h-auto w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-2 text-center text-sm text-muted-foreground sm:text-left">
                Henrik Nilsson, leg. fysioterapeut
              </figcaption>
            </figure>
            <div className="min-w-0 flex-1">
              <h3 className="mb-3 text-lg font-semibold text-foreground sm:text-xl">
                Därför Caselo Idrottsmedicin:
              </h3>
              <ul className="list-disc space-y-3 pl-5 text-base leading-relaxed text-muted-foreground md:space-y-4 md:text-lg">
                <li>
                  <strong className="font-semibold text-foreground">En behandlare som förstår idrottens krav</strong>{" "}
                  – Caselo drivs av Henrik Nilsson, fysioterapeut med tio års erfarenhet av idrottsskador, UEFA
                  A-utbildad fotbollstränare och före detta elitspelare.
                </li>
                <li>
                  <strong className="font-semibold text-foreground">
                    Specialistkompetens kring idrottsskador
                  </strong>{" "}
                  – Henrik har de senaste fem åren arbetat på OrtoMed i Stockholm, tidigare vid Motions- och
                  idrottsskadeenheten i Norrköping och dessförinnan i öppenvården på Rehab Öst.
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Vård i din träningsmiljö</strong> –
                  Mottagningen ligger i direkt anslutning till fotbollsplan och löparbana.
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Therapists;

