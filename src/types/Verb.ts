export interface Example {
  cz: string;
  ua: string;
}

export interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Verb {
  id: number;
  infinitive: string;
  translation: string;
  level: "A1" | "A2";
  conjugation: {
    ja: string;
    ty: string;
    on: string;
    my: string;
    vy: string;
    oni: string;
  };
  examples: Example[];
  exercises: Exercise[];
}

export type VerbLevel = Verb["level"];
