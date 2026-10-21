// Щоденна ціль і серія днів. День рахується за місцевим часом (той самий номер дня, що й у повторенні).

export interface DayActivity {
  answers: number;
  correct: number;
}

/** Ключ — номер дня (рядком), значення — відповіді за цей день. */
export type ActivityLog = Record<string, DayActivity>;

export const DEFAULT_GOAL = 10;
export const GOAL_OPTIONS = [10, 20, 40] as const;
const HISTORY_DAYS = 400;

const count = (value: unknown) => (typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);

export const normalizeActivity = (value: unknown): ActivityLog => {
  if (!value || typeof value !== "object") {
    return {};
  }

  const result: ActivityLog = {};

  for (const [day, entry] of Object.entries(value as Record<string, Partial<DayActivity>>)) {
    const answers = count(entry?.answers);

    if (/^\d+$/.test(day) && answers > 0) {
      result[day] = { answers, correct: Math.min(answers, count(entry?.correct)) };
    }
  }

  return result;
};

export const normalizeGoal = (value: unknown): number => {
  const goal = count(value);
  return goal >= 1 && goal <= 500 ? goal : DEFAULT_GOAL;
};

/** Додає відповідь до сьогоднішнього дня й прибирає записи старші за ~13 місяців. */
export const addAnswer = (log: ActivityLog, today: number, correct: boolean): ActivityLog => {
  const key = String(today);
  const current = log[key] ?? { answers: 0, correct: 0 };
  const next: ActivityLog = { ...log, [key]: { answers: current.answers + 1, correct: current.correct + (correct ? 1 : 0) } };

  for (const day of Object.keys(next)) {
    if (Number(day) < today - HISTORY_DAYS) {
      delete next[day];
    }
  }

  return next;
};

/** Об'єднує журнали з двох пристроїв: за кожен день береться більше. */
export const mergeActivity = (a: ActivityLog, b: ActivityLog): ActivityLog => {
  const result: ActivityLog = { ...a };

  for (const [day, entry] of Object.entries(b)) {
    const existing = result[day];
    result[day] = !existing || entry.answers > existing.answers ? entry : existing;
  }

  return result;
};

export interface StreakInfo {
  /** Скільки днів поспіль виконано ціль (рахується до сьогодні чи до вчора, якщо сьогодні ще ні). */
  current: number;
  best: number;
  todayAnswers: number;
  todayCorrect: number;
  todayDone: boolean;
}

export const streakInfo = (log: ActivityLog, goal: number, today: number): StreakInfo => {
  const reached = (day: number) => (log[String(day)]?.answers ?? 0) >= goal;
  const todayEntry = log[String(today)] ?? { answers: 0, correct: 0 };
  const todayDone = reached(today);

  // Серія живе, поки не пропущено цілого дня: сьогодні ще можна встигнути.
  let current = 0;
  for (let day = todayDone ? today : today - 1; reached(day); day -= 1) {
    current += 1;
  }

  const days = Object.keys(log).map(Number).filter(reached).sort((x, y) => x - y);
  let best = 0;
  let run = 0;
  days.forEach((day, position) => {
    run = position > 0 && days[position - 1] === day - 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });

  return { current, best, todayAnswers: todayEntry.answers, todayCorrect: todayEntry.correct, todayDone };
};

export interface DayBar {
  day: number;
  answers: number;
  reached: boolean;
  /** Коротка назва дня тижня: пн, вт… */
  label: string;
  isToday: boolean;
}

const weekdayLabels = ["нд", "пн", "вт", "ср", "чт", "пт", "сб"];

/** Останні `days` днів для діаграми, від найстарішого до сьогодні. */
export const recentDays = (log: ActivityLog, goal: number, today: number, days = 14): DayBar[] =>
  Array.from({ length: days }, (_, offset) => {
    const day = today - (days - 1 - offset);
    const answers = log[String(day)]?.answers ?? 0;

    return {
      day,
      answers,
      reached: answers >= goal,
      // Номер дня — це дні від 1970-01-01 у місцевому часі, тому день тижня рахуємо як у UTC.
      label: weekdayLabels[new Date(day * 86400000).getUTCDay()],
      isToday: day === today,
    };
  });
