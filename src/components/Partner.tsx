const Partner = () => {
  return (
    <footer className="bg-primary py-6 md:py-8">
      <div className="container px-4">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-4 md:gap-6 text-primary-foreground">
          <p className="text-base md:text-lg">
            Officiell partner till
          </p>
          <div className="p-0">
            <img
              src="https://az729104.cdn.laget.se/emblem_4818200.png;width=480;height=480;paddingWidth=16;mode=pad;scale=both;anchor=middlecenter"
              alt="IFK Mariefred logotyp"
              className="h-16 w-auto md:h-24"
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

