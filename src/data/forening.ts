/** Hub and audience pages for club collaboration. */
export const SAMARBETE_PATH = "/samarbete";
export const SAMARBETE_FORENING_PATH = "/samarbete/forening";
export const SAMARBETE_LAG_PATH = "/samarbete/lag";

/** Former URLs – redirect to the current samarbete paths. */
export const FORENING_LEGACY_REDIRECTS = [
  { from: "/forening", to: SAMARBETE_PATH },
  { from: "/forening/klubb", to: SAMARBETE_FORENING_PATH },
  { from: "/samarbete/klubb", to: SAMARBETE_FORENING_PATH },
  { from: "/forening/tranare", to: SAMARBETE_LAG_PATH },
  { from: "/samarbete/tranare", to: SAMARBETE_LAG_PATH },
  { from: "/forening/spelare", to: "/boka" },
] as const;
