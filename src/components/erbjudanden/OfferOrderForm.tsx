import { useEffect, useRef, useState } from "react";
import {
  useForm,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DEFAULT_GIFT_DECORATION,
  DEFAULT_GIFT_LAYOUT,
  defaultGiftInscription,
  FRISKVARD_FOCUS_OPTIONS,
  GIFT_DECORATION_OPTIONS,
  GIFT_PRODUCT_LABEL,
  OFFER_CONTACT_EMAIL,
  OFFER_PATHS,
  OFFER_PRODUCTS,
  PT_SESSION_DEFAULT_QUANTITY,
  PT_SESSION_LIST_PRICE_SEK,
  PT_SESSION_MAX_QUANTITY,
  PT_SESSION_MIN_QUANTITY,
  formatFocusLabels,
  formatOfferPriceWithVat,
  formatPtProductName,
  getPtSessionQuote,
  isFriskvardProduct,
  parseFriskvardFocusId,
  parseFriskvardFocusIds,
  parseGiftLayoutId,
  parsePtQuantity,
  parseFullPersonalId,
  PERSONAL_ID_FORMAT_LABEL,
  formatPersonalIdInput,
  type GiftDecorationId,
  type GiftLayoutId,
  type OfferProductId,
} from "@/data/erbjudanden";
import GiftCardPreview from "./GiftCardPreview";
import GiftLayoutPicker from "./GiftLayoutPicker";
import PtQuantityPicker from "./PtQuantityPicker";
import {
  fetchCheckoutState,
  submitOfferOrder,
  type CheckoutState,
  type PaymentState,
} from "@/lib/erbjudanden/api";
import { cn } from "@/lib/utils";
import { offerGoldCtaClass, offerOutlineCtaClass } from "./offerUi";
import PaymentPanel from "./PaymentPanel";
import UnsavedCheckoutGuard from "./UnsavedCheckoutGuard";
import { PRIVACY_PATH } from "@/pages/Personuppgifter";

const storageKey = (productId: OfferProductId) =>
  `caselo-offer-order:${productId}`;

const draftKey = (productId: "snabbhet" | "friskvard") =>
  `caselo-offer-draft:${productId}`;

/**
 * På localhost ska omladdning ge ett tomt formulär. Därför varken sparas
 * eller återställs utkast/betalning från sessionStorage i lokal miljö.
 */
const isLocalCheckoutDev = () => {
  if (typeof window === "undefined") return Boolean(import.meta.env.DEV);
  const host = window.location.hostname;
  return (
    import.meta.env.DEV || host === "localhost" || host === "127.0.0.1"
  );
};

const clearLocalOfferStorage = () => {
  if (!isLocalCheckoutDev()) return;
  try {
    for (const id of ["snabbhet", "friskvard"] as const) {
      sessionStorage.removeItem(draftKey(id));
      sessionStorage.removeItem(storageKey(id));
    }
  } catch {
    /* ignore */
  }
};

clearLocalOfferStorage();

const readStoredPayment = (
  productId: "snabbhet" | "friskvard",
): PaymentState | null => {
  if (isLocalCheckoutDev()) return null;
  try {
    const raw = sessionStorage.getItem(storageKey(productId));
    if (!raw) return null;
    const stored = JSON.parse(raw) as PaymentState;
    if (
      stored?.orderRef &&
      (stored.productId === productId ||
        (productId === "friskvard" && isFriskvardProduct(stored.productId)))
    ) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return null;
};

const readFormDraft = <T,>(productId: "snabbhet" | "friskvard") => {
  if (isLocalCheckoutDev()) return null;
  try {
    const raw = sessionStorage.getItem(draftKey(productId));
    if (!raw) return null;
    const stored = JSON.parse(raw) as { values?: T; step?: number };
    if (!stored || typeof stored !== "object") return null;
    return stored;
  } catch {
    return null;
  }
};

const writeFormDraft = (
  productId: "snabbhet" | "friskvard",
  values: unknown,
  step: number,
) => {
  if (isLocalCheckoutDev()) return;
  try {
    sessionStorage.setItem(draftKey(productId), JSON.stringify({ values, step }));
  } catch {
    /* ignore */
  }
};

const baseSchema = {
  buyerName: z
    .string()
    .trim()
    .min(2, "Ange förnamn och efternamn på den som betalar."),
  buyerEmail: z
    .string()
    .trim()
    .email("Ange en giltig e-postadress."),
  buyerEmailConfirm: z
    .string()
    .trim()
    .email("Bekräfta e-postadressen."),
  // Kunden väljer betalsätt innan beställningen skickas, så att valet kommer
  // med i det enda mejlet till Caselo.
  // Fältet är tomt tills kunden har valt. Det får inte bli ett typfel i zod:
  // då avbryts kontrollen innan reglerna som beror på flera fält körs (idrott,
  // kvittonamn, personnummer, e-postadresserna), och de stegen släpps igenom.
  paymentMethod: z
    .custom<"swish" | "bankgiro" | undefined>(() => true)
    .refine((value) => value === "swish" || value === "bankgiro", {
      message: "Välj hur du vill betala.",
    }),
  // Godkännande av personuppgiftspolicyn krävs innan beställningen skickas.
  privacyConsent: z.boolean().refine((value) => value === true, {
    message: "Godkänn Caselos hantering av personuppgifter för att fortsätta.",
  }),
  website: z.string().optional(),
};

const giftLayoutSchema = z.enum(
  [
    "neutral",
    "caselo-ljusbla",
    "ljusgra",
    "mint",
    "pappersvit",
    "julklapp-gron",
    "julklapp-rod",
    "fodelsedag",
  ],
  { required_error: "Välj färg." },
);

const giftDecorationSchema = z.enum(
  ["none", "gran", "stjarna", "hjarta", "snoflinga", "boll"],
  { required_error: "Välj dekoration." },
);

const emailMatch = (values: { buyerEmail: string; buyerEmailConfirm: string }) =>
  values.buyerEmail.toLowerCase() === values.buyerEmailConfirm.toLowerCase();

const requireGiftLayout = (
  values: { recipient?: "self" | "gift"; giftLayout?: string },
  ctx: z.RefinementCtx,
) => {
  if (values.recipient === "gift" && !values.giftLayout) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["giftLayout"],
      message: "Välj färg.",
    });
  }
};

const wellnessFieldsSchema = {
  wellnessReceipt: z.enum(["no", "yes"]),
  receiptCustomerName: z.string().trim(),
  personalId: z.string().trim(),
};

