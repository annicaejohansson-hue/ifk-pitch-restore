import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GENERAL_BOOKING_URL, SITE_ORIGIN } from "@/lib/booking";
import { cn } from "@/lib/utils";

const BOOKING_PAGE_PATH = GENERAL_BOOKING_URL;
const BOOKING_PAGE_URL = `${SITE_ORIGIN}${BOOKING_PAGE_PATH}`;

const SharePlayerLink = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BOOKING_PAGE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Button
        type="button"
        variant="secondary"
        className="h-11 min-h-11 w-full whitespace-normal px-4 sm:w-auto"
        aria-label="Kopiera länk till bokningssidan"
        onClick={() => void copy()}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? "Kopierad" : "Kopiera bokningslänk"}
      </Button>
      <a
        href={BOOKING_PAGE_PATH}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-primary underline-offset-4 hover:underline",
        )}
      >
        Öppna bokningssidan
        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
      </a>
    </div>
  );
};

export default SharePlayerLink;
