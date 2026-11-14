import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { useVisitor } from "@/context/VisitorContext";
import {
  isExternalBookingUrl,
  withBookingCategory,
  withBookingService,
} from "@/lib/booking";
import { trackBokaTid } from "@/lib/analytics";

type BookingLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  children: ReactNode;
  /** Preselects a service on `/boka` via `?tjanst=`. Ignored for external booking URLs. */
  serviceId?: string;
  /** Opens a column on `/boka` via `?kategori=` without preselecting a service. Ignored for external booking URLs. */
  categoryId?: string;
};

/**
 * Renders a booking CTA that follows the current visitor type.
 * Uses React Router for internal paths and <a> for external URLs.
 */
const BookingLink = ({
  children,
  onClick,
  serviceId,
  categoryId,
  ...props
}: BookingLinkProps) => {
  const { bookingUrl, visitorType } = useVisitor();
  const href = withBookingCategory(
    withBookingService(bookingUrl, serviceId),
    categoryId,
  );

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackBokaTid(visitorType);
    onClick?.(event);
  };

  if (isExternalBookingUrl(href)) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default BookingLink;
