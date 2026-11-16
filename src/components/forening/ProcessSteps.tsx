import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export type ProcessStep = {
  title: string;
  /** Huvudtext. Med `detail` visas den som större ingress. */
  text: ReactNode;
  /** Mindre detaljtext under ingressen. */
  detail?: ReactNode;
};

type ProcessStepsProps = {
  steps: ProcessStep[];
  compact?: boolean;
};

const ProcessSteps = ({ steps, compact = false }: ProcessStepsProps) => (
  <ol
    className={
      compact
        ? "flex flex-col gap-3 lg:flex-row lg:flex-nowrap lg:items-stretch lg:gap-2"
        : "flex flex-col gap-4 md:flex-row md:flex-nowrap md:items-stretch md:gap-2 lg:gap-3"
    }
  >
    {steps.map((step, index) => (
      <li
        key={step.title}
        className="flex min-w-0 flex-1 items-stretch gap-2"
      >
        <div
          className={
            compact
              ? "flex min-w-0 flex-1 flex-col rounded-2xl border border-border/60 bg-card p-3 shadow-[var(--shadow-card)] sm:p-4"
              : "flex min-w-0 flex-1 flex-col rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)] sm:p-5"
          }
        >
          <div className={compact ? "mb-2 flex items-center gap-2.5" : "mb-2.5 flex items-center gap-3"}>
            <span
              className={
                compact
                  ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground"
                  : "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-bold text-secondary-foreground"
              }
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <h3
              className={
                compact
                  ? "min-w-0 text-base font-bold leading-snug text-foreground md:text-lg"
                  : "min-w-0 text-lg font-bold leading-snug text-foreground md:text-xl"
              }
            >
              {step.title}
            </h3>
          </div>
          {step.detail ? (
            <>
              <p
                className={
                  compact
                    ? "text-base font-medium leading-snug text-foreground md:text-lg"
                    : "text-lg font-medium leading-snug text-foreground md:text-xl"
                }
              >
                {step.text}
              </p>
              <div
                className={
                  compact
                    ? "my-2.5 h-px w-full bg-border/70"
                    : "my-3 h-px w-full bg-border/70"
                }
                aria-hidden="true"
              />
              <p
                className={
                  compact
                    ? "text-sm leading-relaxed text-muted-foreground md:text-base"
                    : "text-base leading-relaxed text-muted-foreground"
                }
              >
                {step.detail}
              </p>
            </>
          ) : (
            <p
              className={
                compact
                  ? "text-sm leading-relaxed text-muted-foreground md:text-base"
                  : "text-base leading-relaxed text-muted-foreground"
              }
            >
              {step.text}
            </p>
          )}
        </div>
        {index < steps.length - 1 ? (
          <ChevronRight
            className={
              compact
                ? "hidden h-5 w-5 shrink-0 self-center text-primary lg:block"
                : "hidden h-5 w-5 shrink-0 self-center text-primary md:block"
            }
            aria-hidden="true"
          />
        ) : null}
      </li>
    ))}
  </ol>
);

export default ProcessSteps;
