import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import IfkStocksundBanner from "@/components/IfkStocksundBanner";
import { useVisitor } from "@/context/VisitorContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { to: "/tjanster", label: "Tjänster", match: "prefix" as const },
  { to: "/om", label: "Om", match: "exact" as const },
  { to: "/kontakt", label: "Kontakt", match: "exact" as const },
];

const isActive = (pathname: string, to: string, match: "prefix" | "exact") =>
  match === "prefix" ? pathname.startsWith(to) : pathname === to;

const SiteHeader = () => {
  const location = useLocation();
  const { isIfkStocksund } = useVisitor();

  const desktopLinkClass = (active: boolean) =>
    [
      "inline-flex min-h-10 items-center text-sm font-medium transition-colors hover:text-primary sm:min-h-0 sm:text-base md:text-lg",
      active ? "text-primary" : "text-foreground/80",
    ].join(" ");

  const mobileLinkClass = (active: boolean) =>
    [
      "flex min-h-12 items-center px-4 text-base font-medium transition-colors hover:text-primary",
      active ? "text-primary" : "text-foreground",
    ].join(" ");

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-2.5 sm:py-3 md:flex md:min-h-28 md:items-center md:gap-4 md:py-2 lg:gap-6">
        <div className="flex items-center justify-between gap-3 md:contents">
          <Link
            to="/"
            className="flex w-fit shrink-0 items-center"
            aria-label="Caselo Idrottsmedicin – startsida"
          >
            <img
              src="/caselo-logo-blue.png"
              alt="Caselo Idrottsmedicin"
              className="h-14 w-auto object-contain md:h-20"
            />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
                aria-label="Öppna meny"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-52 p-1.5"
            >
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem key={link.to} asChild>
                  <Link
                    to={link.to}
                    className={mobileLinkClass(
                      isActive(location.pathname, link.to, link.match),
                    )}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isIfkStocksund ? (
          <>
            <div className="mt-2 w-full min-w-0 md:mt-0 md:w-fit md:max-w-full md:px-1 lg:px-2">
              <IfkStocksundBanner />
            </div>
            <div className="hidden flex-1 md:block" aria-hidden="true" />
          </>
        ) : (
          <div className="hidden flex-1 md:block" aria-hidden="true" />
        )}

        <nav
          className="hidden shrink-0 items-center gap-x-6 md:flex lg:gap-x-8"
          aria-label="Huvudmeny"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={desktopLinkClass(
                isActive(location.pathname, link.to, link.match),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
