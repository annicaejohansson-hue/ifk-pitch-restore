import { Link, useLocation } from "react-router-dom";
import { Calendar, Menu } from "lucide-react";
import BookingLink from "@/components/BookingLink";
import IfkStocksundBanner from "@/components/IfkStocksundBanner";
import { Button } from "@/components/ui/button";
import { useVisitor } from "@/context/VisitorContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const NAV_LINKS = [
  { to: "/tjanster", label: "Tjänster", match: "prefix" as const },
  { to: "/forening", label: "För fotbollsföreningar", match: "prefix" as const },
  { to: "/om", label: "Om", match: "exact" as const },
  { to: "/kontakt", label: "Kontakt", match: "exact" as const },
];

const isActive = (pathname: string, to: string, match: "prefix" | "exact") =>
  match === "prefix" ? pathname.startsWith(to) : pathname === to;

const SiteHeader = () => {
  const location = useLocation();
  const { isPartner } = useVisitor();

  const desktopLinkClass = (active: boolean) =>
    [
      "inline-flex min-h-10 shrink-0 items-center whitespace-nowrap font-light transition-colors hover:text-primary sm:min-h-0",
      isPartner
        ? "text-sm tracking-wide lg:text-[15px]"
        : "text-sm tracking-wider md:text-sm lg:text-[15px]",
      active ? "text-primary" : "text-foreground/80",
    ].join(" ");

  const mobileLinkClass = (active: boolean) =>
    [
      "flex min-h-12 items-center px-4 text-base font-light tracking-wider transition-colors hover:text-primary",
      active ? "text-primary" : "text-foreground",
    ].join(" ");

  const showHeaderBooking = location.pathname !== "/boka";

  const bookingButton = (
    <Button
      asChild={showHeaderBooking}
      size="sm"
      variant="secondary"
      tabIndex={showHeaderBooking ? undefined : -1}
      aria-hidden={showHeaderBooking ? undefined : true}
      className={[
        "min-h-11 shrink-0 px-4 text-sm shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)]",
        showHeaderBooking ? "" : "invisible pointer-events-none",
      ].join(" ")}
    >
      {showHeaderBooking ? (
        <BookingLink aria-label="Gå till bokningssidan">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Boka tid
        </BookingLink>
      ) : (
        <>
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Boka tid
        </>
      )}
    </Button>
  );

  return (
    <header className="no-print overflow-x-hidden border-b-2 border-primary bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={[
          "container min-w-0 px-8 md:px-4 py-2.5 sm:py-3 md:flex md:min-h-28 md:items-center md:py-2",
          isPartner
            ? "md:flex-wrap md:gap-2 lg:flex-nowrap lg:gap-5"
            : "md:gap-4 lg:gap-6",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3 md:contents">
          <Link
            to="/"
            className="flex w-fit shrink-0 items-center"
            aria-label="Caselo Idrottsmedicin – startsida"
          >
            <img
              src="/caselo-logo-blue.png"
              alt="Caselo Idrottsmedicin"
              width={1024}
              height={409}
              className="h-14 w-auto max-w-[11.5rem] object-contain md:h-20 md:max-w-[16rem]"
            />
          </Link>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-border/80 text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Öppna meny"
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-56 p-1.5"
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
        </div>

        {isPartner ? (
          <>
            <div className="hidden flex-1 md:block lg:hidden" aria-hidden="true" />
            <div className="mt-2 w-full min-w-0 md:order-last md:mt-2 lg:order-none lg:mt-0 lg:w-auto lg:shrink-0 lg:pl-3 xl:pl-5">
              <IfkStocksundBanner />
            </div>
          </>
        ) : (
          <div className="hidden flex-1 md:block" aria-hidden="true" />
        )}

        <nav
          className={[
            "hidden items-center md:flex",
            isPartner
              ? "min-w-0 shrink-0 gap-x-4 lg:min-w-0 lg:flex-1 lg:justify-between lg:gap-x-4 lg:pl-6 xl:pl-8"
              : "shrink-0 gap-x-4 lg:gap-x-8 xl:gap-x-10",
          ].join(" ")}
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
          {isPartner ? bookingButton : null}
        </nav>

        {!isPartner ? (
          <div className="hidden shrink-0 md:ml-4 md:block lg:ml-6 xl:ml-8">
            {bookingButton}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default SiteHeader;
