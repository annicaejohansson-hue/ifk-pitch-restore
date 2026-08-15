import { Link } from "react-router-dom";
import { useVisitor } from "@/context/VisitorContext";

const IFK_LOGO_SRC =
  "https://irp.cdn-website.com/e6471f24/dms3rep/multi/g10.png";

/** Compact partner notice for the site header (IFK Stocksund visitors). */
const IfkStocksundBanner = () => {
  const { setVisitorType } = useVisitor();

  return (
    <div className="relative flex w-full max-w-full min-w-0 items-start gap-2 rounded-md border border-primary/10 bg-primary/[0.04] py-1.5 pl-2.5 pr-2.5 sm:w-fit sm:items-center sm:gap-3 sm:py-2 sm:pl-3 sm:pr-4">
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-secondary sm:w-1"
        aria-hidden="true"
      />
      <img
        src={IFK_LOGO_SRC}
        alt="IFK Stocksund"
        className="mt-0.5 h-7 w-auto shrink-0 object-contain sm:mt-0 sm:h-10 md:h-11"
        width={350}
        height={438}
        loading="eager"
        decoding="async"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold leading-snug tracking-tight text-primary break-words sm:text-[13px] md:whitespace-nowrap md:text-sm">
          Som spelare i IFK Stocksund har du rabatterade priser hos Caselo
          Idrottsmedicin.
        </p>
        <p className="mt-1 text-[10px] leading-snug text-muted-foreground/70 break-words sm:text-[11px] md:whitespace-nowrap">
          Är du inte spelare i IFK Stocksund?{" "}
          <Link
            to="/"
            onClick={() => setVisitorType("general")}
            className="inline-flex min-h-8 items-center underline underline-offset-2 decoration-muted-foreground/40 hover:text-muted-foreground hover:decoration-muted-foreground/70 sm:min-h-0"
          >
            Till startsidan
          </Link>
        </p>
      </div>
    </div>
  );
};

export default IfkStocksundBanner;
