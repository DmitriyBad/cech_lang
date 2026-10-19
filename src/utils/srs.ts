// Спрощене інтервальне повторення (за мотивами SM-2). Одиниця повторення — слово або урок («картка»),
// а не окрема вправа: кожне слово має кілька вправ, і їх можна пройти за один раз.

export interface SrsCard {
  /** Скільки разів поспіль картку пройдено правильно (різні дні). */
  reps: number;
  /** Поточний інтервал у днях. */
  interval: number;
  /** Коефіцієнт легкості: у скільки разів зростає інтервал. */
  ease: number;
  /** День повторення (номер дня за місцевим часом). */
  due: number;
  /** День останньої відповіді. */
  lastDay: number;
  /** Скільки разів картку забували. */
  lapses: number;
}

const MIN_EASE = 1.3;
const MAX_EASE = 2.8;
const START_EASE = 2.5;
const MAX_INTERVAL = 180;
const FIRST_INTERVALS = [1, 3];

/** Номер дня за місцевим часом користувача (півночі переходять за його годинником). */
export const todayNumber = (now: Date = new Date()): number =>
  Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000);

const freshCard = (today: number): SrsCard => ({ reps: 0, interval: 0, ease: START_EASE, due: today, lastDay: -1, lapses: 0 });

/**
 * Оновлює картку після відповіді.
 * - Помилка: серія скидається, картка знову «на сьогодні» (повертається в повторення, доки не пройдена правильно).
 * - Правильно в перший раз за день: інтервал зростає (1, 3, потім × ease).
 * - Повторні відповіді того ж дня інтервал не збільшують, щоб 15 вправ підряд не давали «місяць» за один підхід.
 */
export const reviewCard = (card: SrsCard | undefined, correct: boolean, today: number): SrsCard => {
  const current = card ?? freshCard(today);
  const failedToday = current.lastDay === today && current.reps === 0;
  const passedToday = current.lastDay === today && current.reps > 0;

  if (!correct) {
    if (failedToday) {
      return current;
    }

    return {
      ...current,
      reps: 0,
      interval: 1,
      ease: Math.max(MIN_EASE, current.ease - 0.2),
      due: today,
      lastDay: today,
      lapses: current.lapses + 1,
    };
  }

  if (passedToday) {
    return current;
  }

  if (failedToday) {
    // Виправив помилку в той самий день: повертаємо в графік із мінімальним інтервалом.
    return { ...current, reps: 1, interval: 1, due: today + 1, lastDay: today };
  }

  const reps = current.reps + 1;
  const interval = Math.min(MAX_INTERVAL, reps <= FIRST_INTERVALS.length ? FIRST_INTERVALS[reps - 1] : Math.max(1, Math.round(current.interval * current.ease)));

  return {
    ...current,
    reps,
    interval,
    ease: Math.min(MAX_EASE, current.ease + 0.05),
    due: today + interval,
    lastDay: today,
  };
};

export const isDue = (card: SrsCard, today: number): boolean => card.due <= today;

export type SrsLevel = "learning" | "known" | "strong";

/** Для статистики: «вчу» (інтервал до тижня), «знаю» (до місяця), «міцно» (понад місяць). */
export const cardLevel = (card: SrsCard): SrsLevel => (card.interval >= 30 ? "strong" : card.interval >= 7 ? "known" : "learning");

export const normalizeCard = (value: unknown): SrsCard | null => {
  const card = value as Partial<SrsCard> | null;
  const numbers = [card?.reps, card?.interval, card?.ease, card?.due, card?.lastDay, card?.lapses];

  if (!card || !numbers.every((item) => typeof item === "number" && Number.isFinite(item))) {
    return null;
  }

  return {
    reps: Math.max(0, Math.floor(card.reps as number)),
    interval: Math.min(MAX_INTERVAL, Math.max(0, Math.floor(card.interval as number))),
    ease: Math.min(MAX_EASE, Math.max(MIN_EASE, card.ease as number)),
    due: Math.floor(card.due as number),
    lastDay: Math.floor(card.lastDay as number),
    lapses: Math.max(0, Math.floor(card.lapses as number)),
  };
};
