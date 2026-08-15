import { Link } from "react-router-dom";
import { useVisitor } from "@/context/VisitorContext";

const IFK_LOGO_SRC =
  "https://irp.cdn-website.com/e6471f24/dms3rep/multi/g10.png";

/** Compact partner notice for the site header (IFK Stocksund visitors). */
const IfkStocksundBanner = () => {
  const { setVisitorType } = useVisitor();

  return (
    <div className="relative flex w-full max-w-full min-w-0 items-center gap-1.5 rounded-md border border-primary/10 bg-primary/[0.04] py-1 pl-2 pr-2 sm:w-fit sm:gap-3 sm:py-2 sm:pl-3 sm:pr-4">
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-secondary sm:w-1"
        aria-hidden="true"
      />
      <img
        src={IFK_LOGO_SRC}
        alt="IFK Stocksund"
        className="h-6 w-auto shrink-0 object-contain sm:h-10 md:h-11"
        width={350}
        height={438}
        loading="eager"
        decoding="async"
      />
      <div className="min-w-0 flex-1 [container-type:inline-size]">
        <p className="whitespace-nowrap text-[length:clamp(5.5px,2.38cqw,0.875rem)] font-semibold leading-none tracking-tight text-primary">
          Som spelare i IFK Stocksund har du rabatterade priser hos Caselo
          Idrottsmedicin.
        </p>
        <p className="mt-px text-[length:clamp(5.5px,2.38cqw,0.875rem)] font-normal leading-none text-muted-foreground/70 break-words sm:mt-0.5 sm:text-[11px] sm:leading-snug">
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
