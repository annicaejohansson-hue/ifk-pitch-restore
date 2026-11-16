import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatOfferPrice,
  PT_SESSION_LIST_PRICE_SEK,
  sanitizePtQuantityDigits,
} from "@/data/erbjudanden";
import {
  isPtOrderRef,
  normalizePtOrderRef,
  ptPrepaidFromRefAndQuantity,
  type PtPrepaidDisplay,
} from "@/data/erbjudanden-prepaid";
import { verifyPrepaidBookingToken } from "@/lib/erbjudanden/api";
import { cn } from "@/lib/utils";

type PtPrepaidPricePanelProps = {
  initialRef?: string | null;
  initialQuantity?: string | null;
  initialToken?: string | null;
  onPrepaidChange?: (prepaid: PtPrepaidDisplay | null) => void;
  className?: string;
};

const formatPrice = (priceSek: number) =>
  new Intl.NumberFormat("sv-SE").format(priceSek);

const PtPrepaidPricePanel = ({
  initialRef,
  initialQuantity,
  initialToken,
  onPrepaidChange,
  className,
}: PtPrepaidPricePanelProps) => {
  const [orderRef, setOrderRef] = useState(() =>
    normalizePtOrderRef(initialRef ?? ""),
  );
  const [quantity, setQuantity] = useState(
    () => sanitizePtQuantityDigits(initialQuantity ?? "") || "",
  );
  const [prepaid, setPrepaid] = useState<PtPrepaidDisplay | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const applyPrepaid = (next: PtPrepaidDisplay | null) => {
    setPrepaid(next);
    onPrepaidChange?.(next);
  };

  useEffect(() => {
    const token = initialToken?.trim();
    if (!token) {
      const fromParams = ptPrepaidFromRefAndQuantity(
        initialRef ?? "",
        initialQuantity,
      );
      if (fromParams) {
        setOrderRef(fromParams.orderRef);
        setQuantity(String(fromParams.quantity));
        applyPrepaid(fromParams);
      }
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    void verifyPrepaidBookingToken(token)
      .then((result) => {
        if (cancelled) return;
        const next: PtPrepaidDisplay = {
          orderRef: result.orderRef,
          quantity: result.quantity,
          unitPriceSek: result.unitPriceSek,
          listUnitPriceSek: result.listUnitPriceSek,
          verified: true,
        };
        setOrderRef(next.orderRef);
        setQuantity(String(next.quantity));
        applyPrepaid(next);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        applyPrepaid(null);
        setError(
          err instanceof Error
            ? err.message
            : "Kunde inte läsa förbetalningskoden.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Körs när URL-parametrarna för förbetalt ändras.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToken, initialRef, initialQuantity]);

  const showPrice = () => {
    setError(null);
    const next = ptPrepaidFromRefAndQuantity(orderRef, quantity);
    if (!next) {
      applyPrepaid(null);
      if (!isPtOrderRef(orderRef)) {
        setError("Ange en giltig betalningsreferens (t.ex. PT-7K4Q2M).");
        return;
      }
      setError("Ange hur många pass du köpt (1–30).");
      return;
    }
    applyPrepaid(next);
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border/70 bg-muted/40 px-3 py-3 sm:px-4 sm:py-3.5",
        className,
      )}
    >
      <p className="text-sm font-semibold leading-snug text-foreground md:text-base">
        Har du redan betalat för dina pass?
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
        Ange referensen från Swish eller bankgiro (och antal pass) så visar vi
        ditt pris per pass. Du har redan betalat – här bokar du bara tiden.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_auto] sm:items-end">
        <label className="min-w-0 space-y-1.5">
          <span className="text-sm font-medium text-foreground">Referens</span>
          <Input
            value={orderRef}
            onChange={(event) =>
              setOrderRef(normalizePtOrderRef(event.target.value))
            }
            placeholder="PT-7K4Q2M"
            autoComplete="off"
            spellCheck={false}
            className="h-11 min-h-11 text-base uppercase"
          />
        </label>
        <label className="min-w-0 space-y-1.5">
          <span className="text-sm font-medium text-foreground">Antal pass</span>
          <Input
            value={quantity}
            onChange={(event) =>
              setQuantity(sanitizePtQuantityDigits(event.target.value))
            }
            inputMode="numeric"
            placeholder="t.ex. 8"
            autoComplete="off"
            className="h-11 min-h-11 text-base"
          />
        </label>
        <Button
          type="button"
          variant="secondary"
          className="h-11 min-h-11 w-full whitespace-normal px-3 text-sm sm:w-auto"
          onClick={showPrice}
          disabled={loading}
        >
          Visa mitt pris
        </Button>
      </div>

      {loading ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Hämtar ditt pris…
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {prepaid ? (
        <div className="mt-3 rounded-md border border-primary/20 bg-background px-3 py-2.5">
          <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm md:text-base">
            <span className="font-semibold text-foreground">
              {formatOfferPrice(prepaid.unitPriceSek)}/pass
            </span>
            <span className="text-[11px] text-muted-foreground/80 md:text-xs">
              <span className="line-through decoration-muted-foreground/50">
                {formatPrice(prepaid.listUnitPriceSek || PT_SESSION_LIST_PRICE_SEK)}{" "}
                kr
              </span>
            </span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
            {prepaid.verified
              ? "Förbetalt enligt din beställning"
              : "Enligt Caselos pris för det antal pass du angett"}
            {" · "}
            {prepaid.quantity} pass · ref {prepaid.orderRef}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default PtPrepaidPricePanel;
