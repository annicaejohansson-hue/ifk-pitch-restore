import { useState } from "react";
import {
  DEFAULT_GIFT_LAYOUT,
  GIFT_LAYOUT_OPTIONS,
  type GiftDecorationId,
  type GiftLayoutId,
} from "@/data/erbjudanden";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GiftCardPreview from "./GiftCardPreview";

type GiftLayoutPickerProps = {
  value: GiftLayoutId;
  onChange?: (id: GiftLayoutId) => void;
  recipientName?: string;
  selectable?: boolean;
  name?: string;
  chooseHref?: (id: GiftLayoutId) => string;
  compact?: boolean;
  hidePreview?: boolean;
  productName?: string;
  inscription?: string;
  quantity?: number;
  decoration?: GiftDecorationId;
};

const GiftLayoutPicker = ({
  value,
  onChange,
  selectable = true,
  name = "gift-layout",
  compact = false,
  hidePreview = false,
  productName,
  inscription,
  quantity,
  decoration,
}: GiftLayoutPickerProps) => {
  const [previewId, setPreviewId] = useState<GiftLayoutId | null>(null);
  const preview = GIFT_LAYOUT_OPTIONS.find((item) => item.id === previewId);
  const compactOptions = [
    ...GIFT_LAYOUT_OPTIONS.filter((item) => item.id === DEFAULT_GIFT_LAYOUT),
    ...GIFT_LAYOUT_OPTIONS.filter((item) => item.id !== DEFAULT_GIFT_LAYOUT),
  ];

  if (compact) {
    const selectedOption = GIFT_LAYOUT_OPTIONS.find((item) => item.id === value);
    return (
      <div className="min-w-0 max-w-full">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {compactOptions.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex min-h-11 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-center",
                value === option.id ? "bg-muted" : "",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={value === option.id}
                onChange={() => onChange?.(option.id)}
                className="h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
              />
              <span className="min-w-0 text-xs leading-snug sm:text-sm">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {selectedOption && !hidePreview ? (
          <div className="mt-4 min-w-0">
            <GiftCardPreview
              layout={selectedOption.id}
              size="large"
              productName={productName}
              inscription={inscription}
              quantity={quantity}
              decoration={decoration}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-11 w-full whitespace-normal px-3 text-sm sm:w-auto"
              onClick={() => setPreviewId(selectedOption.id)}
            >
              Förhandsgranska
            </Button>
          </div>
        ) : null}
        <Dialog open={previewId !== null} onOpenChange={(open) => !open && setPreviewId(null)}>
          <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-xl overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pr-10 text-left">
              <DialogTitle>{preview?.label}</DialogTitle>
              <DialogDescription>
                Presentkort från Caselo Idrottsmedicin.
              </DialogDescription>
            </DialogHeader>
            {previewId ? (
              <GiftCardPreview
                layout={previewId}
                size="large"
                productName={productName}
                inscription={inscription}
                quantity={quantity}
                decoration={decoration}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="grid grid-cols-1 gap-3 [contain:inline-size] md:grid-cols-4 md:gap-4">
          {GIFT_LAYOUT_OPTIONS.map((option) => {
            const selected = selectable && value === option.id;
            return (
              <div
                key={option.id}
                className={cn(
                  "flex h-full min-w-0 flex-col rounded-2xl border p-3",
                  selected
                    ? "border-primary bg-accent/50 shadow-[var(--shadow-card)]"
                    : "border-border/60 bg-card",
                )}
              >
                {selectable ? (
                  <label className="flex min-h-11 cursor-pointer items-start gap-2">
                    <input
                      type="radio"
                      name={name}
                      value={option.id}
                      checked={selected}
                      onChange={() => onChange?.(option.id)}
                      className="mt-1 h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
                    />
                    <span className="min-w-0 pt-0.5 text-sm font-semibold leading-snug text-foreground md:text-base">
                      {option.label}
                    </span>
                  </label>
                ) : (
                  <div className="flex min-h-11 items-center">
                    <p className="text-sm font-semibold leading-snug text-foreground md:text-base">
                      {option.label}
                    </p>
                  </div>
                )}
                <div className="mt-2 flex min-h-0 min-w-0 flex-1 flex-col">
                  <GiftCardPreview
                    layout={option.id}
                    productName={productName}
                    quantity={quantity}
                    decoration={decoration}
                  />
                </div>
                <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto min-h-11 w-full whitespace-normal px-1.5 py-2 text-center text-xs leading-tight sm:text-sm"
                      onClick={() => setPreviewId(option.id)}
                    >
                      Förhandsgranska
                    </Button>
                </div>
              </div>
            );
          })}
      </div>

      <Dialog open={previewId !== null} onOpenChange={(open) => !open && setPreviewId(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-1.5rem)] max-w-xl overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pr-10 text-left">
            <DialogTitle>{preview?.label}</DialogTitle>
            <DialogDescription>
              Presentkort från Caselo Idrottsmedicin.
            </DialogDescription>
          </DialogHeader>
          {previewId ? (
            <GiftCardPreview
              layout={previewId}
              size="large"
              productName={productName}
              inscription={inscription}
              quantity={quantity}
              decoration={decoration}
            />
          ) : null}
          {selectable && previewId ? (
            <Button
              type="button"
              className="h-11 w-full whitespace-normal sm:w-auto"
              onClick={() => {
                onChange?.(previewId);
                setPreviewId(null);
              }}
            >
              Välj {preview?.label.toLowerCase()}
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GiftLayoutPicker;
