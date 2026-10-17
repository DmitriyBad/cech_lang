import type { Example, Exercise } from "./Verb";

// Справжнє речення уроку: `focus` — слово/форма з уроку (точний підрядок `cz`), яке перевіряє вправа;
// `wrong` — два правдоподібні, але хибні варіанти цього слова (інша форма, відмінок, закінчення).
export interface LessonSentence extends Example {
  focus: string;
  wrong: [string, string];
}

export interface LessonItem {
  id: string;
  title: string;
  subtitle: string;
  level: "A1" | "A2";
  explanation: string;
  studyItems: string[];
  examples: Example[];
  exercises: Exercise[];
}

export interface LessonModule {
  id: string;
  title: string;
  subtitle: string;
  icon: "copy" | "hash" | "calendar" | "palette" | "route" | "messages" | "clock";
  referenceTitle?: string;
  referenceItems?: string[];
  lessons: LessonItem[];
}
