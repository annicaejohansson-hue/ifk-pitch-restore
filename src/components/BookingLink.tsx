import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useBookingUrl } from "@/context/VisitorContext";
import { isExternalBookingUrl } from "@/lib/booking";

type BookingLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  children: ReactNode;
};

/**
 * Renders a booking CTA that follows the current visitor type.
 * Uses React Router for internal paths and <a> for external URLs.
 */
const BookingLink = ({ children, ...props }: BookingLinkProps) => {
  const bookingUrl = useBookingUrl();

  if (isExternalBookingUrl(bookingUrl)) {
    return (
      <a href={bookingUrl} rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={bookingUrl} {...props}>
      {children}
    </Link>
  );
};

export default BookingLink;
