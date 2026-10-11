import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow: string;
  eyebrowHref?: string;
  title: string;
  children?: ReactNode;
  className?: string;
};

const PageIntro = ({
  eyebrow,
  eyebrowHref,
  title,
  children,
  className,
}: PageIntroProps) => {
  const eyebrowClass =
    "mb-3 text-sm font-medium leading-none text-primary sm:text-base";

  return (
    <header className={cn("min-w-0 w-full max-w-full", className)}>
      {eyebrowHref ? (
        <p className={eyebrowClass}>
          <Link
            to={eyebrowHref}
            className="transition-colors hover:text-primary/80"
          >
            {eyebrow}
          </Link>
        </p>
      ) : (
        <p className={eyebrowClass}>{eyebrow}</p>
      )}
      <h1
        className={cn(
          "w-full max-w-full break-words text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl md:text-[2.75rem] md:leading-tight lg:text-5xl",
          children ? "mb-4 md:mb-5" : "",
        )}
      >
        {title}
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
