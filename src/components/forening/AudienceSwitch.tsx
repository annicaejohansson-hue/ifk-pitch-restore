import { Link } from "react-router-dom";

type AudienceSwitchProps = {
  to: string;
  label: string;
};

const AudienceSwitch = ({ to, label }: AudienceSwitchProps) => (
  <Link
    to={to}
    className="inline-flex min-h-11 max-w-full items-center rounded-full border border-border/80 bg-card px-3.5 py-2 text-pretty text-sm leading-snug text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-background hover:text-primary sm:px-4"
  >
    <span>{label}</span>
  </Link>
);

export default AudienceSwitch;
