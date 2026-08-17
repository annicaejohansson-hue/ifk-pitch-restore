import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVisitor } from "@/context/VisitorContext";
import {
  getAnalyticsConsent,
  getMeasurementId,
  initAnalytics,
  setAnalyticsConsent,
  trackPageView,
  type AnalyticsConsent,
} from "@/lib/analytics";

const CookieConsent = () => {
  const { visitorType } = useVisitor();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() =>
    getAnalyticsConsent(),
  );
  const measurementId = getMeasurementId();

  if (!measurementId || consent !== null) return null;

  const choose = (value: AnalyticsConsent) => {
    setAnalyticsConsent(value);
    setConsent(value);
    if (value === "granted") {
      initAnalytics(visitorType);
      trackPageView(
        `${window.location.pathname}${window.location.search}`,
        visitorType,
      );
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto flex max-w-7xl flex-col gap-3 px-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="min-w-0 text-sm leading-snug text-foreground">
          Vi använder cookies för att se hur sajten används och om Boka tid
          klickas. Du kan tacka nej.
        </p>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full whitespace-normal sm:w-auto"
            onClick={() => choose("denied")}
          >
            Avböj
          </Button>
          <Button
            type="button"
            className="h-11 w-full whitespace-normal sm:w-auto"
            onClick={() => choose("granted")}
          >
            Godkänn
          </Button>
        </div>
      </div>
    </div>
  );
};

const AnalyticsTracker = () => {
  const location = useLocation();
  const { visitorType } = useVisitor();
  const path = `${location.pathname}${location.search}`;

  useEffect(() => {
    if (getAnalyticsConsent() !== "granted") return;
    initAnalytics(visitorType);
  }, [visitorType]);

  useEffect(() => {
    if (getAnalyticsConsent() !== "granted") return;
    const timeoutId = window.setTimeout(() => {
      trackPageView(path, visitorType);
    }, 80);
    return () => window.clearTimeout(timeoutId);
  }, [path, visitorType]);

  return null;
};

const Analytics = () => (
  <>
    <AnalyticsTracker />
    <CookieConsent />
  </>
);

export default Analytics;
