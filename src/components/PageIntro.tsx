import type { ReactNode } from "react";
import { Link, type To } from "react-router-dom";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: string;
  eyebrowHref?: To;
  title: string;
  mobileTitle?: string;
  children?: ReactNode;
  className?: string;
};

const PageIntro = ({
  eyebrow,
  eyebrowHref,
  title,
  mobileTitle,
  children,
  className,
}: PageIntroProps) => {
  const eyebrowClass =
    "mb-3 text-sm font-medium leading-none text-primary sm:text-base";

  return (
    <header className={cn("min-w-0 w-full max-w-full", className)}>
      {eyebrow ? (
        eyebrowHref ? (
          <p className={eyebrowClass}>
            <Link
              to={eyebrowHref}
              className="inline-flex min-h-11 items-center underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              {eyebrow}
            </Link>
          </p>
        ) : (
          <p className={eyebrowClass}>{eyebrow}</p>
        )
      ) : null}
      <h1
        className={cn(
          "w-full max-w-full break-words text-3xl font-bold leading-snug tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-tight lg:text-5xl",
          children ? "mb-4 md:mb-5" : "",
        )}
      >
        {mobileTitle ? (
          <>
            <span className="md:hidden">{mobileTitle}</span>
            <span className="hidden md:inline">{title}</span>
          </>
        ) : (
          title
        )}
      </h1>
      {children ? (
        <div className="max-w-3xl space-y-4 break-words text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
          {children}
        </div>
      ) : null}
    </header>
  );
};

export default PageIntro;
