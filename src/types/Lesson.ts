import type { Example, Exercise } from "./Verb";

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
  icon: "copy" | "hash" | "calendar" | "palette" | "route" | "messages";
  referenceTitle?: string;
  referenceItems?: string[];
  lessons: LessonItem[];
}