const requireWellnessDetails =
  (_amountSek?: number) =>
  (
    values: {
      wellnessReceipt?: "no" | "yes";
      receiptCustomerName?: string;
      personalId?: string;
    },
    ctx: z.RefinementCtx,
  ) => {
    if (values.wellnessReceipt !== "yes") return;
    if ((values.receiptCustomerName ?? "").length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["receiptCustomerName"],
        message: "Ange namnet som ska stå på kvittot.",
      });
    }
    if (!parseFullPersonalId(values.personalId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["personalId"],
        message: `Ange ett giltigt personnummer i formatet ${PERSONAL_ID_FORMAT_LABEL}.`,
      });
    }
  };

const snabbhetSchema = z
  .object({
    ...baseSchema,
    ...wellnessFieldsSchema,
    recipient: z.enum(["self", "gift"]),
    giftLayout: giftLayoutSchema,
    giftDecoration: giftDecorationSchema,
    giftRecipientName: z.string().trim(),
    giftInscription: z.string().trim(),
  })
  .refine(emailMatch, {
    path: ["buyerEmailConfirm"],
    message: "E-postadresserna stämmer inte överens.",
  })
  .superRefine((values, ctx) => {
    requireGiftLayout(values, ctx);
    requireWellnessDetails(OFFER_PRODUCTS.snabbhet.priceSek)(values, ctx);
  });

const friskvardSchema = z
  .object({
    ...baseSchema,
    ...wellnessFieldsSchema,
    recipient: z.enum(["self", "gift"]),
    giftLayout: giftLayoutSchema,
    giftDecoration: giftDecorationSchema,
    giftRecipientName: z.string().trim(),
    giftInscription: z.string().trim(),
    quantity: z
      .string()
      .trim()
      .regex(/^\d+$/, "Fyll i antal pass för att se pris och rabatt.")
      .refine((value) => {
        const quantity = Number(value);
        return (
          quantity >= PT_SESSION_MIN_QUANTITY &&
          quantity <= PT_SESSION_MAX_QUANTITY
        );
      }, "Fyll i antal pass för att se pris och rabatt."),
    participantName: z
      .string()
      .trim()
      .min(2, "Ange förnamn och efternamn på den som ska träna."),
    focuses: z
      .array(z.enum(["fotbollsfys", "lopteknik-snabbhet", "fys-idrott"]))
      .min(1, "Välj minst ett fokus."),
    sportName: z.string().trim(),
    personalConfirm: z.boolean().refine((value) => value === true, {
      message: "Bekräfta att träningen är personlig och inte överlåtbar.",
    }),
  })
  .refine(emailMatch, {
    path: ["buyerEmailConfirm"],
    message: "E-postadresserna stämmer inte överens.",
  })
  .superRefine((values, ctx) => {
    requireGiftLayout(values, ctx);
    if (
      values.focuses?.includes("fys-idrott") &&
      (values.sportName ?? "").length < 2
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sportName"],
        message: "Ange vilken idrott passen ska anpassas till.",
      });
    }
    const quantity = Number(values.quantity);
    const amountSek =
      Number.isFinite(quantity) && quantity > 0
        ? getPtSessionQuote(quantity).totalSek
        : 0;
    requireWellnessDetails(amountSek)(values, ctx);
  });

type SnabbhetValues = z.infer<typeof snabbhetSchema>;
type FriskvardValues = z.infer<typeof friskvardSchema>;

const fieldClass =
  "h-11 min-h-11 w-full whitespace-normal text-base";

/**
 * Kassan kontrollerar ett steg i taget med `trigger`, och sådana fel ligger
 * annars kvar tills man trycker på Nästa igen. Här kontrolleras de fält som
 * redan visar ett fel om så fort något ändras, så att felet försvinner när
 * fältet är rätt ifyllt. Fält utan fel berörs inte.
 */
function useRecheckShownErrors<T extends FieldValues>(form: UseFormReturn<T>) {
  useEffect(() => {
    const subscription = form.watch((_values, info) => {
      if (!info.name) return;
      const shown = (Object.keys(form.getValues()) as Path<T>[]).filter(
        (name) => form.getFieldState(name).error,
      );
      if (shown.length > 0) void form.trigger(shown);
    });
    return () => subscription.unsubscribe();
  }, [form]);
}

const radioItemClass =
  "flex min-h-11 items-start gap-3 rounded-lg border border-transparent px-2 py-2 hover:bg-muted/60";

type OfferOrderFormProps = {
  productId: "snabbhet" | "friskvard";
};

const PT_CHECKOUT_STEPS = [
  {
    title: "Tjänst",
    // Bekräftelsen hör till tjänsten, inte till betalningen.
    fields: [
      "participantName",
      "quantity",
      "focuses",
      "sportName",
      "personalConfirm",
    ],
  },
  {
    title: "Presentkort",
    fields: ["recipient", "giftLayout", "giftDecoration", "giftInscription"],
  },
  {
    title: "Friskvård",
    fields: ["wellnessReceipt", "receiptCustomerName", "personalId"],
  },
  {
    title: "Betalning",
    fields: [
      "buyerName",
      "buyerEmail",
      "buyerEmailConfirm",
      "paymentMethod",
      "privacyConsent",
    ],
  },
] as const;

const SNABBHET_CHECKOUT_STEPS = [
  {
    title: "Presentkort",
    fields: ["recipient", "giftLayout", "giftDecoration", "giftInscription"],
  },
  {
    title: "Friskvård",
    fields: ["wellnessReceipt", "receiptCustomerName", "personalId"],
  },
  {
    title: "Betalning",
    fields: [
      "buyerName",
      "buyerEmail",
      "buyerEmailConfirm",
      "paymentMethod",
      "privacyConsent",
    ],
  },
] as const;

/** Rubriken för betalningsinstruktionen; dit rullar sidan när den visas. */
const PAYMENT_STEPS_ID = "betalningsinstruktion";

