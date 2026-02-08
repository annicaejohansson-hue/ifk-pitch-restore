import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-football.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/50 to-primary/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Tillbaka till spelet – starkare än någonsin
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Idrottsfysioterapi i
            <br className="sm:hidden" /> Stockholm och Mariefred
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Button 
              asChild
              size="lg" 
              variant="secondary"
              className="text-xs tracking-tight px-3 py-2 sm:text-lg sm:px-8 sm:py-6 shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-hover)] transition-[var(--transition-smooth)] w-auto"
            >
              <a href="#bokning" aria-label="Gå till bokningssektionen">
                <Calendar className="mr-2 h-3 w-3 sm:h-5 sm:w-5" />
                Boka tid
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
