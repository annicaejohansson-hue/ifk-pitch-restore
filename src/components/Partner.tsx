const PARTNER_LOGOS = [
  {
    src: "https://irp.cdn-website.com/e6471f24/dms3rep/multi/g10.png",
    alt: "IFK Stocksund",
    href: "https://www.ifkstocksund.se/",
    width: 350,
    height: 438,
  },
  {
    src: "https://az729104.cdn.laget.se/emblem_4818200.png;width=480;height=480;paddingWidth=16;mode=pad;scale=both;anchor=middlecenter",
    alt: "IFK Mariefred logotyp",
    href: "https://www.laget.se/ifk_mariefred",
    width: 480,
    height: 480,
  },
  {
    src: "/enebyberglogo.jpeg",
    alt: "Enebybergs IF",
    href: "https://www.enebybergsif.se/",
    width: 148,
    height: 148,
    rounded: true,
  },
  {
    src: "/parsian-if-logo.png",
    alt: "Parsian IF",
    href: "https://www.parsianif.se/",
    width: 191,
    height: 256,
  },
  {
    src: "/fc-djursholm-logo.png",
    alt: "FC Djursholm",
    href: "https://www.fcdjursholm.se/",
    width: 509,
    height: 560,
  },
] as const;

const logoSlotClass = (variant: "footer" | "inline") =>
  variant === "inline"
    ? "inline-flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20 md:h-24 md:w-24"
    : "inline-flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16 md:h-24 md:w-24";

const logoImgClass = (variant: "footer" | "inline") =>
  variant === "inline"
    ? "h-full w-full object-contain"
    : "h-full w-full object-contain";

const PartnerLogos = ({ variant }: { variant: "footer" | "inline" }) => (
  <>
    {PARTNER_LOGOS.map((logo) => (
      <a
        key={logo.alt}
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${logoSlotClass(variant)} min-h-11 min-w-11 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
        aria-label={`${logo.alt} (öppnas i ny flik)`}
      >
        <img
          src={logo.src}
          alt=""
          className={`${logoImgClass(variant)}${"rounded" in logo && logo.rounded ? " rounded-full bg-white" : ""}`}
          width={logo.width}
          height={logo.height}
          loading="lazy"
          decoding="async"
        />
      </a>
    ))}
  </>
);

type PartnerProps = {
  variant?: "footer" | "inline";
  /** Extra classes on the inline wrapper (e.g. drop top border in a page section). */
  className?: string;
};

const Partner = ({ variant = "footer", className = "" }: PartnerProps) => {
  if (variant === "inline") {
    return (
      <div
        className={[
          "mt-6 border-t border-border/60 pt-5",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <h2 className="mb-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-6 md:text-4xl">
          Samarbetspartner till
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start md:gap-5">
          <PartnerLogos variant="inline" />
        </div>
      </div>
    );
  }

  return (
    <footer className="no-print bg-[#0e1627] py-6 md:py-8">
      <div className="container px-8 md:px-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 text-center text-primary-foreground sm:flex-row sm:flex-wrap sm:gap-4 sm:text-left md:gap-5">
          <p className="text-base md:text-lg">Samarbetspartner till</p>
          <div className="flex flex-wrap items-center justify-center gap-4 p-0 md:gap-5">
            <PartnerLogos variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Partner;
