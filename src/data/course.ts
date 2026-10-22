import { grammarModules } from "./grammarModules";
import { nouns } from "./nouns";
import { verbs } from "./verbs";
import type { StoredProgress } from "../utils/storage";

export type CourseStepKind = "lesson" | "verbs" | "nouns";

export interface CourseStep {
  id: string;
  kind: CourseStepKind;
  title: string;
  hint: string;
  /** Куди вести учня: урок або перше слово набору. */
  to: string;
  /** Для уроку: id модуля; для слів — "nouns" чи порожньо. */
  moduleId?: string;
  /** id уроку або слів набору. */
  itemIds: string[];
}

export interface CourseUnit {
  id: string;
  level: "A1" | "A2";
  title: string;
  goal: string;
  steps: CourseStep[];
}

const lessonIndex = new Map<string, { moduleId: string; title: string; subtitle: string }>();
grammarModules.forEach((module) =>
  module.lessons.forEach((lesson) => lessonIndex.set(lesson.id, { moduleId: module.id, title: lesson.title, subtitle: lesson.subtitle })),
);

const lessonStep = (lessonId: string): CourseStep => {
  const found = lessonIndex.get(lessonId);
  if (!found) {
    throw new Error("Немає уроку для курсу: " + lessonId);
  }
  return {
    id: "lesson:" + lessonId,
    kind: "lesson",
    title: found.title,
    hint: found.subtitle,
    to: "/modules/" + found.moduleId + "/" + lessonId,
    moduleId: found.moduleId,
    itemIds: [lessonId],
  };
};

const CHUNK = 10;
const byLevel = <T extends { id: number; level: "A1" | "A2" }>(items: T[]) =>
  [...items].sort((a, b) => (a.level === b.level ? a.id - b.id : a.level === "A1" ? -1 : 1));

const chunk = <T,>(items: T[]): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += CHUNK) {
    result.push(items.slice(i, i + CHUNK));
  }
  return result;
};

const verbChunks = chunk(byLevel(verbs));
const nounChunks = chunk(byLevel(nouns));

const verbStep = (index: number): CourseStep | null => {
  const group = verbChunks[index];
  return group
    ? {
        id: "verbs:" + (index + 1),
        kind: "verbs",
        title: "Дієслова: набір " + (index + 1),
        hint: group
          .slice(0, 4)
          .map((verb) => verb.infinitive)
          .join(", ") + "…",
        to: "/verbs/" + group[0].id,
        itemIds: group.map((verb) => String(verb.id)),
      }
    : null;
};

const nounStep = (index: number): CourseStep | null => {
  const group = nounChunks[index];
  return group
    ? {
        id: "nouns:" + (index + 1),
        kind: "nouns",
        title: "Іменники: набір " + (index + 1),
        hint: group
          .slice(0, 4)
          .map((noun) => noun.noun)
          .join(", ") + "…",
        to: "/nouns/" + group[0].id,
        moduleId: "nouns",
        itemIds: group.map((noun) => String(noun.id)),
      }
    : null;
};

const unit = (
  id: string,
  level: "A1" | "A2",
  title: string,
  goal: string,
  lessons: string[],
  wordSet?: number,
): CourseUnit => ({
  id,
  level,
  title,
  goal,
  steps: [
    ...lessons.map(lessonStep),
    ...(wordSet === undefined ? [] : [verbStep(wordSet * 2), verbStep(wordSet * 2 + 1), nounStep(wordSet * 2), nounStep(wordSet * 2 + 1)]),
  ].filter((step): step is CourseStep => step !== null),
});

export const courseUnits: CourseUnit[] = [
  unit("u1", "A1", "Знайомство", "Привітатися, розповісти про себе, лічити до десяти.", ["scenario-intro", "pron-personal", "pron-question", "numbers-0-10", "tenses-present-a"], 0),
  unit("u2", "A1", "Щодня", "Говорити про звичайні дії, дні й місяці.", ["tenses-present-i", "tenses-present-uju", "order-basic", "order-conjunctions", "numbers-11-20", "numbers-tens", "time-days", "time-months"], 1),
  unit(
    "u3",
    "A1",
    "Опис і кількість",
    "Описувати предмети та вживати множину.",
    ["plural-masc-animate", "plural-masc-inanimate", "plural-feminine-a", "plural-feminine-e", "plural-neuter-o", "adj-gender", "adj-colors", "adj-size", "pron-demonstrative", "pron-possessive"],
    2,
  ),
  unit(
    "u4",
    "A1",
    "У місті",
    "Купувати, їздити, замовляти в кафе й обирати правильний відмінок після прийменників.",
    ["prep-genitive", "prep-dative", "prep-accusative", "prep-locative", "prep-instrumental", "scenario-shop", "scenario-transport", "scenario-cafe", "order-questions", "dialog-cafe", "dialog-shop", "dialog-directions", "dialog-restaurant", "time-clock-basic", "numbers-prices"],
    3,
  ),
  unit("u5", "A1", "Було й буде", "Розповісти, що сталося вчора і що буде завтра.", ["tenses-past-form", "tenses-past-gender", "tenses-future-budu", "tenses-choose", "pron-accusative", "pron-dative", "dialog-phone", "numbers-age", "numbers-phone", "time-meetings"], 4),
  unit(
    "u6",
    "A2",
    "Складніші часи",
    "Неправильні форми, заперечення, доконані дієслова.",
    ["tenses-past-irregular", "tenses-past-neg-refl", "tenses-future-perfective", "tenses-future-motion", "tenses-future-neg-refl", "prep-vs-direction-place", "order-negation", "order-clitics"],
  ),
  unit(
    "u7",
    "A2",
    "Життя в Чехії",
    "Лікар, робота, житло, подорож; дати, години й порівняння.",
    ["plural-neuter-i", "numbers-hundreds", "time-half-quarter", "time-dates", "adj-plural", "adj-cases", "adj-comparison", "scenario-doctor", "scenario-work", "scenario-housing", "scenario-travel", "dialog-doctor"],
  ),
];

export const courseSteps: CourseStep[] = courseUnits.flatMap((item) => item.steps);

type DoneState = Pick<StoredProgress, "learnedVerbIds" | "moduleProgress">;

export const stepStatus = (step: CourseStep, state: DoneState): { done: number; total: number; complete: boolean } => {
  const total = step.itemIds.length;
  let done = 0;

  if (step.kind === "verbs") {
    const learned = new Set(state.learnedVerbIds.map(String));
    done = step.itemIds.filter((id) => learned.has(id)).length;
  } else {
    const completed = new Set(state.moduleProgress[step.moduleId ?? ""]?.completedItemIds ?? []);
    done = step.itemIds.filter((id) => completed.has(id)).length;
  }

  return { done, total, complete: done >= total };
};

/** Перші непройдені кроки курсу в порядку черги. */
export const nextSteps = (state: DoneState, count = 3): CourseStep[] =>
  courseSteps.filter((step) => !stepStatus(step, state).complete).slice(0, count);

export const courseSummary = (state: DoneState) => {
  const done = courseSteps.filter((step) => stepStatus(step, state).complete).length;
  return { done, total: courseSteps.length, percent: courseSteps.length === 0 ? 0 : Math.round((done / courseSteps.length) * 100) };
};

/** Для відкритого слова чи уроку: яким кроком воно є в курсі (для підсвітки), якщо є. */
export const unitProgress = (unitItem: CourseUnit, state: DoneState) => {
  const done = unitItem.steps.filter((step) => stepStatus(step, state).complete).length;
  return { done, total: unitItem.steps.length };
};
