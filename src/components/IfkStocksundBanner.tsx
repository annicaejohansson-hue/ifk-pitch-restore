import { Link } from "react-router-dom";
import { useVisitor } from "@/context/VisitorContext";

/** Compact partner notice for the site header. */
const IfkStocksundBanner = () => {
  const { partner, setVisitorType } = useVisitor();

  if (!partner) return null;

  return (
    <div className="relative flex w-full max-w-full min-w-0 items-center gap-2 rounded-md border border-primary/10 bg-primary/[0.04] py-1.5 pl-2.5 pr-2.5 sm:inline-flex sm:w-fit sm:gap-3 sm:py-2 sm:pl-3 sm:pr-4 md:shrink-0">
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-secondary sm:w-1"
        aria-hidden="true"
      />
      <img
        src={partner.logoSrc}
        alt={partner.logoAlt}
        className="h-7 w-auto max-w-9 shrink-0 object-contain sm:h-10 sm:max-w-11 md:h-11 md:max-w-12"
        width={partner.logoWidth}
        height={partner.logoHeight}
        loading="eager"
        decoding="async"
      />
      <div className="min-w-0 flex-1 sm:flex-none sm:shrink-0">
        <p className="text-pretty text-xs font-semibold leading-snug tracking-tight text-primary sm:text-[13px] md:whitespace-nowrap lg:text-sm">
          Som medlem i {partner.name} har du rabatterade priser.
        </p>
        <p className="mt-0.5 text-pretty text-xs font-normal leading-snug text-muted-foreground/70 sm:text-[11px] md:whitespace-nowrap">
          Är du inte medlem i {partner.name}?{" "}
          <Link
            to="/"
            onClick={() => setVisitorType("general")}
            className="relative underline underline-offset-2 decoration-muted-foreground/40 hover:text-muted-foreground hover:decoration-muted-foreground/70 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] md:after:hidden"
          >
            Följ denna länk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default IfkStocksundBanner;
