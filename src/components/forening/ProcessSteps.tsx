import { ChevronRight } from "lucide-react";

export type ProcessStep = {
  title: string;
  text: string;
};

type ProcessStepsProps = {
  steps: ProcessStep[];
};

const ProcessSteps = ({ steps }: ProcessStepsProps) => (
  <ol className="flex flex-col gap-4 md:flex-row md:flex-nowrap md:items-stretch md:gap-2 lg:gap-3">
    {steps.map((step, index) => (
      <li
        key={step.title}
        className="flex min-w-0 flex-1 items-stretch gap-2"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)] sm:p-5 md:flex-col md:gap-0">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground sm:h-10 sm:w-10 md:mb-3"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground md:text-xl">
              {step.title}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </div>
        </div>
        {index < steps.length - 1 ? (
          <ChevronRight
            className="hidden h-5 w-5 shrink-0 self-center text-primary md:block"
            aria-hidden="true"
          />
        ) : null}
      </li>
    ))}
  </ol>
);

export default ProcessSteps;
