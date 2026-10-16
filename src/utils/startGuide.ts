const KEY = "czech-learning-start-guide-v1";

export interface StartGuideState {
  pronunciationSeen: boolean;
  phrasesSeen: boolean;
  dismissed: boolean;
}

const empty: StartGuideState = { pronunciationSeen: false, phrasesSeen: false, dismissed: false };

export const loadStartGuideState = (): StartGuideState => {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<StartGuideState>) } : empty;
  } catch {
    return empty;
  }
};

export const updateStartGuideState = (patch: Partial<StartGuideState>) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...loadStartGuideState(), ...patch }));
  } catch {
    // Сховище недоступне: підказка просто не запам'ятає стан.
  }
};
