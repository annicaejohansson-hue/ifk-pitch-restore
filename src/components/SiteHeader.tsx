import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookingLink from "@/components/BookingLink";
import { GENERAL_BOOKING_URL, isExternalBookingUrl } from "@/lib/booking";

const SiteHeader = () => {
  const location = useLocation();
  const bookingPath = isExternalBookingUrl(GENERAL_BOOKING_URL)
    ? null
    : GENERAL_BOOKING_URL.split("?")[0];
  const showBookCta = bookingPath ? location.pathname !== bookingPath : true;

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center justify-between px-4 md:h-28">
        <Link to="/" className="flex items-center" aria-label="Caselo Idrottsmedicin – startsida">
          <img
            src="/caselo-logo-blue.png"
            alt="Caselo Idrottsmedicin"
            className="h-16 w-auto md:h-20"
          />
        </Link>

        {showBookCta ? (
          <nav className="flex items-center gap-2">
            <Button asChild size="sm" className="ml-2" aria-label="Gå till bokningssidan">
              <BookingLink>Boka tid</BookingLink>
            </Button>
          </nav>
        ) : null}
      </div>
    </header>
  );
};

export default SiteHeader;
