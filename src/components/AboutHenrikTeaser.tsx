import { Card } from "@/components/ui/card";

const AboutHenrikTeaser = () => {
  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 md:p-10 bg-card/80 backdrop-blur-sm border-border/50 shadow-[var(--shadow-card)]">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Henrik Nilsson</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Henrik har tio års erfarenhet som fysioterapeut med specialisering inom idrottsskador. Han är fotbollstränare med UEFA A-utbildning samt före detta elitfotbollsspelare.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutHenrikTeaser;

