import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import {
  giftCardLandingUrl,
  isLightGiftLayout,
  OFFER_PLACE,
  type GiftDecorationId,
  type GiftLayoutId,
} from "@/data/erbjudanden";
import logoNavy from "@/assets/caselo-logo-navy.png";
import logoWhite from "@/assets/caselo-logo-white.png";

type GiftCardPreviewProps = {
  layout: GiftLayoutId;
  size?: "tile" | "large";
  productName?: string;
  inscription?: string;
  /** Antal träningspass – visas på personlig träning-kort. */
  quantity?: number;
  /** Dekoration uppe till höger – oberoende av färgval. */
  decoration?: GiftDecorationId;
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
  "caselo-ljusbla": {
    kicker: "Presentkort",
    title: "Grattis",
    showProduct: false,
  },
  ljusgra: {
    kicker: "Presentkort",
    title: "Grattis",
    showProduct: false,
  },
  mint: {
    kicker: "Presentkort",
    title: "Grattis",
    showProduct: false,
  },
  pappersvit: {
    kicker: "Presentkort",
    title: "Grattis",
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

/**
 * Kalligrafiskt hjärta efter inspobild: öppet nedtill, penselstråk med
 * varierande tjocklek, ej ifyllt som en solid form.
 */
const GoldHeart = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Vänster båge – smalare */}
    <path
      strokeWidth="1.5"
      d="M11.6 8.2C10.2 5.2 7.6 3.8 5.4 4.2 3.2 4.6 1.9 6.8 2.4 9.2c.6 3.1 3.4 5.6 7.4 9.1"
    />
    {/* Höger båge – tjockare, med svans */}
    <path
      strokeWidth="2.35"
      d="M12.2 7.8C13.7 5 16.5 3.7 18.7 4.2c2.3.5 3.7 2.7 3.2 5.2-.8 4.1-5.2 7.6-9.2 11.2"
    />
  </svg>
);

const GoldSnowflake = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <path d="M12 2v20M4.5 6.5 19.5 17.5M19.5 6.5 4.5 17.5" />
    <path d="M12 6.2 9.8 4.8M12 6.2l2.2-1.4M12 17.8l-2.2 1.4M12 17.8l2.2 1.4" />
    <path d="M7.2 8.2 4.8 8.8M7.2 8.2 6 5.8M16.8 15.8l2.4-.6M16.8 15.8 18 18.2" />
    <path d="M16.8 8.2l2.4.6M16.8 8.2 18 5.8M7.2 15.8l-2.4-.6M7.2 15.8 6 18.2" />
  </svg>
);

/**
 * Enkel fotbollssymbol: cirkel + mittpentagon. Läses som boll utan
 * plottriga sömmar i liten storlek.
 */
const GoldBall = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <circle
      cx="12"
      cy="12"
      r="8.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path d="M12 8.2 14.6 10.1 13.6 13.2 10.4 13.2 9.4 10.1Z" />
  </svg>
);

const DecorationIcon = ({
  id,
  className,
}: {
  id: Exclude<GiftDecorationId, "none">;
  className?: string;
}) => {
  if (id === "gran") return <GoldTree className={className} />;
  if (id === "stjarna") return <GoldSparkle className={className} />;
  if (id === "hjarta") return <GoldHeart className={className} />;
  if (id === "snoflinga") return <GoldSnowflake className={className} />;
  return <GoldBall className={className} />;
};

