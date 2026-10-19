import { useSyncExternalStore } from "react";
import { getAuthState } from "./auth";
import { supabase } from "./supabase";

// Статистика відвідувань збирається лише після згоди користувача.
export type Consent = "granted" | "denied" | null;

const CONSENT_KEY = "czech-learning-analytics-consent-v1";
const VISITOR_KEY = "czech-learning-visitor-id-v1";
const SESSION_KEY = "czech-learning-session-id-v1";
const CONSENT_EVENT = "czech-learning-consent-changed";

const makeId = (): string =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
        const random = Math.floor(Math.random() * 16);
        return (char === "x" ? random : (random & 0x3) | 0x8).toString(16);
      });

const readStorage = (storage: () => Storage, key: string): string | null => {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (storage: () => Storage, key: string, value: string) => {
  try {
    storage().setItem(key, value);
  } catch {
    // Сховище недоступне: ідентифікатор живе лише в пам'яті сторінки.
  }
};

let memoryVisitor = "";
let memorySession = "";

const getId = (storage: () => Storage, key: string, memory: "visitor" | "session"): string => {
  const stored = readStorage(storage, key);
  if (stored) {
    return stored;
  }

  const current = memory === "visitor" ? memoryVisitor : memorySession;
  const id = current || makeId();
  writeStorage(storage, key, id);

  if (memory === "visitor") {
    memoryVisitor = id;
  } else {
    memorySession = id;
  }

  return id;
};

export const getConsent = (): Consent => {
  const value = readStorage(() => window.localStorage, CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
};

export const setConsent = (consent: Exclude<Consent, null>) => {
  writeStorage(() => window.localStorage, CONSENT_KEY, consent);
  window.dispatchEvent(new Event(CONSENT_EVENT));
};

export const useConsent = (): Consent =>
  useSyncExternalStore(
    (listener) => {
      window.addEventListener(CONSENT_EVENT, listener);
      window.addEventListener("storage", listener);
      return () => {
        window.removeEventListener(CONSENT_EVENT, listener);
        window.removeEventListener("storage", listener);
      };
    },
    getConsent,
    () => null,
  );

const deviceClass = () => (window.innerWidth < 768 ? "телефон" : window.innerWidth < 1100 ? "планшет" : "комп'ютер");

/** Відправляє подію статистики. Без згоди, без мережі чи з помилкою нічого не робить і не заважає застосунку. */
export const track = (type: "pageview" | "answer" | "signin", path?: string, meta: Record<string, unknown> = {}) => {
  if (typeof window === "undefined" || getConsent() !== "granted") {
    return;
  }

  const extra = type === "pageview" ? { device: deviceClass(), lang: (navigator.language || "").slice(0, 2).toLowerCase() } : {};

  void Promise.resolve(
    supabase.from("events").insert({
      visitor_id: getId(() => window.localStorage, VISITOR_KEY, "visitor"),
      session_id: getId(() => window.sessionStorage, SESSION_KEY, "session"),
      user_id: getAuthState().session?.user.id ?? null,
      type,
      path: path ? path.slice(0, 200) : null,
      meta: { ...extra, ...meta },
    }),
  ).catch(() => undefined);
};
