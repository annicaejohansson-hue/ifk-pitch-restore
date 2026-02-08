import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Kontakt
          </h2>
          <p className="text-lg text-muted-foreground">
            Hör gärna av dig via e-post så berättar vi mer om hur vi kan hjälpa dig.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="p-8 shadow-[var(--shadow-card)] bg-card/80 backdrop-blur-sm border-border/50">
            <h3 className="text-2xl font-semibold mb-6">Kontaktinformation</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <a
                  href="mailto:henkenilsson@live.se"
                  aria-label="Skicka e-post"
                  className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <div>
                  <p className="font-semibold mb-1">E-post</p>
                  <p className="text-sm text-muted-foreground">Klicka på ikonen för att skicka e‑post.</p>
                </div>
              </div>

            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Vi återkommer via e-post så snart som möjligt.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