const CheckoutStepNav = ({
  steps,
  current,
  onSelect,
}: {
  steps: readonly { title: string }[];
  current: number;
  onSelect: (index: number) => void;
}) => {
  const allSteps = steps;
  return (
  <div>
    <p className="mb-2 text-sm font-medium text-muted-foreground md:text-base">
      Steg {current + 1} av {allSteps.length}
    </p>
    <nav aria-label="Kassasteg">
      <ol
        className={cn(
          "grid gap-1 rounded-xl bg-muted p-1",
          allSteps.length === 3
            ? "sm:grid-cols-3"
            : "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {allSteps.map((step, index) => (
          <li key={step.title} className="min-w-0">
            <button
              type="button"
              aria-current={current === index ? "step" : undefined}
              className={cn(
                "flex min-h-11 w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm leading-snug disabled:cursor-not-allowed disabled:opacity-60 md:text-base lg:px-2.5",
                current === index
                  ? "bg-secondary font-semibold text-secondary-foreground shadow-sm"
                  : "text-muted-foreground enabled:hover:bg-background enabled:hover:text-foreground",
              )}
              onClick={() => onSelect(index)}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                  current === index
                    ? "bg-background/80 text-foreground"
                    : "border border-border",
                )}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="min-w-0">{step.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  </div>
  );
};

const DisabledNotice = ({
  checkout,
}: {
  checkout: CheckoutState | null;
}) => {
  const message =
    checkout?.message ||
    "Köp är inte öppet ännu. Mejla oss så hjälper vi dig.";
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/60 p-5 sm:p-6">
      <p className="break-words text-base leading-relaxed text-foreground md:text-lg">
        {message}{" "}
        <a
          className="break-all font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          href={`mailto:${checkout?.contactEmail || OFFER_CONTACT_EMAIL}`}
        >
          {checkout?.contactEmail || OFFER_CONTACT_EMAIL}
        </a>
        .
      </p>
      {checkout && !checkout.salesOpen ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          Har du redan köpt? Gå till{" "}
          <Link
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            to={OFFER_PATHS.boka}
          >
            bokningssidan
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
};

const OfferOrderForm = ({ productId }: OfferOrderFormProps) => {
  const product = OFFER_PRODUCTS[productId];
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);
  const [checkoutError, setCheckoutError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentState | null>(() =>
    readStoredPayment(productId),
  );
  const snabbhetDraft = readFormDraft<SnabbhetValues>("snabbhet");
  const friskvardDraft = readFormDraft<FriskvardValues>("friskvard");
  const [checkoutStep, setCheckoutStep] = useState(() => {
    const step = readFormDraft(productId)?.step;
    const max =
      productId === "snabbhet"
        ? SNABBHET_CHECKOUT_STEPS.length - 1
        : PT_CHECKOUT_STEPS.length - 1;
    if (typeof step === "number" && step >= 0) return Math.min(step, max);
    return 0;
  });
  const formTopRef = useRef<HTMLDivElement>(null);
  const skipUrlPrefill = useRef(
    Boolean(
      (productId === "snabbhet" && snabbhetDraft?.values) ||
        (productId === "friskvard" && friskvardDraft?.values),
    ),
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const layoutFromUrl =
    parseGiftLayoutId(searchParams.get("kort")) ?? DEFAULT_GIFT_LAYOUT;
  const quantityFromUrl = parsePtQuantity(searchParams.get("antal"));
  const focusFromUrl = parseFriskvardFocusId(searchParams.get("inriktning"));
  const scrollToPaymentRef = useRef(false);

  const snabbhetForm = useForm<SnabbhetValues>({
    resolver: zodResolver(snabbhetSchema),
    defaultValues: {
      buyerName: "",
      buyerEmail: "",
      buyerEmailConfirm: "",
      privacyConsent: false,
      recipient: "self",
      giftLayout: layoutFromUrl,
      giftDecoration: DEFAULT_GIFT_DECORATION,
      giftRecipientName: "",
      giftInscription: defaultGiftInscription("snabbhet"),
      wellnessReceipt: "no",
      receiptCustomerName: "",
      personalId: "",
      website: "",
      ...snabbhetDraft?.values,
    },
  });

  const friskvardForm = useForm<FriskvardValues>({
    resolver: zodResolver(friskvardSchema),
    defaultValues: {
      buyerName: "",
      buyerEmail: "",
      buyerEmailConfirm: "",
      privacyConsent: false,
      recipient: "self",
      giftLayout: layoutFromUrl,
      giftDecoration: DEFAULT_GIFT_DECORATION,
      giftRecipientName: "",
      giftInscription: defaultGiftInscription("friskvard"),
      quantity: quantityFromUrl
        ? String(quantityFromUrl)
        : String(PT_SESSION_DEFAULT_QUANTITY),
      participantName: "",
      focuses: focusFromUrl ? [focusFromUrl] : [],
      sportName: "",
      personalConfirm: false,
      wellnessReceipt: "no",
      receiptCustomerName: "",
      personalId: "",
      website: "",
      ...friskvardDraft?.values,
    },
  });

  useRecheckShownErrors(snabbhetForm);
  useRecheckShownErrors(friskvardForm);

  const snabbhetRecipient = snabbhetForm.watch("recipient");
  const snabbhetGiftLayout = snabbhetForm.watch("giftLayout");
  const snabbhetGiftDecoration = snabbhetForm.watch("giftDecoration");
  const snabbhetGiftInscription = snabbhetForm.watch("giftInscription");
  const snabbhetWellnessReceipt = snabbhetForm.watch("wellnessReceipt");
  const friskvardRecipient = friskvardForm.watch("recipient");
  const friskvardGiftLayout = friskvardForm.watch("giftLayout");
  const friskvardGiftDecoration = friskvardForm.watch("giftDecoration");
  const friskvardGiftInscription = friskvardForm.watch("giftInscription");
  const friskvardWellnessReceipt = friskvardForm.watch("wellnessReceipt");
  const selectedQuantityRaw = friskvardForm.watch("quantity");
  const selectedFocuses = friskvardForm.watch("focuses");
  const selectedSportName = friskvardForm.watch("sportName");
  const selectedParticipantName = friskvardForm.watch("participantName");
  const { isDirty: friskvardDirty } = friskvardForm.formState;
  const { isDirty: snabbhetDirty } = snabbhetForm.formState;
  const snabbhetPaymentMethod = snabbhetForm.watch("paymentMethod");
  const friskvardPaymentMethod = friskvardForm.watch("paymentMethod");
  const formDirty = productId === "snabbhet" ? snabbhetDirty : friskvardDirty;
  // Betalningsuppgifterna gäller den beställning som skickades. Ändrar kunden
  // något efteråt döljs de tills en ny beställning (ny referens) har skickats.
  const orderCurrent = Boolean(payment) && !formDirty;
  const paymentOrderRef = payment?.orderRef;

  useEffect(() => {
    if (!orderCurrent || !scrollToPaymentRef.current) return;
    scrollToPaymentRef.current = false;
    window.requestAnimationFrame(() => {
      document
        .getElementById(PAYMENT_STEPS_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [orderCurrent, paymentOrderRef]);

  useEffect(() => {
    if (skipUrlPrefill.current) return;
    const fromUrl = parseGiftLayoutId(searchParams.get("kort"));
    if (fromUrl) {
      snabbhetForm.setValue("giftLayout", fromUrl);
    }
    const quantity = searchParams.get("antal");
    if (
      quantity !== null &&
      quantity !== friskvardForm.getValues("quantity")
    ) {
      friskvardForm.setValue("quantity", quantity);
    }
    const focuses = parseFriskvardFocusIds(searchParams.get("inriktning"));
    if (focuses.length > 0) {
      friskvardForm.setValue("focuses", focuses);
    }
  }, [searchParams, snabbhetForm, friskvardForm]);

  useEffect(() => {
    let active = true;
    fetchCheckoutState()
      .then((state) => {
        if (active) setCheckout(state);
      })
      .catch(() => {
        if (active) setCheckoutError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const stored = readStoredPayment(productId);
    if (stored) setPayment(stored);
  }, [productId]);

  const rememberPayment = (next: PaymentState) => {
    setPayment((prev) => {
      const merged = {
        ...next,
        // Svaret på Jag har betalat saknar valet från kassan när servern inte
        // har beställningen lagrad; behåll det för samma beställning.
        chosenPaymentMethod:
          next.chosenPaymentMethod ??
          (prev?.orderRef === next.orderRef
            ? prev.chosenPaymentMethod
            : undefined),
        wellnessReceipt:
          next.wellnessReceipt ??
          (prev?.orderRef === next.orderRef ? prev.wellnessReceipt : undefined),
        focusLabel: next.focusLabel || prev?.focusLabel,
        quantity: next.quantity ?? prev?.quantity,
        amountSek: next.quantity
          ? next.amountSek
          : prev?.amountSek && prev.productId === next.productId
            ? prev.amountSek
            : next.amountSek,
        amountLabel: next.quantity
          ? next.amountLabel
          : prev?.amountLabel && prev.productId === next.productId
            ? prev.amountLabel
            : next.amountLabel,
        productName: next.quantity
          ? next.productName
          : prev?.productName && prev.productId === next.productId
            ? prev.productName
            : next.productName,
        // Swish-länken och QR-koden bär beloppet. Känner servern inte till
        // beställningen (publicerad sajt utan lokal lagring) räknar den på
        // grundpriset, så länken från beställningen måste stå kvar.
        swishAppUrl: next.quantity
          ? next.swishAppUrl
          : prev?.swishAppUrl && prev.productId === next.productId
            ? prev.swishAppUrl
            : next.swishAppUrl,
      };
      if (!isLocalCheckoutDev()) {
        try {
          sessionStorage.setItem(storageKey(productId), JSON.stringify(merged));
        } catch {
          /* ignore */
        }
      }
      return merged;
    });
  };

  const scrollToFormTop = () => {
    window.requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const purchaseEnabled = checkout?.purchaseEnabled === true;
  const bankgiroAvailable = checkout?.bankgiroAvailable !== false;

  // Utan bankgiro finns inget att välja mellan: frågan döljs och Swish gäller.
  useEffect(() => {
    if (bankgiroAvailable) return;
    snabbhetForm.setValue("paymentMethod", "swish");
    friskvardForm.setValue("paymentMethod", "swish");
  }, [bankgiroAvailable, snabbhetForm, friskvardForm]);
  const selectedQuantity = parsePtQuantity(selectedQuantityRaw);
  const selectedQuote = selectedQuantity
    ? getPtSessionQuote(selectedQuantity)
    : null;
  const selectedFocusLabel = formatFocusLabels(
    selectedFocuses,
    selectedSportName,
  );
  const priceLabel =
    checkout?.packages[productId === "friskvard" ? "friskvard-pass" : productId]
      ?.priceLabel || formatOfferPriceWithVat(product.priceSek);

  const onSnabbhetSubmit = async (values: SnabbhetValues) => {
    // Beställningen är redan skickad och oförändrad: uppgifterna visas redan.
    if (payment && !snabbhetDirty) return;
    if (!purchaseEnabled) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const next = await submitOfferOrder({
        productId: "snabbhet",
        buyerName: values.buyerName,
        buyerEmail: values.buyerEmail,
        buyerEmailConfirm: values.buyerEmailConfirm,
        paymentMethod: values.paymentMethod,
        giftLayout: values.giftLayout,
        giftDecoration: values.giftDecoration,
        recipient: values.recipient,
        giftRecipientName: values.giftRecipientName,
        giftInscription:
          values.recipient === "gift"
            ? values.giftInscription || defaultGiftInscription("snabbhet")
            : "",
        wellnessReceipt: values.wellnessReceipt,
        receiptCustomerName:
          values.wellnessReceipt === "yes" ? values.receiptCustomerName : "",
        personalId:
          values.wellnessReceipt === "yes" ? values.personalId : "",
        website: values.website,
      });
      writeFormDraft("snabbhet", values, checkoutStep);
      snabbhetForm.reset(values);
      skipUrlPrefill.current = true;
      rememberPayment(next);
      scrollToPaymentRef.current = true;
    } catch (error) {
      const fields = (error as { fields?: Record<string, string> }).fields;
      if (fields) {
        Object.entries(fields).forEach(([name, message]) => {
          snabbhetForm.setError(name as keyof SnabbhetValues, { message });
        });
      }
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Beställningen kunde inte skickas.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onFriskvardSubmit = async (values: FriskvardValues) => {
    // Beställningen är redan skickad och oförändrad: uppgifterna visas redan.
    if (payment && !friskvardDirty) return;
    if (!purchaseEnabled) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const quantity = Number(values.quantity);
      const next = await submitOfferOrder({
        productId: "friskvard-pass",
        buyerName: values.buyerName,
        buyerEmail: values.buyerEmail,
        buyerEmailConfirm: values.buyerEmailConfirm,
        paymentMethod: values.paymentMethod,
        participantName: values.participantName,
        focus: values.focuses.join(","),
        sportName: values.focuses.includes("fys-idrott")
          ? values.sportName
          : "",
        quantity,
        recipient: values.recipient,
        giftLayout: values.giftLayout,
        giftDecoration: values.giftDecoration,
        giftRecipientName: values.giftRecipientName,
        giftInscription:
          values.recipient === "gift"
            ? values.giftInscription || defaultGiftInscription("friskvard")
            : "",
        wellnessReceipt: values.wellnessReceipt,
        receiptCustomerName:
          values.wellnessReceipt === "yes" ? values.receiptCustomerName : "",
        personalId:
          values.wellnessReceipt === "yes" ? values.personalId : "",
        website: values.website,
      });
      writeFormDraft("friskvard", values, checkoutStep);
      friskvardForm.reset(values);
      skipUrlPrefill.current = true;
      rememberPayment(next);
      scrollToPaymentRef.current = true;
    } catch (error) {
      const fields = (error as { fields?: Record<string, string> }).fields;
      if (fields) {
        Object.entries(fields).forEach(([name, message]) => {
          friskvardForm.setError(name as keyof FriskvardValues, { message });
        });
      }
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Beställningen kunde inte skickas.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formStepCount =
    productId === "snabbhet"
      ? SNABBHET_CHECKOUT_STEPS.length
      : PT_CHECKOUT_STEPS.length;

  const lastCheckoutStep = formStepCount - 1;

  const goToCheckoutStep = (next: number) => {
    setCheckoutStep(Math.min(Math.max(next, 0), lastCheckoutStep));
    scrollToFormTop();
  };

  const goToPtStepWithError = (errors: Partial<Record<keyof FriskvardValues, unknown>>) => {
    if (
      errors.quantity ||
      errors.participantName ||
      errors.focuses ||
      errors.sportName ||
      errors.personalConfirm
    ) {
      goToCheckoutStep(0);
      return;
    }
    if (errors.recipient || errors.giftLayout || errors.giftInscription) {
      goToCheckoutStep(1);
      return;
    }
    if (errors.wellnessReceipt || errors.receiptCustomerName || errors.personalId) {
      goToCheckoutStep(2);
      return;
    }
    goToCheckoutStep(3);
  };

  const goToSnabbhetStepWithError = (
    errors: Partial<Record<keyof SnabbhetValues, unknown>>,
  ) => {
    if (errors.recipient || errors.giftLayout || errors.giftInscription) {
      goToCheckoutStep(0);
      return;
    }
    if (errors.wellnessReceipt || errors.receiptCustomerName || errors.personalId) {
      goToCheckoutStep(1);
      return;
    }
    goToCheckoutStep(2);
  };

  const goNextCheckoutStep = async () => {
    if (productId === "snabbhet") {
      const fields = [...SNABBHET_CHECKOUT_STEPS[checkoutStep].fields];
      const valid = await snabbhetForm.trigger(fields, { shouldFocus: true });
      if (!valid) return;
      goToCheckoutStep(
        Math.min(checkoutStep + 1, SNABBHET_CHECKOUT_STEPS.length - 1),
      );
      return;
    }
    const fields = [...PT_CHECKOUT_STEPS[checkoutStep].fields];
    const valid = await friskvardForm.trigger(fields, { shouldFocus: true });
    if (!valid) return;
    goToCheckoutStep(Math.min(checkoutStep + 1, PT_CHECKOUT_STEPS.length - 1));
  };

  if (!payment && !checkout && !checkoutError) {
    return (
      <div id="bestall" className="scroll-mt-28">
        <p className="text-base text-muted-foreground">Laddar köpuppgifter…</p>
      </div>
    );
  }

  if (!payment && checkoutError) {
    return (
      <div id="bestall" className="scroll-mt-28">
        <DisabledNotice
          checkout={{
            ok: false,
            purchaseEnabled: false,
            salesOpen: true,
            reason: "unavailable",
            message:
              "Köpformuläret kunde inte laddas. Beställningar tas inte emot just nu.",
            contactEmail: OFFER_CONTACT_EMAIL,
            packages: {
              snabbhet: {
                id: "snabbhet",
                name: OFFER_PRODUCTS.snabbhet.name,
                priceSek: OFFER_PRODUCTS.snabbhet.priceSek,
                priceLabel: formatOfferPriceWithVat(OFFER_PRODUCTS.snabbhet.priceSek),
              },
              "friskvard-pass": {
                id: "friskvard-pass",
                name: OFFER_PRODUCTS["friskvard-pass"].name,
                priceSek: OFFER_PRODUCTS["friskvard-pass"].priceSek,
                priceLabel: formatOfferPriceWithVat(
                  OFFER_PRODUCTS["friskvard-pass"].priceSek,
                ),
              },
              friskvard: {
                id: "friskvard",
                name: OFFER_PRODUCTS.friskvard.name,
                priceSek: OFFER_PRODUCTS.friskvard.priceSek,
                priceLabel: formatOfferPriceWithVat(OFFER_PRODUCTS.friskvard.priceSek),
              },
            },
          }}
        />
      </div>
    );
  }

  if (!payment && checkout && !purchaseEnabled) {
    return (
      <div id="bestall" className="scroll-mt-28">
        <div className="mb-4">
          {productId === "friskvard" ? (
            <p className="text-base text-muted-foreground md:text-lg">
              <span className="font-semibold text-foreground">
                {OFFER_PRODUCTS["friskvard-pass"].name}
              </span>
              {": "}
              {formatOfferPriceWithVat(PT_SESSION_LIST_PRICE_SEK)} per pass, med
              upp till 30 % rabatt.
            </p>
          ) : (
            <>
              <p className="text-lg font-semibold text-foreground md:text-xl">
                {product.name}
              </p>
              <p className="text-base text-muted-foreground md:text-lg">
                {priceLabel}
              </p>
            </>
          )}
        </div>
        <DisabledNotice checkout={checkout} />
      </div>
    );
  }

  const sharedFields = (form: typeof snabbhetForm | typeof friskvardForm) => (
    <>
      <FormField
        control={form.control}
        name="buyerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Förnamn och efternamn på den som betalar</FormLabel>
            <FormControl>
              <Input autoComplete="name" className={fieldClass} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="buyerEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-postadress till den som betalar</FormLabel>
            <FormControl>
              <Input
                type="email"
                autoComplete="email"
                inputMode="email"
                className={fieldClass}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="buyerEmailConfirm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bekräfta e-postadress</FormLabel>
            <FormControl>
              <Input
                type="email"
                autoComplete="email"
                inputMode="email"
                className={fieldClass}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {bankgiroAvailable ? (
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hur vill du betala?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    const next = value === "bankgiro" ? "bankgiro" : "swish";
                    if (!orderCurrent) {
                      field.onChange(next);
                      return;
                    }
                    // Beställningen är redan skickad: byt bara vilka
                    // betalningsuppgifter som visas, utan ny beställning.
                    if (form === snabbhetForm) {
                      snabbhetForm.resetField("paymentMethod", {
                        defaultValue: next,
                      });
                      writeFormDraft(
                        "snabbhet",
                        snabbhetForm.getValues(),
                        checkoutStep,
                      );
                    } else {
                      friskvardForm.resetField("paymentMethod", {
                        defaultValue: next,
                      });
                      writeFormDraft(
                        "friskvard",
                        friskvardForm.getValues(),
                        checkoutStep,
                      );
                    }
                  }}
                  value={field.value ?? ""}
                  className="gap-1"
                >
                  <label className={radioItemClass}>
                    <RadioGroupItem
                      value="swish"
                      id={`${productId}-payment-swish`}
                    />
                    <span className="min-w-0 pt-0.5 text-base leading-snug">
                      Swish
                    </span>
                  </label>
                  <label className={radioItemClass}>
                    <RadioGroupItem
                      value="bankgiro"
                      id={`${productId}-payment-bankgiro`}
                    />
                    <span className="min-w-0 pt-0.5">
                      <span className="block text-base leading-snug">
                        Bankgiro
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                        Betalningen når normalt Caselo efter 1–2 bankdagar.
                      </span>
                    </span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : null}
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem className="hidden" aria-hidden="true">
            <FormLabel>Webbplats</FormLabel>
            <FormControl>
              <Input tabIndex={-1} autoComplete="off" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );

  const giftProductKey = productId === "snabbhet" ? "snabbhet" : "friskvard";
  const giftProductLabel = GIFT_PRODUCT_LABEL[giftProductKey];
  const giftDefaultInscription = defaultGiftInscription(giftProductKey);

  const giftFields = (
    form: typeof snabbhetForm | typeof friskvardForm,
    recipient: "self" | "gift",
    layout: GiftLayoutId,
    decoration: GiftDecorationId,
    inscription: string,
    quantity?: number | null,
  ) => (
    <>
      <FormField
        control={form.control}
        name="recipient"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vill du ha ett presentkort?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="gap-1"
              >
                <label className={radioItemClass}>
                  <RadioGroupItem value="self" id={`${productId}-recipient-self`} />
                  <span className="min-w-0 pt-0.5 text-base leading-snug">
                    Nej, kvitto och bokningsinstruktion räcker
                  </span>
                </label>
                <label className={radioItemClass}>
                  <RadioGroupItem value="gift" id={`${productId}-recipient-gift`} />
                  <span className="min-w-0 pt-0.5 text-base leading-snug">
                    Ja, jag vill få ett presentkort mailat till mig
                  </span>
                </label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className={cn(recipient !== "gift" && "hidden")}>
        {/* Förhandsgranskningen sticky så man ser ändringar medan man väljer. */}
        <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="sticky top-[5.5rem] z-10 -mx-1 space-y-2 bg-background/95 px-1 py-2 backdrop-blur-sm supports-[backdrop-filter]:bg-background/85 sm:top-24 lg:top-28">
            <p className="text-sm font-medium leading-snug text-foreground md:text-base">
              Förhandsgranskning
            </p>
            <GiftCardPreview
              layout={layout}
              size="large"
              productName={giftProductLabel}
              inscription={inscription || giftDefaultInscription}
              quantity={quantity ?? undefined}
              decoration={decoration}
              className="max-sm:min-h-[16.5rem] max-sm:p-4 sm:min-h-[20rem]"
            />
          </div>

          <div className="min-w-0 space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Standard är mörkblått med texten {giftDefaultInscription}. Byt
              färg, dekoration och text här – förhandsgranskningen
              uppdateras direkt.
            </p>
            <FormField
              control={form.control}
              name="giftLayout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Färg</FormLabel>
                  <FormDescription>
                    Mörkblå används om du inte väljer något annat.
                  </FormDescription>
                  <FormControl>
                    <GiftLayoutPicker
                      compact
                      hidePreview
                      name={`${productId}-checkout-gift-layout`}
                      value={field.value}
                      onChange={field.onChange}
                      productName={giftProductLabel}
                      inscription={inscription || giftDefaultInscription}
                      quantity={quantity ?? undefined}
                      decoration={decoration}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="giftDecoration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dekoration</FormLabel>
                  <FormDescription>
                    Valfritt. Visas uppe till höger på presentkortet.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 gap-1 sm:grid-cols-2"
                    >
                      {GIFT_DECORATION_OPTIONS.map((option) => (
                        <label key={option.id} className={radioItemClass}>
                          <RadioGroupItem
                            value={option.id}
                            id={`${productId}-gift-decoration-${option.id}`}
                          />
                          <span className="min-w-0 pt-0.5 text-base leading-snug">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="giftInscription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text på kortet</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      maxLength={80}
                      className="min-h-11 whitespace-normal text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ändra om du vill att det ska stå något annat. Presentkortet
                    mejlas till din e-postadress.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );

  const wellnessFields = (
    form: typeof snabbhetForm | typeof friskvardForm,
    wellness: "no" | "yes",
    _amountSek: number,
    defaultName: string,
  ) => {
    return (
      <>
        <FormField
          control={form.control}
          name="wellnessReceipt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Behöver du kvitto för friskvårdsbidrag?</FormLabel>
              <FormDescription>
                {productId === "snabbhet"
                  ? "Kontrollera med din arbetsgivare om bidraget kan användas. Vi tar med uppgifterna på kvittot om du vill."
                  : "Kvittot kan lämnas till arbetsgivaren. Caselo fyller i företagsnamn, organisationsnummer, produkt, moms, belopp och datum."}
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== "yes") return;
                    const current =
                      form === snabbhetForm
                        ? snabbhetForm.getValues("receiptCustomerName")
                        : friskvardForm.getValues("receiptCustomerName");
                    if (!current.trim() && defaultName.trim()) {
                      if (form === snabbhetForm) {
                        snabbhetForm.setValue(
                          "receiptCustomerName",
                          defaultName.trim(),
                        );
                      } else {
                        friskvardForm.setValue(
                          "receiptCustomerName",
                          defaultName.trim(),
                        );
                      }
                    }
                  }}
                  value={field.value}
                  className="gap-1"
                >
                  <label className={radioItemClass}>
                    <RadioGroupItem
                      value="no"
                      id={`${productId}-wellness-no`}
                    />
                    <span className="min-w-0 pt-0.5 text-base leading-snug">
                      Nej, det behövs inte
                    </span>
                  </label>
                  <label className={radioItemClass}>
                    <RadioGroupItem
                      value="yes"
                      id={`${productId}-wellness-yes`}
                    />
                    <span className="min-w-0 pt-0.5 text-base leading-snug">
                      Ja, kvittot ska kunna lämnas till min arbetsgivare
                    </span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {wellness === "yes" ? (
          <>
            <FormField
              control={form.control}
              name="receiptCustomerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn på kvittot</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      className={fieldClass}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Det namn som ska stå som kund på kvittot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personnummer</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={PERSONAL_ID_FORMAT_LABEL}
                      className={fieldClass}
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          formatPersonalIdInput(event.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Skriv tolv siffror{" "}
                    <span className="whitespace-nowrap">
                      ({PERSONAL_ID_FORMAT_LABEL})
                    </span>
                    . Bindestrecket läggs in automatiskt. Namn och
                    personnummer står båda på kvittot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}
      </>
    );
  };

  const orderSummaryClass =
    "rounded-xl border border-border/70 bg-muted/50 px-4 py-3";

  const paymentStepHeading = (
    <h3 className="text-xl font-bold text-foreground md:text-2xl">
      {bankgiroAvailable
        ? "Betala med Swish eller bankgiro"
        : "Betala med Swish"}
    </h3>
  );

  // Sist i betalningssteget, precis före knappen – stör inte namn, mejl
  // eller valet av betalsätt.
  const privacyConsentField = (
    form: typeof snabbhetForm | typeof friskvardForm,
  ) => (
    <FormField
      control={form.control}
      name="privacyConsent"
      render={({ field }) => (
        <FormItem>
          <label className="flex min-h-11 items-start gap-3">
            <FormControl>
              <Checkbox
                className="mt-1 h-5 w-5"
                checked={field.value === true}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            </FormControl>
            <span className="min-w-0 text-sm leading-relaxed text-foreground md:text-base">
              Jag godkänner att Caselo Idrottsmedicin behandlar mina
              personuppgifter enligt{" "}
              <Link
                to={PRIVACY_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                personuppgiftspolicyn
              </Link>
              .
            </span>
          </label>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const submitErrorNote = submitError ? (
    <p className="text-sm text-destructive" role="alert">
      {submitError}
    </p>
  ) : null;

  const shownPaymentMethod =
    productId === "snabbhet" ? snabbhetPaymentMethod : friskvardPaymentMethod;

  // Betalningsinstruktionen visas i samma steg som uppgifterna, så snart
  // beställningen är skickad och har fått sin betalningsreferens.
  const paymentInstructions =
    orderCurrent && payment ? (
      <PaymentPanel
        payment={payment}
        method={shownPaymentMethod === "bankgiro" ? "bankgiro" : "swish"}
        headingId={PAYMENT_STEPS_ID}
        onClaimed={rememberPayment}
        onBack={() => goToCheckoutStep(lastCheckoutStep - 1)}
      />
    ) : null;

  const showStepButtons = !(checkoutStep === lastCheckoutStep && orderCurrent);

  return (
    <div id="bestall" className="scroll-mt-28">
      <UnsavedCheckoutGuard
        enabled={formDirty}
      />
      <div
        ref={formTopRef}
        className="scroll-mt-28 rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6 md:p-8"
      >
        <div>
        {productId === "snabbhet" ? (
          <Form {...snabbhetForm}>
            <form
              className="space-y-5"
              onSubmit={(event) => {
                if (checkoutStep < SNABBHET_CHECKOUT_STEPS.length - 1) {
                  event.preventDefault();
                  void goNextCheckoutStep();
                  return;
                }
                void snabbhetForm.handleSubmit(
                  onSnabbhetSubmit,
                  goToSnabbhetStepWithError,
                )(event);
              }}
              noValidate
            >
              <CheckoutStepNav
                steps={SNABBHET_CHECKOUT_STEPS}
                current={checkoutStep}
                onSelect={goToCheckoutStep}
              />

              <div className={cn("space-y-5", checkoutStep !== 0 && "hidden")}>
                {giftFields(
                  snabbhetForm,
                  snabbhetRecipient,
                  snabbhetGiftLayout,
                  snabbhetGiftDecoration,
                  snabbhetGiftInscription,
                )}
              </div>

              <div className={cn("space-y-5", checkoutStep !== 1 && "hidden")}>
                {wellnessFields(
                  snabbhetForm,
                  snabbhetWellnessReceipt === "yes" ? "yes" : "no",
                  OFFER_PRODUCTS.snabbhet.priceSek,
                  "",
                )}
              </div>

              <div className={cn("space-y-5", checkoutStep !== 2 && "hidden")}>
                {paymentStepHeading}
                <div className={orderSummaryClass}>
                  <p className="text-sm font-semibold text-foreground md:text-base">
                    Orderöversikt
                  </p>
                  <ul className="mt-2 space-y-1 break-words text-sm leading-snug text-foreground md:text-base">
                    <li>Upplägg: {product.name}</li>
                    <li>Totalt: {priceLabel}</li>
                    {snabbhetWellnessReceipt === "yes" ? (
                      <li>Kvitto för friskvårdsbidrag</li>
                    ) : null}
                  </ul>
                </div>
                {sharedFields(snabbhetForm)}
                {privacyConsentField(snabbhetForm)}
                {submitErrorNote}
                {paymentInstructions}
              </div>

              <div
                className={cn(
                  "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
                  !showStepButtons && "hidden",
                )}
              >
                {checkoutStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className={offerOutlineCtaClass}
                    onClick={() => goToCheckoutStep(checkoutStep - 1)}
                  >
                    Föregående
                  </Button>
                ) : null}
                {checkoutStep < SNABBHET_CHECKOUT_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className={offerGoldCtaClass}
                    onClick={() => void goNextCheckoutStep()}
                  >
                    Nästa
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="secondary"
                    className={offerGoldCtaClass}
                    disabled={submitting || !checkout}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    Visa betalningsuppgifter
                  </Button>
                )}
              </div>
            </form>
          </Form>
        ) : (
          <Form {...friskvardForm}>
            <form
              className="space-y-5"
              onSubmit={(event) => {
                if (checkoutStep < PT_CHECKOUT_STEPS.length - 1) {
                  event.preventDefault();
                  void goNextCheckoutStep();
                  return;
                }
                void friskvardForm.handleSubmit(
                  onFriskvardSubmit,
                  goToPtStepWithError,
                )(event);
              }}
              noValidate
            >
              <CheckoutStepNav
                steps={PT_CHECKOUT_STEPS}
                current={checkoutStep}
                onSelect={goToCheckoutStep}
              />

              {/* Tjänst-steget: tre tydliga frågor + bekräftelse sist. */}
              <div className={cn("space-y-8", checkoutStep !== 0 && "hidden")}>
                <section className="space-y-3" aria-labelledby="pt-tjanst-vem">
                  <h3
                    id="pt-tjanst-vem"
                    className="text-base font-semibold leading-snug text-foreground md:text-lg"
                  >
                    1. Vem ska träna?
                  </h3>
                  <FormField
                    control={friskvardForm.control}
                    name="participantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Förnamn och efternamn
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="name"
                            className={fieldClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <section
                  className="space-y-3 border-t border-border/60 pt-6"
                  aria-labelledby="pt-tjanst-antal"
                >
                  <h3
                    id="pt-tjanst-antal"
                    className="text-base font-semibold leading-snug text-foreground md:text-lg"
                  >
                    2. Antal pass
                  </h3>
                  <FormField
                    control={friskvardForm.control}
                    name="quantity"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <PtQuantityPicker
                          id="pt-antal-form"
                          value={field.value}
                          error={fieldState.error?.message}
                          hideInstruction
                          onChange={(digits) => {
                            field.onChange(digits || "0");
                            const next = new URLSearchParams(searchParams);
                            next.set("antal", digits || "0");
                            setSearchParams(next, { replace: true });
                          }}
                        />
                      </FormItem>
                    )}
                  />
                </section>

                <section
                  className="space-y-3 border-t border-border/60 pt-6"
                  aria-labelledby="pt-tjanst-fokus"
                >
                  <div className="space-y-1">
                    <h3
                      id="pt-tjanst-fokus"
                      className="text-base font-semibold leading-snug text-foreground md:text-lg"
                    >
                      3. Fokus för passen
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Välj ett eller flera. Kan justeras senare.
                    </p>
                  </div>
                  <FormField
                    control={friskvardForm.control}
                    name="focuses"
                    render={({ field }) => (
                      <FormItem>
                        <div className="overflow-hidden rounded-xl border border-border/70 divide-y divide-border/60">
                          {FRISKVARD_FOCUS_OPTIONS.map((option) => {
                            const checked = field.value?.includes(option.id);
                            return (
                              <div key={option.id} className="bg-background">
                                <label
                                  className={cn(
                                    "flex min-h-11 cursor-pointer items-start gap-3 px-3 py-3 sm:px-4",
                                    checked && "bg-muted/40",
                                  )}
                                >
                                  <Checkbox
                                    className="mt-1 h-5 w-5"
                                    checked={checked}
                                    onCheckedChange={(value) => {
                                      const current = field.value ?? [];
                                      field.onChange(
                                        value === true
                                          ? [...current, option.id]
                                          : current.filter(
                                              (id) => id !== option.id,
                                            ),
                                      );
                                    }}
                                  />
                                  <span className="min-w-0 pt-0.5">
                                    <span className="block text-base leading-snug text-foreground">
                                      {option.label}
                                    </span>
                                    <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                                      {option.summary}
                                    </span>
                                  </span>
                                </label>
                                {option.id === "fys-idrott" ? (
                                  <div
                                    className={cn(
                                      "border-t border-border/50 bg-muted/20 px-3 pb-3 pt-2 sm:px-4 sm:pl-12",
                                      !checked && "hidden",
                                    )}
                                  >
                                    <FormField
                                      control={friskvardForm.control}
                                      name="sportName"
                                      render={({ field: sportField }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Vilken idrott/motionsform?{" "}
                                            <span className="font-normal text-muted-foreground">
                                              (så att passen kan anpassas
                                              därefter)
                                            </span>
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              className={fieldClass}
                                              {...sportField}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <FormField
                  control={friskvardForm.control}
                  name="personalConfirm"
                  render={({ field }) => (
                    <FormItem className="border-t border-border/60 pt-6">
                      <label className="flex min-h-11 items-start gap-3">
                        <FormControl>
                          <Checkbox
                            className="mt-1 h-5 w-5"
                            checked={field.value === true}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>
                        <span className="text-sm leading-relaxed text-foreground md:text-base">
                          Jag förstår att träningen är personlig och inte kan
                          överlåtas eller bytas mot andra tjänster.
                        </span>
                      </label>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className={cn("space-y-5", checkoutStep !== 1 && "hidden")}>
                {giftFields(
                  friskvardForm,
                  friskvardRecipient,
                  friskvardGiftLayout,
                  friskvardGiftDecoration,
                  friskvardGiftInscription,
                  selectedQuantity,
                )}
              </div>

              <div className={cn("space-y-5", checkoutStep !== 2 && "hidden")}>
                {wellnessFields(
                  friskvardForm,
                  friskvardWellnessReceipt === "yes" ? "yes" : "no",
                  selectedQuote?.totalSek ?? 0,
                  selectedParticipantName,
                )}
              </div>

              <div className={cn("space-y-5", checkoutStep !== 3 && "hidden")}>
                {paymentStepHeading}
                {selectedQuote || selectedFocusLabel ? (
                  <div className={orderSummaryClass}>
                    <p className="text-sm font-semibold text-foreground md:text-base">
                      Orderöversikt
                    </p>
                    <ul className="mt-2 space-y-1 break-words text-sm leading-snug text-foreground md:text-base">
                      <li>
                        Upplägg:{" "}
                        {selectedQuote
                          ? formatPtProductName(selectedQuote.quantity)
                          : "Ange antal pass"}
                      </li>
                      <li>Fokus: {selectedFocusLabel || "Välj fokus"}</li>
                      <li>
                        Totalt:{" "}
                        {selectedQuote
                          ? formatOfferPriceWithVat(selectedQuote.totalSek)
                          : "Ange antal pass"}
                      </li>
                      {friskvardWellnessReceipt === "yes" ? (
                        <li>Kvitto för friskvårdsbidrag</li>
                      ) : null}
                    </ul>
                  </div>
                ) : null}
                {sharedFields(friskvardForm)}
                {privacyConsentField(friskvardForm)}
                {submitErrorNote}
                {paymentInstructions}
              </div>

              <div
                className={cn(
                  "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
                  !showStepButtons && "hidden",
                )}
              >
                {checkoutStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className={offerOutlineCtaClass}
                    onClick={() => goToCheckoutStep(checkoutStep - 1)}
                  >
                    Föregående
                  </Button>
                ) : null}
                {checkoutStep < PT_CHECKOUT_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className={offerGoldCtaClass}
                    onClick={() => void goNextCheckoutStep()}
                  >
                    Nästa
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="secondary"
                    className={offerGoldCtaClass}
                    disabled={submitting || !checkout}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    Visa betalningsuppgifter
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
        {payment && showStepButtons ? (
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Du har redan en beställning med betalningsreferens{" "}
            <span className="font-medium text-foreground">
              {payment.orderRef}
            </span>
            {formDirty
              ? ". Eftersom du har ändrat något får du en ny betalningsreferens när du klickar på Visa betalningsuppgifter."
              : " – betalningsuppgifterna finns under steget Betalning. Om du ändrar något får du en ny betalningsreferens."}
          </p>
        ) : null}
        </div>
      </div>
    </div>
  );
};

export default OfferOrderForm;
