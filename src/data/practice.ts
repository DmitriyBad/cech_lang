import type { StoredProgress } from "../utils/storage";
import type { Exercise } from "../types/Verb";
import { grammarModules } from "./grammarModules";
import { nouns } from "./nouns";
import { verbs } from "./verbs";

export type PracticeTopic = "verbs" | "nouns" | "grammar" | "all" | "mistakes";

export const practiceTopics: Array<{ id: PracticeTopic; title: string; text: string }> = [
  { id: "all", title: "Усе разом", text: "Мікс дієслів, іменників і граматики" },
  { id: "verbs", title: "Дієслова", text: "Форми, переклад, речення" },
  { id: "nouns", title: "Іменники", text: "Відмінки й закінчення" },
  { id: "grammar", title: "Граматика", text: "Числа, час, прикметники, прийменники, часи" },
  { id: "mistakes", title: "Мої помилки", text: "Лише те, де ви помилялися" },
];

type Kind = "verb" | "noun" | "lesson";

/** Одне джерело вправ: слово або урок. */
interface Source {
  kind: Kind;
  key: string;
  count: number;
}

const kindCode: Record<Kind, string> = { verb: "v", noun: "n", lesson: "l" };
const codeKind: Record<string, Kind> = { v: "verb", n: "noun", l: "lesson" };

const lessonModuleId = new Map<string, string>();
const lessonById = new Map<string, { exercises: Exercise[]; title: string }>();
for (const module of grammarModules) {
  for (const lesson of module.lessons) {
    lessonModuleId.set(lesson.id, module.id);
    lessonById.set(lesson.id, { exercises: lesson.exercises, title: lesson.title });
  }
}

const verbSources: Source[] = verbs.map((verb) => ({ kind: "verb", key: String(verb.id), count: verb.exercises.length }));
const nounSources: Source[] = nouns.map((noun) => ({ kind: "noun", key: String(noun.id), count: noun.exercises.length }));
const lessonSources: Source[] = [...lessonById.entries()].map(([id, lesson]) => ({ kind: "lesson", key: id, count: lesson.exercises.length }));

export interface PracticeItem {
  id: string;
  exercise: Exercise;
  /** Назва слова чи уроку для підсумку. */
  label: string;
  /** Куди перейти, щоб повторити тему. */
  link: string;
  kind: Kind;
  /** Як записати відповідь у прогрес. */
  progressTarget: { type: "verb"; verbId: number } | { type: "module"; moduleId: string; itemId: string };
}

export const makeItemId = (kind: Kind, key: string, index: number) => kindCode[kind] + ":" + key + ":" + index;

/** Розбирає id вправи й повертає її дані; null, якщо вправи вже немає в словнику. */
export const getPracticeItem = (id: string): PracticeItem | null => {
  const [code, key, indexText] = id.split(":");
  const kind = codeKind[code];
  const index = Number(indexText);

  if (!kind || key === undefined || !Number.isInteger(index)) {
    return null;
  }

  if (kind === "verb") {
    const verb = verbs.find((item) => String(item.id) === key);
    const exercise = verb?.exercises[index];
    return verb && exercise
      ? { id, exercise, label: verb.infinitive, link: "/verbs/" + verb.id, kind, progressTarget: { type: "verb", verbId: verb.id } }
      : null;
  }

  if (kind === "noun") {
    const noun = nouns.find((item) => String(item.id) === key);
    const exercise = noun?.exercises[index];
    return noun && exercise
      ? { id, exercise, label: noun.noun, link: "/nouns/" + noun.id, kind, progressTarget: { type: "module", moduleId: "nouns", itemId: String(noun.id) } }
      : null;
  }

  const lesson = lessonById.get(key);
  const moduleId = lessonModuleId.get(key);
  const exercise = lesson?.exercises[index];
  return lesson && moduleId && exercise
    ? { id, exercise, label: lesson.title, link: "/modules/" + moduleId + "/" + key, kind, progressTarget: { type: "module", moduleId, itemId: key } }
    : null;
};

/** Джерела з помилками: ключі зі статистики прогресу. */
export const mistakeSources = (progress: StoredProgress): Source[] => {
  const hasMistakes = (count: number) => count > 0;
  const result: Source[] = [];

  for (const [verbId, count] of Object.entries(progress.mistakesByVerbId)) {
    const verb = verbs.find((item) => String(item.id) === verbId);
    if (verb && hasMistakes(count)) result.push({ kind: "verb", key: verbId, count: verb.exercises.length });
  }

  for (const [moduleId, module] of Object.entries(progress.moduleProgress)) {
    for (const [itemId, count] of Object.entries(module.mistakesByItemId)) {
      if (!hasMistakes(count)) continue;

      if (moduleId === "nouns") {
        const noun = nouns.find((item) => String(item.id) === itemId);
        if (noun) result.push({ kind: "noun", key: itemId, count: noun.exercises.length });
      } else {
        const lesson = lessonById.get(itemId);
        if (lesson && lessonModuleId.get(itemId) === moduleId) result.push({ kind: "lesson", key: itemId, count: lesson.exercises.length });
      }
    }
  }

  return result;
};

