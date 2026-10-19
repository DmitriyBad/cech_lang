import { normalizeCard, type SrsCard } from "./srs";

export interface ModuleProgress {
  completedItemIds: string[];
  correctAnswers: number;
  wrongAnswers: number;
  mistakesByItemId: Record<string, number>;
}

export interface StoredProgress {
  learnedVerbIds: number[];
  correctAnswers: number;
  wrongAnswers: number;
  mistakesByVerbId: Record<number, number>;
  moduleProgress: Record<string, ModuleProgress>;
  /** Інтервальне повторення: ключ «v:12» (дієслово), «n:5» (іменник), «l:plural-masc-animate» (урок). */
  srs: Record<string, SrsCard>;
}

type ProgressByNickname = Record<string, StoredProgress>;

const ACTIVE_NICKNAME_KEY = "czech-learning-active-nickname-v1";
const PROGRESS_BY_NICKNAME_KEY = "czech-learning-progress-by-nickname-v1";
const PROGRESS_EVENT = "czech-learning-progress-updated";

export const emptyModuleProgress: ModuleProgress = {
  completedItemIds: [],
  correctAnswers: 0,
  wrongAnswers: 0,
  mistakesByItemId: {},
};

export const emptyProgress: StoredProgress = {
  learnedVerbIds: [],
  correctAnswers: 0,
  wrongAnswers: 0,
  mistakesByVerbId: {},
  moduleProgress: {},
  srs: {},
};

const hasStorage = () => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

export const normalizeNickname = (nickname: string) => nickname.trim().replace(/\s+/g, " ");

const nicknameKey = (nickname: string) => normalizeNickname(nickname).toLocaleLowerCase("uk-UA");

// Без нікнейма прогрес зберігається в профілі «гість». Ключ службовий: користувач не може його вибрати.
export const GUEST_PROFILE_KEY = "__guest__";

const isReservedNickname = (nickname: string) => nicknameKey(nickname) === GUEST_PROFILE_KEY;

const profileKey = (nickname: string) => nicknameKey(nickname) || GUEST_PROFILE_KEY;

const hasActivity = (progress: StoredProgress) =>
  progress.learnedVerbIds.length > 0 ||
  progress.correctAnswers + progress.wrongAnswers > 0 ||
  Object.values(progress.moduleProgress).some(
    (module) => module.completedItemIds.length > 0 || module.correctAnswers + module.wrongAnswers > 0,
  );

const normalizeModuleProgress = (value: Partial<ModuleProgress> | null | undefined): ModuleProgress => ({
  completedItemIds: Array.isArray(value?.completedItemIds) ? value.completedItemIds.map(String) : [],
  correctAnswers: Number.isFinite(value?.correctAnswers) ? Number(value?.correctAnswers) : 0,
  wrongAnswers: Number.isFinite(value?.wrongAnswers) ? Number(value?.wrongAnswers) : 0,
  mistakesByItemId:
    value?.mistakesByItemId && typeof value.mistakesByItemId === "object"
      ? value.mistakesByItemId
      : {},
});

