import { Link } from "react-router-dom";
import { useVisitor } from "@/context/VisitorContext";

const IFK_LOGO_SRC =
  "https://irp.cdn-website.com/e6471f24/dms3rep/multi/g10.png";

/** Compact partner notice for the site header (IFK Stocksund visitors). */
const IfkStocksundBanner = () => {
  const { setVisitorType } = useVisitor();

  return (
    <div className="relative inline-flex w-fit max-w-full items-center gap-2.5 rounded-md border border-primary/10 bg-primary/[0.04] py-1.5 pl-2.5 pr-3 sm:gap-3 sm:py-2 sm:pl-3 sm:pr-4">
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-secondary sm:w-1"
        aria-hidden="true"
      />
      <img
        src={IFK_LOGO_SRC}
        alt="IFK Stocksund"
        className="h-9 w-auto shrink-0 object-contain sm:h-10 md:h-11"
        width={350}
        height={438}
        loading="eager"
        decoding="async"
      />
      <div className="min-w-0">
        <p className="whitespace-nowrap text-[13px] font-semibold leading-snug tracking-tight text-primary md:text-sm">
          Som spelare i IFK Stocksund har du rabatterade priser hos Caselo
          Idrottsmedicin.
        </p>
        <p className="mt-1 whitespace-nowrap text-[10px] leading-snug text-muted-foreground/70 sm:text-[11px]">
          Är du inte spelare i IFK Stocksund?{" "}
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
