import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SiteHeader = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-bold text-xl md:text-2xl tracking-tight">
          Caselo Idrottsmedicin
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild size="sm" className="ml-2" aria-label="Gå till bokningssektionen">
            <a href="/#bokning">
              Boka tid
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;


