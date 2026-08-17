import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { useVisitor } from "@/context/VisitorContext";
import { isExternalBookingUrl } from "@/lib/booking";
import { trackBokaTid } from "@/lib/analytics";

type BookingLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  children: ReactNode;
};

/**
 * Renders a booking CTA that follows the current visitor type.
 * Uses React Router for internal paths and <a> for external URLs.
 */
const BookingLink = ({ children, onClick, ...props }: BookingLinkProps) => {
  const { bookingUrl, visitorType } = useVisitor();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackBokaTid(visitorType);
    onClick?.(event);
  };

  if (isExternalBookingUrl(bookingUrl)) {
    return (
      <a
        href={bookingUrl}
        rel="noopener noreferrer"
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={bookingUrl} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default BookingLink;
