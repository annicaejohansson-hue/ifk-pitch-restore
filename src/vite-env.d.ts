/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_FORMSPREE_FORM_ID?: string;
  readonly VITE_KADDIO_SNABBHET_FORSTA?: string;
  readonly VITE_KADDIO_SNABBHET_ATERTEST?: string;
  readonly VITE_KADDIO_FRISKVARD?: string;
  /** Kaddio calendar filter for Mariefred (segment under /cal/{filter}/…). */
  readonly VITE_KADDIO_MARIEFRED_CAL_FILTER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
