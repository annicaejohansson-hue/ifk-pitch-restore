import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";

const Boka = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <Helmet>
        <title>Kontakt – Caselo Idrottsmedicin</title>
        <meta
          name="description"
          content="Idrottsfysioterapi i Stockholm och Mariefred: skadebehandling, skadeförebyggande och prestationsoptimering. Kontakta Caselo Idrottsmedicin via e-post."
        />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/10 to-background py-10 md:py-16">
        <div className="container px-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Kontakt – Caselo Idrottsmedicin</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Vi erbjuder idrottsfysioterapi med fokus på skadebehandling, skadeförebyggande och prestationsoptimering. Hör gärna av dig via e-post så berättar vi mer.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container px-4">
          <Card className="p-6 md:p-8 max-w-3xl">
            <div className="flex items-start gap-3">
              <a
                href="mailto:henkenilsson@live.se"
                aria-label="Skicka e-post"
                className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Mail className="h-5 w-5" />
              </a>
              <div>
                <p className="font-semibold">E-post</p>
                <p className="text-sm text-muted-foreground">Klicka på ikonen för att skicka e‑post.</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Vi samarbetar med IFK Mariefred inom idrottsfysioterapi. Välkommen att höra av dig.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Boka;

