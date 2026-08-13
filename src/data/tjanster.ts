export const injuryImageUrl =
  "https://simplifaster.com/wp-content/uploads/2025/06/Female-Soccer-Striker.jpg";
export const heelCupImageUrl =
  "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80";
export const performanceImageUrl =
  "https://nwscdn.com/media/wysiwyg/forza/Agility-football-training-ladder.jpg?odnHeight=117&odnWidth=117&odnBg=FFFFFF";

export type ServiceSlug =
  | "smarta-och-skador"
  | "halkoppsinlagg"
  | "fysisk-prestation";

export type ServiceSection = {
  title: string;
  paragraphs: string[];
};

export type ServiceContent = {
  slug: ServiceSlug;
  path: string;
  /** Full title used on Tjänster overview + detail pages */
  title: string;
  /** Shorter title used on homepage service cards */
  cardTitle: string;
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
  /** When true, sections render as an ordered list (prestationskedja) */
  numberedSections?: boolean;
};

export const services: ServiceContent[] = [
  {
    slug: "smarta-och-skador",
    path: "/tjanster/smarta-och-skador",
    title: "Bedömning och behandling av smärta och skador",
    cardTitle: "Bedömning och behandling vid skada",
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
    slug: "halkoppsinlagg",
    path: "/tjanster/halkoppsinlagg",
    title: "Tillverkning av skräddarsydda hälkoppsinlägg",
    cardTitle: "Skräddarsydda hälkoppsinlägg",
    cardDescription:
      "Personligt utformade hälkoppsinlägg som ger stöd och avlastning vid hälsmärta, hälsporre och Severs skada. Vi undersöker, formar och anpassar inlägget efter dig – för både vuxna och barn.",
    overviewBlurb:
      "Personligt utformade hälkoppsinlägg för vuxna och barn – stöd, avlastning och bättre komfort i aktivitet.",
    metaDescription:
      "Skräddarsydda hälkoppsinlägg för vuxna och barn hos Caselo Idrottsmedicin – undersökning och tillverkning efter dina behov.",
    image: heelCupImageUrl,
    imageAlt: "Skräddarsydda hälkoppsinlägg",
    accentClass: "bg-[hsl(210_48%_34%)]",
    imagePosition: "left",
    intro: [
      "Ett personligt utformat hälkoppsinlägg ger stöd där du behöver det – för att minska belastningen på hälen, dämpa smärta och göra det lättare att gå, springa och vara aktiv. Vi tillverkar inlägg för både vuxna och barn efter undersökning av din fot och dina behov.",
    ],
    sections: [
      {
        title: "Vuxen",
        paragraphs: [
          "Vid ett nybesök gör du hälkoppsinlägg för första gången. Besöket omfattar undersökning och tillverkning av personligt utformade inlägg, formade efter din häl för stöd, avlastning och bättre komfort i aktivitet.",
          "Behöver du fler inlägg senare bokar du ett återbesök – till exempel till ett andra par skor – efter att du redan genomfört ett nybesök.",
        ],
      },
      {
        title: "Barn",
        paragraphs: [
          "Barn får samma omsorgsfulla undersökning och tillverkning av skräddarsydda hälkoppsinlägg. Vid nybesök formas inlägget efter barnets häl för att ge stöd, minska belastning och underlätta lek, idrott och vardagsrörelse.",
          "Ett återbesök används när ni tidigare gjort nybesök och behöver ytterligare personligt utformade inlägg, till exempel när barnet växer eller behöver inlägg till fler skor.",
        ],
      },
    ],
  },
  {
    slug: "fysisk-prestation",
    path: "/tjanster/fysisk-prestation",
    title: "Test och träning för ökad fysisk prestation",
    cardTitle: "Snabbare och starkare prestation",
    cardDescription:
      "Vill du bli snabbare och starkare? Vi hjälper dig hitta vad som håller dig tillbaka och bygger ett träningsupplägg som tar dig vidare – mer kraft, mer snabbhet och hållbar prestation.",
    overviewBlurb:
      "Från objektiv testning till konkret träningsplan och uppföljning – så att du vet vad som fungerar och vad som behöver prioriteras.",
    metaDescription:
      "Test och träning för ökad fysisk prestation hos Caselo Idrottsmedicin – kapacitetstest, personligt träningsupplägg och uppföljning.",
    image: performanceImageUrl,
    imageAlt: "Test och träning för ökad fysisk prestation",
    accentClass: "bg-[hsl(210_42%_52%)]",
    imagePosition: "left",
    intro: [
      "Vill du träna mer träffsäkert och se hur din fysik utvecklas över tid? Vår prestationskedja tar dig från objektiv testning till konkret träningsplan och uppföljning – så att du vet vad som fungerar och vad som behöver prioriteras härnäst.",
    ],
    numberedSections: true,
    sections: [
      {
        title: "Steg 1: Test och analys av fysisk kapacitet",
        paragraphs: [
          "Vi kartlägger din acceleration, snabbhet, hoppförmåga och/eller styrka utifrån dina målsättningar. Efter besöket analyseras resultaten och du får en personlig prestationsprofil med dina styrkor och viktigaste utvecklingsområden – en tydlig utgångspunkt för fortsatt träning.",
        ],
      },
      {
        title: "Steg 2: Personligt träningsupplägg",
        paragraphs: [
          "Vi går igenom din prestationsprofil och omsätter resultaten till konkreta träningsprioriteringar. Du får ett individuellt träningsupplägg och praktisk vägledning i de viktigaste övningarna, så att du kan träna vidare med fokus på det som ger mest effekt för dig.",
        ],
      },
      {
        title: "Steg 3: Uppföljning för att mäta din utveckling",
        paragraphs: [
          "Efter träningsperioden upprepar vi relevanta tester och jämför med dina tidigare resultat. Du ser vad som har utvecklats och får nya rekommendationer inför nästa träningsperiod – så att utvecklingen fortsätter på ett medvetet sätt.",
        ],
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((service) => service.slug === slug);
}
