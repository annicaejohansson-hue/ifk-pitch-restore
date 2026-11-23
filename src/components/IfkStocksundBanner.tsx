import { Link } from "react-router-dom";
import { useVisitor } from "@/context/VisitorContext";

/** Compact partner notice for the site header. */
const IfkStocksundBanner = () => {
  const { partner, setVisitorType } = useVisitor();

  if (!partner) return null;

  return (
    <div className="relative flex w-full max-w-full min-w-0 items-center gap-1.5 rounded-md border border-primary/10 bg-primary/[0.04] py-1 pl-2 pr-2 sm:gap-3 sm:py-2 sm:pl-3 sm:pr-4">
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-secondary sm:w-1"
        aria-hidden="true"
      />
      <img
        src={partner.logoSrc}
        alt={partner.logoAlt}
        className="h-6 w-auto max-w-8 shrink-0 object-contain sm:h-10 sm:max-w-11 md:h-11 md:max-w-12"
        width={partner.logoWidth}
        height={partner.logoHeight}
        loading="eager"
        decoding="async"
      />
      <div className="min-w-0 flex-1 overflow-hidden [container-type:inline-size]">
        <p className="text-xs font-semibold leading-snug tracking-tight text-primary sm:text-[13px] lg:text-sm">
          Som spelare i {partner.name} har du rabatterade{" "}
          <span className="md:block">
            priser hos Caselo Idrottsmedicin.
          </span>
        </p>
        <p className="mt-0.5 text-xs font-normal leading-snug text-muted-foreground/70 sm:text-[11px]">
          Är du inte spelare i {partner.name}?{" "}
          <Link
            to="/"
            onClick={() => setVisitorType("general")}
            className="underline underline-offset-2 decoration-muted-foreground/40 hover:text-muted-foreground hover:decoration-muted-foreground/70"
          >
            Till startsidan
          </Link>
        </p>
      </div>
    </div>
  );
};

export default IfkStocksundBanner;
