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
  const eyebrowClass = "mb-3 text-sm font-medium text-primary sm:text-base";

  return (
    <header className={className}>
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
          "text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-tight lg:text-5xl",
          children ? "mb-4 md:mb-5" : "",
        )}
      >
        {title}
      </h1>
      {children ? (
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
          {children}
        </p>
      ) : null}
    </header>
  );
};

export default PageIntro;
