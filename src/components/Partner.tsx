const PARTNER_LOGOS = [
  {
    src: "https://irp.cdn-website.com/e6471f24/dms3rep/multi/g10.png",
    alt: "IFK Stocksund",
    width: 350,
    height: 438,
  },
  {
    src: "https://az729104.cdn.laget.se/emblem_4818200.png;width=480;height=480;paddingWidth=16;mode=pad;scale=both;anchor=middlecenter",
    alt: "IFK Mariefred logotyp",
    width: 480,
    height: 480,
  },
  {
    src: "/enebyberglogo.jpeg",
    alt: "Enebybergs IF",
    width: 148,
    height: 148,
    rounded: true,
  },
] as const;

const logoClass = (variant: "footer" | "inline") =>
  variant === "inline"
    ? "h-16 w-auto max-w-[28vw] object-contain sm:h-20 sm:max-w-none md:h-24"
    : "h-14 w-auto max-w-[28vw] object-contain sm:h-16 sm:max-w-none md:h-24";

const PartnerLogos = ({ variant }: { variant: "footer" | "inline" }) => (
  <>
    {PARTNER_LOGOS.map((logo) => (
      <img
        key={logo.alt}
        src={logo.src}
        alt={logo.alt}
        className={`${logoClass(variant)}${"rounded" in logo && logo.rounded ? " rounded-full bg-white" : ""}`}
        width={logo.width}
        height={logo.height}
        loading="lazy"
        decoding="async"
      />
    ))}
  </>
);

type PartnerProps = {
  variant?: "footer" | "inline";
};

const Partner = ({ variant = "footer" }: PartnerProps) => {
  if (variant === "inline") {
    return (
      <div className="mt-6 border-t border-border/60 pt-5">
        <p className="mb-3 text-center text-base text-muted-foreground sm:text-left md:text-lg">
          Samarbetspartner till
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-start md:gap-6">
          <PartnerLogos variant="inline" />
        </div>
      </div>
    );
  }

  return (
    <footer className="no-print bg-[#0e1627] py-6 md:py-8">
      <div className="container px-8 md:px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 text-center text-primary-foreground sm:flex-row sm:flex-wrap sm:gap-4 sm:text-left md:gap-6">
          <p className="text-base md:text-lg">Samarbetspartner till</p>
          <div className="flex flex-wrap items-center justify-center gap-3 p-0 md:gap-4">
            <PartnerLogos variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Partner;