export const sourcesForTopic = (topic: PracticeTopic, progress: StoredProgress): Source[][] => {
  switch (topic) {
    case "verbs":
      return [verbSources];
    case "nouns":
      return [nounSources];
    case "grammar":
      return [lessonSources];
    case "mistakes": {
      const all = mistakeSources(progress);
      return [all.filter((s) => s.kind === "verb"), all.filter((s) => s.kind === "noun"), all.filter((s) => s.kind === "lesson")].filter((group) => group.length > 0);
    }
    default:
      return [verbSources, nounSources, lessonSources];
  }
};

const shuffle = <T,>(values: T[], rng: () => number): T[] => {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Підбирає вправи для сесії. Групи (дієслова / іменники / граматика) чергуються, щоб мікс був рівномірним;
 * слово чи урок повторюється, лише коли джерел менше, ніж потрібно вправ.
 */
export const pickSessionItems = (topic: PracticeTopic, progress: StoredProgress, size = 10, rng: () => number = Math.random): string[] => {
  const groups = sourcesForTopic(topic, progress).map((group) => shuffle(group, rng));
  const total = groups.reduce((sum, group) => sum + group.reduce((s, source) => s + source.count, 0), 0);
  const target = Math.min(size, total);
  const used = new Set<string>();
  const picked: string[] = [];
  const cursors = groups.map(() => 0);
  let groupIndex = 0;
  let guard = 0;

  while (picked.length < target && guard < target * 50 + 100) {
    guard += 1;
    const group = groups[groupIndex % groups.length];
    const cursor = cursors[groupIndex % groups.length]++;
    groupIndex += 1;

    if (group.length === 0) continue;

    // Спочатку різні джерела; коли коло завершено, беремо ті самі ще раз, але іншу вправу.
    const source = group[cursor % group.length];
    const free: number[] = [];
    for (let index = 0; index < source.count; index += 1) {
      if (!used.has(makeItemId(source.kind, source.key, index))) free.push(index);
    }

    if (free.length === 0) continue;

    const index = free[Math.floor(rng() * free.length)];
    const id = makeItemId(source.kind, source.key, index);
    used.add(id);
    picked.push(id);
  }

  return picked;
};

export interface PracticeAnswer {
  correct: boolean;
  given: string;
}

export interface PracticeSession {
  id: string;
  topic: PracticeTopic;
  createdAt: number;
  items: string[];
  answers: Array<PracticeAnswer | null>;
}

export const createSession = (topic: PracticeTopic, items: string[], now = Date.now()): PracticeSession => ({
  id: String(now),
  topic,
  createdAt: now,
  items,
  answers: items.map(() => null),
});

export const currentIndex = (session: PracticeSession): number => session.answers.findIndex((answer) => answer === null);

export const isFinished = (session: PracticeSession): boolean => session.items.length > 0 && currentIndex(session) === -1;

export const recordAnswer = (session: PracticeSession, index: number, answer: PracticeAnswer): PracticeSession =>
  session.answers[index] !== null
    ? session
    : { ...session, answers: session.answers.map((existing, i) => (i === index ? answer : existing)) };

export const sessionScore = (session: PracticeSession) => {
  const answered = session.answers.filter((answer): answer is PracticeAnswer => answer !== null);
  return { correct: answered.filter((a) => a.correct).length, answered: answered.length, total: session.items.length };
};

/** Повертає лише валідну сесію: вправи могли зникнути зі словника після оновлення сайту. */
export const sanitizeSession = (value: unknown): PracticeSession | null => {
  const session = value as Partial<PracticeSession> | null;

  if (
    !session ||
    typeof session.id !== "string" ||
    !Array.isArray(session.items) ||
    !Array.isArray(session.answers) ||
    session.items.length === 0 ||
    session.items.length !== session.answers.length ||
    !practiceTopics.some((topic) => topic.id === session.topic) ||
    !session.items.every((id) => typeof id === "string" && getPracticeItem(id) !== null)
  ) {
    return null;
  }

  const answers = session.answers.map((answer) =>
    answer && typeof answer.correct === "boolean" && typeof answer.given === "string" ? { correct: answer.correct, given: answer.given } : null,
  );

  return { id: session.id, topic: session.topic as PracticeTopic, createdAt: Number(session.createdAt) || 0, items: session.items as string[], answers };
};
