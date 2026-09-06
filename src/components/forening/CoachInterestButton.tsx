import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { submitCoachInterest } from "@/lib/submitCoachInterest";

const goldCtaClass =
  "h-auto min-h-11 w-full max-w-sm whitespace-normal px-5 py-2.5 text-base shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-hover)] sm:w-auto sm:max-w-none sm:px-7 sm:text-lg";

const digitCount = (value: string) => (value.match(/\d/g) ?? []).length;

const formSchema = z
  .object({
    name: z.string().trim().min(1, "Ange ditt namn."),
    club: z.string().trim().min(1, "Ange förening."),
    team: z.string().trim().min(1, "Ange lag, till exempel P12 eller F2013."),
    role: z.string().trim(),
    phone: z
      .string()
      .trim()
      .min(1, "Ange telefonnummer.")
      .refine((value) => digitCount(value) >= 8, "Ange ett giltigt telefonnummer."),
    email: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || z.string().email().safeParse(value).success,
        "Ange en giltig e-postadress.",
      ),
    preferredContact: z.enum(["telefon", "epost"], {
      required_error: "Välj hur du vill bli kontaktad.",
    }),
    notes: z.string(),
    website: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.preferredContact === "epost" && !values.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Ange e-postadress om du vill bli kontaktad via e-post.",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: "",
  club: "",
  team: "",
  role: "",
  phone: "",
  email: "",
  preferredContact: "telefon",
  notes: "",
  website: "",
};

const CoachInterestButton = () => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const resetFlow = () => {
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
    form.reset(defaultValues);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (submitting) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      window.setTimeout(resetFlow, 200);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (submitting) return;
    if (values.website) {
      setSubmitted(true);
      return;
    }
    setSubmitError(null);
    setSubmitting(true);

    try {
      await submitCoachInterest({
        name: values.name,
        club: values.club,
        team: values.team,
        role: values.role,
        phone: values.phone,
        email: values.email,
        preferredContact: values.preferredContact,
        notes: values.notes.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      setSubmitError(
        code === "missing-config"
          ? "Formuläret är inte kopplat ännu. Mejla henrik@caseloidrottsmedicin.se så hör vi av oss."
          : "Kunde inte skicka intresseanmälan. Kontrollera din uppkoppling och försök igen.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className={goldCtaClass}
        onClick={() => setOpen(true)}
      >
        Prata med Henrik om upplägget
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          onOpenAutoFocus={(event) => {
            if (submitted) return;
            event.preventDefault();
            const dialog = event.currentTarget as HTMLElement | null;
            dialog?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
          }}
          onPointerDownOutside={(event) => {
            if (submitting) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (submitting) event.preventDefault();
          }}
          className="flex max-h-[min(90dvh,40rem)] w-[calc(100%-1.25rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg sm:rounded-lg max-sm:bottom-0 max-sm:top-auto max-sm:w-full max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl"
        >
          {submitted ? (
            <div className="px-5 pb-6 pr-14 pt-6 sm:px-6">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                Tack för ditt intresse!
              </DialogTitle>
              <DialogDescription className="mt-3 text-base leading-relaxed text-muted-foreground">
                Henrik kontaktar dig inom en arbetsdag för ett kort samtal om
                hur Caselo kan stötta laget.
              </DialogDescription>
              <Button
                type="button"
                variant="secondary"
                className="mt-6 min-h-11 shadow-[var(--shadow-button)]"
                onClick={() => handleOpenChange(false)}
              >
                Stäng
              </Button>
            </div>
          ) : (
            <>
              <div className="border-b border-border/60 px-5 pb-4 pt-6 pr-14 sm:px-6 sm:pr-14">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  Prata med Henrik om upplägget
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Fyll i dina uppgifter så kontaktar Henrik dig för ett kort,
                  förutsättningslöst samtal om hur Caselo kan stötta laget.
                </DialogDescription>
              </div>

              <Form {...form}>
                <form
                  className="flex min-h-0 flex-1 flex-col"
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                >
                  <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="coach-interest-website">Webbplats</label>
                      <input
                        id="coach-interest-website"
                        tabIndex={-1}
                        autoComplete="off"
                        {...form.register("website")}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Namn*</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="name"
                              aria-required="true"
                              disabled={submitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="club"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Förening*</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="organization"
                              aria-required="true"
                              disabled={submitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lag, exempelvis P12 eller F2013*</FormLabel>
                          <FormControl>
                            <Input aria-required="true" disabled={submitting} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Roll i laget, exempelvis tränare eller lagledare
                          </FormLabel>
                          <FormControl>
                            <Input disabled={submitting} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefonnummer*</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              autoComplete="tel"
                              inputMode="tel"
                              aria-required="true"
                              disabled={submitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-post</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              inputMode="email"
                              disabled={submitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jag vill helst bli kontaktad via</FormLabel>
                          <FormControl>
                            <RadioGroup
                              className="flex flex-col gap-1 sm:flex-row sm:gap-6"
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={submitting}
                            >
                              <label className="flex min-h-11 cursor-pointer items-center gap-2 font-normal">
                                <RadioGroupItem value="telefon" />
                                Telefon
                              </label>
                              <label className="flex min-h-11 cursor-pointer items-center gap-2 font-normal">
                                <RadioGroupItem value="epost" />
                                E-post
                              </label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Övrigt du vill att Henrik ska känna till (frivilligt)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-24 text-base md:text-sm"
                              disabled={submitting}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Ange inga uppgifter om enskilda spelares hälsa eller
                            skador.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-border/60 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
                    {submitError ? (
                      <p className="mb-3 text-sm font-medium text-destructive" role="alert">
                        {submitError}
                      </p>
                    ) : null}
                    <Button
                      type="submit"
                      variant="secondary"
                      className="min-h-11 w-full whitespace-normal shadow-[var(--shadow-button)] sm:w-auto"
                      disabled={submitting}
                      aria-busy={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Skickar…
                        </>
                      ) : (
                        "Skicka intresseanmälan"
                      )}
                    </Button>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      Genom att skicka formuläret godkänner du att Caselo
                      Idrottsmedicin kontaktar dig med anledning av din
                      förfrågan.
                    </p>
                  </div>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoachInterestButton;
