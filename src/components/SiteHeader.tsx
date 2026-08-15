import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookingLink from "@/components/BookingLink";
import IfkStocksundBanner from "@/components/IfkStocksundBanner";
import { useVisitor } from "@/context/VisitorContext";
import { GENERAL_BOOKING_URL, isExternalBookingUrl } from "@/lib/booking";

const SiteHeader = () => {
  const location = useLocation();
  const { isIfkStocksund } = useVisitor();
  const bookingPath = isExternalBookingUrl(GENERAL_BOOKING_URL)
    ? null
    : GENERAL_BOOKING_URL.split("?")[0];
  const showBookCta = bookingPath ? location.pathname !== bookingPath : true;

  const linkClass = (active: boolean) =>
    [
      "inline-flex min-h-10 items-center whitespace-nowrap text-sm font-medium transition-colors hover:text-primary sm:min-h-0 sm:text-base md:text-lg",
      active ? "text-primary" : "text-foreground/80",
    ].join(" ");

  const bookButton = showBookCta ? (
    <Button
      asChild
      className="h-9 shrink-0 px-3.5 text-sm sm:h-10 sm:px-5 sm:text-base md:h-11 md:px-6 md:text-lg"
      aria-label="Gå till bokningssidan"
    >
      <BookingLink>Boka tid</BookingLink>
    </Button>
  ) : null;

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-2.5 sm:py-3 md:flex md:min-h-28 md:items-center md:gap-4 md:py-2 lg:gap-6">
        {/* Mobile: logo + optional CTA on one row */}
        <div className="flex items-center justify-between gap-3 md:contents">
          <Link
            to="/"
            className="flex w-fit shrink-0 items-center"
            aria-label="Caselo Idrottsmedicin – startsida"
          >
            <img
              src="/caselo-logo-blue.png"
              alt="Caselo Idrottsmedicin"
              className="h-11 w-auto object-contain sm:h-14 md:h-20"
            />
          </Link>
          <div className="md:hidden">{bookButton}</div>
        </div>

        {isIfkStocksund ? (
          <>
            <div className="mt-2 w-fit max-w-full md:mt-0 md:px-1 lg:px-2">
              <IfkStocksundBanner />
            </div>
            <div className="hidden flex-1 md:block" aria-hidden="true" />
          </>
        ) : (
          <div className="hidden flex-1 md:block" aria-hidden="true" />
        )}

        {/* Mobile: text links under logo; desktop: full nav with CTA */}
        <nav className="mt-1 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 md:mt-0 md:gap-x-6 lg:gap-x-8">
          <Link
            to="/tjanster"
            className={linkClass(location.pathname.startsWith("/tjanster"))}
          >
            Tjänster
          </Link>
          <Link to="/om" className={linkClass(location.pathname === "/om")}>
            Om
          </Link>
          <Link
            to="/kontakt"
            className={linkClass(location.pathname === "/kontakt")}
          >
            Kontakt
          </Link>
          <div className="hidden md:block">{bookButton}</div>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
