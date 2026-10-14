import { useCallback, useSyncExternalStore } from "react";

// Озвучення через Web Speech API браузера. Голоси залежать від пристрою, тому стан «є чеський голос»
// зберігаємо в одному спільному сховищі, щоб сотні кнопок не додавали по слухачу кожна.

const isSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

const findCzechVoice = (): SpeechSynthesisVoice | undefined => {
  if (!isSupported()) {
    return undefined;
  }

  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().replace("_", "-").startsWith("cs"));
};

type Listener = () => void;

const listeners = new Set<Listener>();
let czechVoiceAvailable = false;
let initialized = false;

const refreshVoices = () => {
  const next = Boolean(findCzechVoice());

  if (next !== czechVoiceAvailable) {
    czechVoiceAvailable = next;
    listeners.forEach((listener) => listener());
  }
};

const initialize = () => {
  if (initialized || !isSupported()) {
    return;
  }

  initialized = true;
  refreshVoices();
  // Список голосів у багатьох браузерах (Chrome, Firefox) завантажується асинхронно.
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
};

const subscribe = (listener: Listener) => {
  initialize();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => czechVoiceAvailable;
const getServerSnapshot = () => false;

export function useSpeech() {
  const hasCzechVoice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const speak = useCallback((text: string, callbacks?: { onEnd?: () => void }) => {
    const cleaned = text.trim();

    if (!cleaned || !isSupported()) {
      callbacks?.onEnd?.();
      return;
    }

    const synth = window.speechSynthesis;

    // Перериваємо попереднє озвучення, щоб натискання не накопичувались у черзі.
    if (synth.speaking || synth.pending) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = "cs-CZ";

    const voice = findCzechVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.85; // трохи повільніше, зручніше для початківця
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onerror = () => callbacks?.onEnd?.();

    synth.speak(utterance);
  }, []);

  return { speak, hasCzechVoice };
}
