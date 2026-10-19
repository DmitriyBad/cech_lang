// Остання відкрита сторінка слова чи уроку для кнопки «Продовжити» на головній.
const KEY = "czech-learning-last-visit-v1";

const trackable = [/^\/verbs\/\d+$/, /^\/nouns\/\d+$/, /^\/modules\/[^/]+\/[^/]+$/];

export const saveLastVisit = (path: string) => {
  if (!trackable.some((pattern) => pattern.test(path))) {
    return;
  }

  try {
    window.localStorage.setItem(KEY, path);
  } catch {
    // Сховище недоступне: «Продовжити» просто не з'явиться.
  }
};

export const loadLastVisit = (): string => {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};
