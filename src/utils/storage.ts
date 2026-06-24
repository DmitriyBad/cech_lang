export interface StoredProgress {
  learnedVerbIds: number[];
  correctAnswers: number;
  wrongAnswers: number;
  mistakesByVerbId: Record<number, number>;
}

type ProgressByNickname = Record<string, StoredProgress>;

const ACTIVE_NICKNAME_KEY = "czech-learning-active-nickname-v1";
const PROGRESS_BY_NICKNAME_KEY = "czech-learning-progress-by-nickname-v1";
const PROGRESS_EVENT = "czech-learning-progress-updated";

export const emptyProgress: StoredProgress = {
  learnedVerbIds: [],
  correctAnswers: 0,
  wrongAnswers: 0,
  mistakesByVerbId: {},
};

const hasStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

export const normalizeNickname = (nickname: string) => nickname.trim().replace(/\s+/g, " ");

const nicknameKey = (nickname: string) => normalizeNickname(nickname).toLocaleLowerCase("uk-UA");

const normalizeProgress = (value: Partial<StoredProgress> | null | undefined): StoredProgress => ({
  learnedVerbIds: Array.isArray(value?.learnedVerbIds) ? value.learnedVerbIds : [],
  correctAnswers: Number.isFinite(value?.correctAnswers) ? Number(value?.correctAnswers) : 0,
  wrongAnswers: Number.isFinite(value?.wrongAnswers) ? Number(value?.wrongAnswers) : 0,
  mistakesByVerbId:
    value?.mistakesByVerbId && typeof value.mistakesByVerbId === "object"
      ? value.mistakesByVerbId
      : {},
});

const loadProgressStore = (): ProgressByNickname => {
  if (!hasStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_BY_NICKNAME_KEY);
    const parsed = raw ? (JSON.parse(raw) as ProgressByNickname) : {};

    return Object.fromEntries(
      Object.entries(parsed).map(([nickname, progress]) => [nickname, normalizeProgress(progress)]),
    );
  } catch {
    return {};
  }
};

const saveProgressStore = (store: ProgressByNickname) => {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(PROGRESS_BY_NICKNAME_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
};

export const loadActiveNickname = () => {
  if (!hasStorage()) {
    return "";
  }

  return normalizeNickname(window.localStorage.getItem(ACTIVE_NICKNAME_KEY) ?? "");
};

export const saveActiveNickname = (nickname: string) => {
  if (!hasStorage()) {
    return "";
  }

  const normalizedNickname = normalizeNickname(nickname);

  if (normalizedNickname) {
    window.localStorage.setItem(ACTIVE_NICKNAME_KEY, normalizedNickname);
  } else {
    window.localStorage.removeItem(ACTIVE_NICKNAME_KEY);
  }

  window.dispatchEvent(new Event(PROGRESS_EVENT));
  return normalizedNickname;
};

export const loadProgress = (nickname = loadActiveNickname()): StoredProgress => {
  const normalizedNickname = normalizeNickname(nickname);

  if (!normalizedNickname) {
    return emptyProgress;
  }

  return normalizeProgress(loadProgressStore()[nicknameKey(normalizedNickname)]);
};

export const saveProgress = (nickname: string, progress: StoredProgress) => {
  const normalizedNickname = normalizeNickname(nickname);

  if (!normalizedNickname) {
    return;
  }

  saveProgressStore({
    ...loadProgressStore(),
    [nicknameKey(normalizedNickname)]: normalizeProgress(progress),
  });
};

export const resetStoredProgress = (nickname: string) => {
  const normalizedNickname = normalizeNickname(nickname);

  if (!normalizedNickname) {
    return;
  }

  const store = loadProgressStore();
  delete store[nicknameKey(normalizedNickname)];
  saveProgressStore(store);
};

export const subscribeToProgress = (listener: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(PROGRESS_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(PROGRESS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};