const GiftCardPreview = ({
  layout,
  size = "tile",
  productName = "Snabbhetspaket",
  inscription,
  quantity,
  decoration = "none",
  className,
}: GiftCardPreviewProps) => {
  const large = size === "large";
  const copy = COPY[layout];
  const customInscription = inscription?.trim() ?? "";
  const titleText = customInscription || copy.title || productName;
  const showProduct = copy.showProduct && !customInscription;
  const isLight = isLightGiftLayout(layout);
  const showDecoration = decoration !== "none";
  const qrUrl = giftCardLandingUrl();
  const sessionLine =
    typeof quantity === "number" && quantity > 0
      ? `${quantity} träningspass à 60 min`
      : null;

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
    large ? "min-h-[22rem] p-6 sm:min-h-[24rem] sm:p-8" : "min-h-[13.75rem] p-3 sm:p-4",
    layout === "neutral" && "bg-[#0e1627] text-[#f5f2ea]",
    layout === "julklapp-gron" && "bg-[#1c2621] text-[#f3ead7]",
    layout === "julklapp-rod" && "bg-[#3a1c24] text-[#f6ead8]",
    layout === "fodelsedag" && "bg-[#ebe0cc] text-[#1b2430]",
    // Caselo secondary / ljusblå – sparsam med bläck.
    layout === "caselo-ljusbla" && "bg-[#b9c9e3] text-[#1b2430]",
    layout === "ljusgra" && "bg-[#e5e7eb] text-[#1b2430]",
    layout === "mint" && "bg-[#d8e6df] text-[#1b2430]",
    layout === "pappersvit" &&
      "border border-[#d7d7d4] bg-[#f7f7f5] text-[#1b2430]",
    className,
  );

  const lightAccent =
    layout === "caselo-ljusbla" ? "text-[#3a5080]" : "text-[#8a7040]";
  const lightRule =
    layout === "caselo-ljusbla" ? "bg-[#3a5080]" : "bg-[#c6b07a]";
  const kickerColor = isLight ? lightAccent : "text-[#c6b07a]";
  const ruleColor = isLight ? lightRule : "bg-[#c6b07a]";
  const productColor = isLight
    ? "text-[#4a5160]"
    : layout === "julklapp-gron"
      ? "text-[#f3ead7]/80"
      : layout === "julklapp-rod"
        ? "text-[#f6ead8]/75"
        : "text-[#f5f2ea]/80";
  const iconColor = isLight ? lightAccent : "text-[#c6b07a]";
  const qrFg = "#0e1627";
  const qrBg = "#ffffff";

  return (
    <article className={shell}>
      {showDecoration ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-1.5 rounded-[0.65rem] border",
            layout === "caselo-ljusbla"
              ? "border-[#3a5080]/45"
              : isLight
                ? "border-[#c6b07a]/70"
                : "border-[#c6b07a]/40",
          )}
          aria-hidden="true"
        />
      ) : null}
      {showDecoration ? (
        <div
          className={cn(
            "pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4",
            iconColor,
          )}
          aria-hidden="true"
        >
          <DecorationIcon
            id={decoration}
            className={large ? "h-8 w-8 sm:h-9 sm:w-9" : "h-6 w-6"}
          />
        </div>
      ) : null}

      <p className={cn(kicker, kickerColor)}>{copy.kicker}</p>
      <p className={cn(title, "mt-1 min-h-[2.4em] hyphens-none pr-10")}>
        {titleText}
      </p>
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

      <ul className={cn(body, "mt-3 space-y-0.5", productColor)}>
        {sessionLine ? <li>{sessionLine}</li> : null}
        <li>Med leg. fysioterapeut Henrik Nilsson</li>
        <li>{OFFER_PLACE}</li>
      </ul>

      <div className="mt-4 flex min-h-0 flex-1 items-end justify-between gap-3">
        {large ? (
          <figure className="shrink-0 rounded-md bg-white p-1.5 shadow-sm">
            <QRCodeSVG
              value={qrUrl}
              size={96}
              level="M"
              marginSize={1}
              bgColor={qrBg}
              fgColor={qrFg}
              className="h-20 w-20 sm:h-24 sm:w-24"
              title={`QR-kod till ${qrUrl}`}
            />
            <figcaption className="sr-only">
              Skanna för mer information om personlig träning hos Caselo.
            </figcaption>
          </figure>
        ) : (
          <span className="block" aria-hidden="true" />
        )}
        <img
          src={isLight ? logoNavy : logoWhite}
          alt=""
          aria-hidden="true"
          className={cn(
            "pointer-events-none z-[1] ml-auto w-auto max-w-[42%] object-contain",
            large ? "h-8 sm:h-10" : "h-5 sm:h-6",
          )}
        />
      </div>
    </article>
  );
};

export default GiftCardPreview;