export const normalizeProgress = (value: Partial<StoredProgress> | null | undefined): StoredProgress => ({
  learnedVerbIds: Array.isArray(value?.learnedVerbIds) ? value.learnedVerbIds : [],
  correctAnswers: Number.isFinite(value?.correctAnswers) ? Number(value?.correctAnswers) : 0,
  wrongAnswers: Number.isFinite(value?.wrongAnswers) ? Number(value?.wrongAnswers) : 0,
  mistakesByVerbId:
    value?.mistakesByVerbId && typeof value.mistakesByVerbId === "object"
      ? value.mistakesByVerbId
      : {},
  moduleProgress:
    value?.moduleProgress && typeof value.moduleProgress === "object"
      ? Object.fromEntries(
          Object.entries(value.moduleProgress).map(([moduleId, progress]) => [
            moduleId,
            normalizeModuleProgress(progress),
          ]),
        )
      : {},
  srs:
    value?.srs && typeof value.srs === "object"
      ? Object.fromEntries(
          Object.entries(value.srs)
            .map(([key, card]) => [key, normalizeCard(card)] as const)
            .filter((entry): entry is readonly [string, SrsCard] => entry[1] !== null),
        )
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

  try {
    window.localStorage.setItem(PROGRESS_BY_NICKNAME_KEY, JSON.stringify(store));
  } catch {
    // Приватний режим або переповнене сховище: не валимо застосунок.
    return;
  }

  window.dispatchEvent(new Event(PROGRESS_EVENT));
};

export const loadActiveNickname = () => {
  if (!hasStorage()) {
    return "";
  }

  try {
    return normalizeNickname(window.localStorage.getItem(ACTIVE_NICKNAME_KEY) ?? "");
  } catch {
    return "";
  }
};

export const saveActiveNickname = (nickname: string) => {
  if (!hasStorage()) {
    return "";
  }

  // Службова назва профілю гостя не може бути нікнеймом.
  const normalizedNickname = isReservedNickname(nickname) ? "" : normalizeNickname(nickname);

  try {
    if (normalizedNickname) {
      window.localStorage.setItem(ACTIVE_NICKNAME_KEY, normalizedNickname);
    } else {
      window.localStorage.removeItem(ACTIVE_NICKNAME_KEY);
    }
  } catch {
    return normalizedNickname;
  }

  window.dispatchEvent(new Event(PROGRESS_EVENT));
  return normalizedNickname;
};

export const loadProgress = (nickname = loadActiveNickname()): StoredProgress =>
  normalizeProgress(loadProgressStore()[profileKey(nickname)]);

export const saveProgress = (nickname: string, progress: StoredProgress) => {
  saveProgressStore({
    ...loadProgressStore(),
    [profileKey(nickname)]: normalizeProgress(progress),
  });
};

export const resetStoredProgress = (nickname: string) => {
  const store = loadProgressStore();
  delete store[profileKey(nickname)];
  saveProgressStore(store);
};

/**
 * Переносить прогрес гостя в профіль нікнейма, якщо цей профіль ще порожній (нового користувача).
 * Якщо профіль нікнейма вже існує, нічого не чіпаємо, щоб не перезаписати чужий прогрес.
 * Повертає true, коли прогрес перенесено.
 */
export const adoptGuestProgress = (nickname: string): boolean => {
  const key = nicknameKey(nickname);

  if (!key || key === GUEST_PROFILE_KEY) {
    return false;
  }

  const store = loadProgressStore();
  const guest = store[GUEST_PROFILE_KEY];

  if (!guest || store[key] || !hasActivity(guest)) {
    return false;
  }

  const { [GUEST_PROFILE_KEY]: _guest, ...rest } = store;
  saveProgressStore({ ...rest, [key]: guest });
  return true;
};

const maxRecord = <K extends string>(a: Record<K, number>, b: Record<K, number>): Record<K, number> => {
  const result = { ...a };
  for (const key of Object.keys(b) as K[]) {
    result[key] = Math.max(result[key] ?? 0, b[key]);
  }
  return result;
};

/**
 * Зливає прогрес із двох пристроїв (або гостя й акаунта) без втрати даних:
 * вивчені слова об'єднуються, лічильники беруться більші, для кожної картки повторення береться свіжіша.
 * Лічильники відповідей наближені: точно скласти їх неможливо, бо історія не зберігається.
 */
export const mergeProgress = (a: StoredProgress, b: StoredProgress): StoredProgress => {
  const moduleIds = new Set([...Object.keys(a.moduleProgress), ...Object.keys(b.moduleProgress)]);
  const moduleProgress: Record<string, ModuleProgress> = {};

  for (const id of moduleIds) {
    const left = a.moduleProgress[id] ?? emptyModuleProgress;
    const right = b.moduleProgress[id] ?? emptyModuleProgress;
    moduleProgress[id] = {
      completedItemIds: Array.from(new Set([...left.completedItemIds, ...right.completedItemIds])),
      correctAnswers: Math.max(left.correctAnswers, right.correctAnswers),
      wrongAnswers: Math.max(left.wrongAnswers, right.wrongAnswers),
      mistakesByItemId: maxRecord(left.mistakesByItemId, right.mistakesByItemId),
    };
  }

  const srs: Record<string, SrsCard> = { ...a.srs };
  for (const [key, card] of Object.entries(b.srs)) {
    const existing = srs[key];
    srs[key] = !existing || card.lastDay > existing.lastDay ? card : existing;
  }

  return {
    learnedVerbIds: Array.from(new Set([...a.learnedVerbIds, ...b.learnedVerbIds])),
    correctAnswers: Math.max(a.correctAnswers, b.correctAnswers),
    wrongAnswers: Math.max(a.wrongAnswers, b.wrongAnswers),
    mistakesByVerbId: maxRecord(a.mistakesByVerbId, b.mistakesByVerbId),
    moduleProgress,
    srs,
  };
};

export const progressHasActivity = hasActivity;

/** Перейменовує профіль: прогрес переходить під нове ім'я (зливається, якщо таке вже є). */
export const renameProfile = (from: string, to: string): string => {
  const fromKey = profileKey(from);
  const toNickname = isReservedNickname(to) ? "" : normalizeNickname(to);
  const toKey = profileKey(toNickname);

  if (fromKey === toKey) {
    return saveActiveNickname(toNickname);
  }

  const store = loadProgressStore();
  const moving = store[fromKey];
  const { [fromKey]: _removed, ...rest } = store;

  if (moving) {
    rest[toKey] = rest[toKey] ? mergeProgress(rest[toKey], moving) : moving;
  }

  saveProgressStore(rest);
  return saveActiveNickname(toNickname);
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
