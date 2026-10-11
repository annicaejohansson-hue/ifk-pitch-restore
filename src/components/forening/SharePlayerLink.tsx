import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_ORIGIN } from "@/lib/booking";

const PLAYER_PAGE_PATH = "/forening/spelare";
const PLAYER_PAGE_URL = `${SITE_ORIGIN}${PLAYER_PAGE_PATH}`;

const SharePlayerLink = () => {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(PLAYER_PAGE_URL);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant="secondary"
        className="h-auto min-h-11 w-full max-w-full whitespace-normal px-4 py-2.5 text-center text-base leading-snug shadow-[var(--shadow-button)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg"
        onClick={copyLink}
      >
        {status === "copied" ? (
          <Check className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
        )}
        Kopiera länk till spelare och föräldrar
      </Button>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground" aria-live="polite">
        {status === "copied" ? "Länken kopierad" : null}
        {status === "error" ? (
          <>
            Gick inte att kopiera automatiskt. Kopiera länken manuellt:{" "}
            <span className="break-all text-foreground">{PLAYER_PAGE_URL}</span>
          </>
        ) : null}
      </p>

      <p>
        <Link
          to={PLAYER_PAGE_PATH}
          className="inline-flex min-h-11 max-w-full items-center text-sm leading-snug text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Öppna sidan för spelare och föräldrar
        </Link>
      </p>
    </div>
  );
};

export default SharePlayerLink;
