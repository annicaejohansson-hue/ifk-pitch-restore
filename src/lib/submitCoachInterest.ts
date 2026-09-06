export type CoachInterestPayload = {
  name: string;
  club: string;
  team: string;
  role: string;
  phone: string;
  email: string;
  preferredContact: "telefon" | "epost";
  notes: string;
};

const FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID?.trim() ?? "";

export const isCoachInterestConfigured = () => FORM_ID.length > 0;

export async function submitCoachInterest(payload: CoachInterestPayload) {
  if (!isCoachInterestConfigured()) {
    throw new Error("missing-config");
  }

  const response = await fetch(`https://formspree.io/f/${FORM_ID}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _subject: "Intresseanmälan: Prata med Henrik om upplägget",
      källa: "För tränare och ledare",
      namn: payload.name,
      förening: payload.club,
      lag: payload.team,
      roll: payload.role || "Ej angiven",
      telefon: payload.phone,
      epost: payload.email || "Ej angiven",
      kontaktas_via: payload.preferredContact === "epost" ? "E-post" : "Telefon",
      övrigt: payload.notes || "—",
    }),
  });

  if (!response.ok) {
    throw new Error("submit-failed");
  }
}
