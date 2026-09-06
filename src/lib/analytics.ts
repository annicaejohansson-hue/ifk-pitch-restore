const CONSENT_KEY = "caselo-analytics-consent";
const SCRIPT_ID = "ga4-gtag";

export type AnalyticsConsent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const DEFAULT_MEASUREMENT_ID = "G-PXRM4N9YSH";

export const getMeasurementId = () => {
  const fromEnv = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
  return fromEnv.startsWith("G-") && !fromEnv.includes("XXXX")
    ? fromEnv
    : DEFAULT_MEASUREMENT_ID;
};

export const getAnalyticsConsent = (): AnalyticsConsent | null => {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
};

export const setAnalyticsConsent = (consent: AnalyticsConsent) => {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Ignore storage errors (private mode, etc.)
  }
};

const ensureGtag = () => {
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // Google's snippet pushes `arguments`, not a rest-parameter array.
      window.dataLayer.push(arguments);
    };
  }
};

let scriptRequested = false;

const setVisitorTypeDimension = (visitorType?: string) => {
  if (!visitorType || typeof window.gtag !== "function") return;
  window.gtag("set", "user_properties", { visitor_type: visitorType });
};

export const initAnalytics = (visitorType?: string) => {
  const measurementId = getMeasurementId();
  if (!measurementId || getAnalyticsConsent() !== "granted") return;

  ensureGtag();

  if (!scriptRequested) {
    scriptRequested = true;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }

  setVisitorTypeDimension(visitorType);
};

type EventParams = {
  page_path?: string;
  page_title?: string;
  page_location?: string;
  visitor_type?: string;
};

const canSend = () =>
  Boolean(getMeasurementId()) &&
  getAnalyticsConsent() === "granted" &&
  typeof window.gtag === "function";

export const trackPageView = (
  path: string,
  visitorType?: string,
) => {
  if (!canSend()) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
    visitor_type: visitorType,
  } satisfies EventParams);
};

/**
 * GA4 events used on the site (consent-gated):
 * - page_view: page view
 * - boka_tid: click on a booking CTA (BookingLink, including landing-page primary buttons)
 * - kontakt_epost: click on a mailto: link
 * - kontakt_lank: click on an internal contact-page link
 *
 * FAQ expand is not measured elsewhere, so landing-page FAQ opens are not tracked.
 */
export const trackBokaTid = (visitorType?: string) => {
  if (!canSend()) return;
  window.gtag("event", "boka_tid", {
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
    visitor_type: visitorType,
  } satisfies EventParams);
};

export const trackKontaktEpost = (visitorType?: string) => {
  if (!canSend()) return;
  window.gtag("event", "kontakt_epost", {
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
    visitor_type: visitorType,
  } satisfies EventParams);
};

export const trackKontaktLank = (visitorType?: string) => {
  if (!canSend()) return;
  window.gtag("event", "kontakt_lank", {
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
    visitor_type: visitorType,
  } satisfies EventParams);
};
