/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_FORMSPREE_FORM_ID?: string;
  readonly VITE_KADDIO_SNABBHET_FORSTA?: string;
  readonly VITE_KADDIO_SNABBHET_ATERTEST?: string;
  readonly VITE_KADDIO_FRISKVARD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
