import { useSyncExternalStore } from "react";

export type AnswerMode = "choice" | "typing" | "mixed";

const KEY = "czech-learning-answer-mode-v1";
const EVENT = "czech-learning-answer-mode";

const read = (): AnswerMode => {
  try {
    const stored = window.localStorage.getItem(KEY);
    return stored === "typing" || stored === "choice" ? stored : memoryMode;
  } catch {
    return memoryMode;
  }
};

// Запасний варіант, коли localStorage недоступний.
let memoryMode: AnswerMode = "mixed";

export const setAnswerMode = (mode: AnswerMode) => {
  memoryMode = mode;
  try {
    window.localStorage.setItem(KEY, mode);
  } catch {
    // Сховище недоступне: режим діє до перезавантаження.
  }
  window.dispatchEvent(new Event(EVENT));
};

const subscribe = (listener: () => void) => {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};

export function useAnswerMode(): AnswerMode {
  return useSyncExternalStore(subscribe, read, () => "mixed");
}
