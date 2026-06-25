import type { Example, Exercise } from "./Verb";

export type CzechCaseKey = "nominative" | "genitive" | "dative" | "accusative" | "vocative" | "locative" | "instrumental";

export interface NounCaseForms {
  nominative: string;
  genitive: string;
  dative: string;
  accusative: string;
  vocative: string;
  locative: string;
  instrumental: string;
}

export interface Noun {
  id: number;
  noun: string;
  translation: string;
  level: "A1" | "A2";
  gender: "masculine" | "feminine" | "neuter";
  animate?: boolean;
  singular: NounCaseForms;
  plural: NounCaseForms;
  examples: Example[];
  exercises: Exercise[];
}
