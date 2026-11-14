import performanceImage from "@/assets/IMG_9118.jpg";
import { OFFER_PATHS } from "@/data/erbjudanden";

export const injuryImageUrl =
  "https://simplifaster.com/wp-content/uploads/2025/06/Female-Soccer-Striker.jpg";
export const heelCupImageUrl =
  "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80";
export const performanceImageUrl = performanceImage;

/** Sidan Personlig träning (tidigare /erbjudanden/friskvard). */
export const PERSONAL_TRAINING_PATH = OFFER_PATHS.friskvard;

/** Tidigare tjänstesida med Steg 1–3; omdirigeras till PERSONAL_TRAINING_PATH. */
export const PERFORMANCE_LEGACY_PATH = "/tjanster/fysisk-prestation";

export const HEEL_CUP_SERVICE_PATH = "/tjanster/halkoppar-barn";

/** Former public URLs for the heel-cup service – redirect to HEEL_CUP_SERVICE_PATH. */
export const HEEL_CUP_LEGACY_PATHS = [
  "/halkoppar-barn",
  "/tjanster/halkoppsinlagg",
  "/tjanster/halkoppsinlag",
] as const;

export type ServiceSlug =
  | "smarta-och-skador"
  | "halkoppar-barn"
  | "personlig-traning";

export type ServiceSection = {
  title: string;
  paragraphs: string[];
};

export type ServiceContent = {
  slug: ServiceSlug;
  path: string;
  /** Full title used on Tjänster overview + detail pages */
  title: string;
  /** One or two lines used on the Tjänster overview cards */
  titleLines: [string] | [string, string];
  /** Shorter title used on homepage service cards */
  cardTitle: string;
  /** Optional homepage card title for small screens */
  cardTitleMobile?: string;
  cardDescription: string;
  /** Short blurb for overview cards */
  overviewBlurb: string;
  metaDescription: string;
  image: string;
  imageAlt: string;
  /** Tailwind class for the accent bar */
  accentClass: string;
  imagePosition: "left" | "right";
  intro: string[];
  sections: ServiceSection[];
  /** When true, sections render as an ordered list */
  numberedSections?: boolean;
};

export const services: ServiceContent[] = [
  {
    slug: "smarta-och-skador",
    path: "/tjanster/smarta-och-skador",
    title: "Bedömning och behandling av smärta och skador",
    titleLines: ["Bedömning och behandling", "av smärta och skador"],
    cardTitle: "Bedömning och behandling vid skada",
    cardTitleMobile: "Bedömning och behandling",
    cardDescription:
      "När du har ont eller är skadad hjälper vi dig med tydlig bedömning, diagnos och individuellt anpassad behandling. Målet är att minska besvären och få dig tillbaka till idrott, arbetsliv eller rörelse i vardagen – tryggt och steg för steg.",
    overviewBlurb:
      "Tydlig bedömning, diagnos och individuellt anpassad behandling när något gör ont eller begränsar dig i träning, arbete eller vardag.",
    metaDescription:
      "Bedömning och behandling av smärta och skador hos Caselo Idrottsmedicin – nybesök och återbesök med rehabilitering och belastningsråd.",
    image: injuryImageUrl,
    imageAlt: "Bedömning och behandling av smärta och skador",
    accentClass: "bg-primary",
    imagePosition: "left",
    intro: [
      "När något gör ont eller begränsar dig i träning, arbete eller vardag behöver du en tydlig bild av vad som är fel – och en plan framåt. Vi undersöker besväret, ställer en bedömning och arbetar tillsammans med behandling, rehabilitering och belastningsråd som passar din situation.",
    ],
    sections: [
      {
        title: "Nybesök",
        paragraphs: [
          "Nybesök bokas när du kommer första gången för ett besvär. Tjänsten är för dig som har ont eller är skadad och vill få hjälp med bedömning och diagnos, samt individuellt anpassade åtgärder för att minska besvären och hjälpa dig återgå till idrott, arbete eller vardag. Besöket kan innehålla behandling, rehabiliteringsövningar, träningsupplägg och råd om belastning – så att du vet vad du ska göra mellan besöken.",
        ],
      },
      {
        title: "Återbesök",
        paragraphs: [
          "Återbesök bokas när du redan har undersökts hos Caselo Idrottsmedicin för besväret du söker för. Här följer vi upp hur du svarat på tidigare åtgärder, justerar behandlingen och tar nästa steg i din rehabilitering så att framstegen håller i sig.",
        ],
      },
    ],
  },
  {
    slug: "halkoppar-barn",
    path: HEEL_CUP_SERVICE_PATH,
    title: "Hälkoppsinlägg för barn med ont i hälen",
    titleLines: [
      "Hälkoppsinlägg för barn",
      "och vuxna med ont i\u00a0hälen",
    ],
    cardTitle: "Hälkoppsinlägg vid ont i hälen",
    cardDescription:
      "Har ditt barn ont i hälen vid fotboll eller annan idrott? Efter fysioterapeutisk bedömning kan individuellt anpassade hälkoppsinlägg användas för att avlasta hälen när det är lämpligt.",
    overviewBlurb:
      "Fysioterapeutisk bedömning och, när det är lämpligt, individuellt anpassade hälkoppsinlägg för barn och unga med hälsmärta.",
    metaDescription:
      "Har ditt barn ont i hälen vid fotboll eller annan idrott? Hos Caselo i Danderyd får barnet en fysioterapeutisk bedömning och individuellt anpassade hälkoppsinlägg när det är lämpligt.",
    image: "/halkoppar/20260929_141824.jpg",
    imageAlt:
      "Fotbollsskor på planen med ett hälkoppsinlägg bredvid skorna, vid Danderyd Arena",
    accentClass: "bg-[hsl(210_48%_34%)]",
    imagePosition: "left",
    intro: [
      "Hälsmärta är vanligt hos växande barn som spelar fotboll eller ägnar sig åt annan idrott med mycket löpning och hopp. Hos Caselo får barnet en fysioterapeutisk bedömning och individuellt anpassade hälkoppsinlägg som kan avlasta hälen.",
    ],
    sections: [],
  },
  {
    // Egen sida utanför /tjanster: kortet länkar till sidan Personlig träning.
    slug: "personlig-traning",
    path: PERSONAL_TRAINING_PATH,
    title: "Personlig träning",
    titleLines: ["Personlig träning"],
    cardTitle: "Snabbare och starkare prestation",
    cardTitleMobile: "Starkare prestation",
    cardDescription:
      "Vill du bli snabbare och starkare? Vi hjälper dig hitta vad som håller dig tillbaka och bygger ett träningsupplägg som tar dig vidare – mer kraft, mer snabbhet och hållbar prestation.",
    overviewBlurb:
      "Träna med leg. fysioterapeut Henrik Nilsson – i din takt, efter din idrott. Välj mellan personliga träningspass och snabbhetspaket med laserportar.",
    metaDescription:
      "Personlig träning hos Caselo Idrottsmedicin – individuella träningspass och snabbhetspaket med laserportar.",
    image: performanceImageUrl,
    imageAlt: "Henrik Nilsson guidar individuell träning på knä på Danderyd Arena",
    accentClass: "bg-[hsl(210_42%_52%)]",
    imagePosition: "left",
    intro: [],
    sections: [],
  },
];

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((service) => service.slug === slug);
}

export function isLegacyHeelCupSlug(slug: string | undefined): boolean {
  return slug === "halkoppsinlagg" || slug === "halkoppsinlag";
}
