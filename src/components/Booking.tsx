import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Booking = () => {
  return (
    <section id="bokning" className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 border-t-4 border-primary">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Bokning
            </h2>
          </div>

          <Card className="p-8 md:p-12 shadow-[var(--shadow-card)] bg-card/80 backdrop-blur-sm border-border/50 text-center">
            <p className="text-lg md:text-xl">
              Välkommen att boka igen i <span className="font-semibold">augusti 2026</span>.{" "}<br className="hidden md:block" />
              Bokningen är på <span className="font-semibold">tillfällig paus</span> med anledning av föräldraledighet.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Vill du komma i kontakt innan dess?
            </p>
            <div className="mt-3 flex justify-center">
              <Button asChild aria-label="Skicka e-post till oss">
                <a href="mailto:henkenilsson@live.se">Maila oss</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Booking;
