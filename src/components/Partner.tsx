const Partner = () => {
  return (
    <footer className="bg-primary py-6 md:py-8">
      <div className="container px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 text-center text-primary-foreground sm:flex-row sm:flex-wrap sm:gap-4 sm:text-left md:gap-6">
          <p className="text-base md:text-lg">
            Samarbetspartner till
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 p-0">
            <img
              src="https://irp.cdn-website.com/e6471f24/dms3rep/multi/g10.png"
              alt="IFK Stocksund"
              className="h-14 w-auto max-w-[40vw] object-contain sm:h-16 md:h-24 md:max-w-none"
              width={350}
              height={438}
              loading="lazy"
              decoding="async"
            />
            <img
              src="https://az729104.cdn.laget.se/emblem_4818200.png;width=480;height=480;paddingWidth=16;mode=pad;scale=both;anchor=middlecenter"
              alt="IFK Mariefred logotyp"
              className="h-14 w-auto max-w-[40vw] object-contain sm:h-16 md:h-24 md:max-w-none"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Partner;
