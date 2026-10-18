import { loadActiveNickname, normalizeNickname } from "./storage";
import { sanitizeSession, type PracticeSession } from "../data/practice";

const KEY = "czech-learning-practice-session-v1";

// Сесія зберігається окремо для кожного нікнейма (або гостя).
const profile = () => normalizeNickname(loadActiveNickname()).toLocaleLowerCase("uk-UA") || "__guest__";

const readAll = (): Record<string, unknown> => {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

const memory: Record<string, PracticeSession | null> = {};

export const loadPracticeSession = (): PracticeSession | null => {
  const key = profile();
  return key in memory ? memory[key] : sanitizeSession(readAll()[key]);
};

export const savePracticeSession = (session: PracticeSession | null) => {
  const key = profile();
  memory[key] = session;

  try {
    const all = readAll();

    if (session) {
      all[key] = session;
    } else {
      delete all[key];
    }

    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Сховище недоступне: сесія живе до перезавантаження.
  }
};
