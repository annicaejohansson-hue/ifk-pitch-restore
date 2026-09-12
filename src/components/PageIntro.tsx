import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  className?: string;
};

const PageIntro = ({
  eyebrow,
  title,
  children,
  className,
}: PageIntroProps) => {
  return (
    <header className={className}>
      <p className="mb-3 text-sm font-medium text-primary sm:text-base">
        {eyebrow}
      </p>
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
