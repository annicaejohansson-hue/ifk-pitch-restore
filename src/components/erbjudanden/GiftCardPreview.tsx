import { cn } from "@/lib/utils";
import type { GiftLayoutId } from "@/data/erbjudanden";
import logoNavy from "@/assets/caselo-logo-navy.png";
import logoWhite from "@/assets/caselo-logo-white.png";

type GiftCardPreviewProps = {
  layout: GiftLayoutId;
  size?: "tile" | "large";
  productName?: string;
  inscription?: string;
  className?: string;
};

const COPY: Record<
  GiftLayoutId,
  { kicker: string; title: string; showProduct: boolean }
> = {
  neutral: {
    kicker: "Presentkort",
    title: "Grattis på födelsedagen",
    showProduct: false,
  },
  "julklapp-gron": { kicker: "Presentkort", title: "God jul", showProduct: true },
  "julklapp-rod": { kicker: "Presentkort", title: "God jul", showProduct: true },
  fodelsedag: {
    kicker: "Presentkort",
    title: "Grattis på födelsedagen",
    showProduct: true,
  },
};

const GoldTree = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 32"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12 1.5 20 11h-4.2L21.5 19H15l-3 11-3-11H2.5l5.7-8H4.2L12 1.5Z" />
  </svg>
);

const GoldSparkle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12 1.6 13.15 9.4 21 12 13.15 14.6 12 22.4 10.85 14.6 3 12 10.85 9.4 12 1.6Z" />
    <path
      d="M18.4 4.2 18.85 6.7 21.4 7.2 18.85 7.7 18.4 10.2 17.95 7.7 15.4 7.2 17.95 6.7 18.4 4.2Z"
      opacity="0.7"
    />
  </svg>
);

const TREE_LAYOUTS: GiftLayoutId[] = ["julklapp-gron", "julklapp-rod"];

const GiftCardPreview = ({
  layout,
  size = "tile",
  productName = "Snabbhetspaket",
  inscription,
  className,
}: GiftCardPreviewProps) => {
  const large = size === "large";
  const copy = COPY[layout];
  const customInscription = inscription?.trim() ?? "";
  const titleText = customInscription || copy.title || productName;
  const showProduct = copy.showProduct && !customInscription;
  const isChristmas = TREE_LAYOUTS.includes(layout);
  const isBirthday = layout === "fodelsedag";
  const isLight = layout === "fodelsedag";

  const kicker = large
    ? "text-[0.65rem] font-medium uppercase tracking-[0.22em] sm:text-xs"
    : "text-[0.55rem] font-medium uppercase tracking-[0.16em] sm:text-[0.6rem]";
  const title = large
    ? "font-serif text-xl leading-snug tracking-tight sm:text-2xl md:text-3xl"
    : "font-serif text-base leading-snug tracking-tight sm:text-lg";
  const body = large
    ? "text-sm leading-relaxed sm:text-base"
    : "text-[0.65rem] leading-relaxed sm:text-xs";

  const shell = cn(
    "relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl text-left shadow-[0_10px_30px_-12px_rgba(14,22,39,0.45)]",
    large ? "min-h-[18rem] p-6 sm:p-8" : "min-h-[13.75rem] p-3 sm:p-4",
    layout === "neutral" && "bg-[#0e1627] text-[#f5f2ea]",
    layout === "julklapp-gron" && "bg-[#1c2621] text-[#f3ead7]",
    layout === "julklapp-rod" && "bg-[#3a1c24] text-[#f6ead8]",
    layout === "fodelsedag" && "bg-[#ebe0cc] text-[#1b2430]",
    className,
  );

  const kickerColor = isLight ? "text-[#8a7040]" : "text-[#c6b07a]";
  const ruleColor = isLight ? "bg-[#c6b07a]" : "bg-[#c6b07a]";
  const productColor = isLight
    ? "text-[#4a5160]"
    : layout === "julklapp-gron"
      ? "text-[#f3ead7]/80"
      : layout === "julklapp-rod"
        ? "text-[#f6ead8]/75"
        : "text-[#f5f2ea]/80";
  const iconColor = isLight ? "text-[#8a7040]" : "text-[#c6b07a]";

  return (
    <article className={shell}>
      {isChristmas || isBirthday ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-1.5 rounded-[0.65rem] border",
            isLight ? "border-[#c6b07a]/70" : "border-[#c6b07a]/40",
          )}
          aria-hidden="true"
        />
      ) : null}
      {isChristmas ? (
        <div
          className={cn(
            "pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4",
            iconColor,
          )}
          aria-hidden="true"
        >
          <GoldTree className={large ? "h-9 w-7" : "h-7 w-5"} />
        </div>
      ) : null}
      {isBirthday ? (
        <GoldSparkle
          className={cn(
            "pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4",
            iconColor,
            large ? "h-6 w-6" : "h-5 w-5",
          )}
        />
      ) : null}

      <p className={cn(kicker, kickerColor)}>{copy.kicker}</p>
      <p className={cn(title, "mt-1 min-h-[2.4em] hyphens-none")}>{titleText}</p>
      <p
        className={cn(
          body,
          "mt-1",
          productColor,
          showProduct ? "" : "invisible",
        )}
      >
        {productName}
      </p>
      <div className={cn("mt-2 h-px w-10", ruleColor)} aria-hidden="true" />
      <div className="min-h-0 flex-1" aria-hidden="true" />
      <img
        src={isLight ? logoNavy : logoWhite}
        alt=""
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute z-[1] w-auto max-w-[42%] object-contain",
          large
            ? "bottom-5 right-5 h-8 sm:bottom-6 sm:right-6 sm:h-10"
            : "bottom-3 right-3 h-5 sm:bottom-4 sm:right-4 sm:h-6",
        )}
      />
    </article>
  );
};

export default GiftCardPreview;
