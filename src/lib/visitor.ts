import { isPartnerId, type PartnerId } from "@/lib/partners";

export type VisitorType = "general" | PartnerId;

export const VISITOR_STORAGE_KEY = "caselo-visitor-type";
export const VISITOR_CHANGE_EVENT = "caselo-visitor-change";

export function getVisitorType(): VisitorType {
  try {
    const stored = sessionStorage.getItem(VISITOR_STORAGE_KEY);
    if (isPartnerId(stored)) return stored;
  } catch {
    // sessionStorage may be unavailable (private mode / SSR)
  }
  return "general";
}

export function setVisitorType(type: VisitorType): void {
  try {
    if (type === "general") {
      sessionStorage.removeItem(VISITOR_STORAGE_KEY);
    } else {
      sessionStorage.setItem(VISITOR_STORAGE_KEY, type);
    }
  } catch {
    // Ignore write failures; in-memory listeners still update for this page
  }

  window.dispatchEvent(new CustomEvent(VISITOR_CHANGE_EVENT, { detail: type }));
}
