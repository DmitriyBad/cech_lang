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
  /** Вид дієслова. У доконаних форми «теперішнього часу» означають майбутній час (přijdu = «прийду»). */
  aspect?: "imperfective" | "perfective";
  /** Літературні варіанти розмовних форм таблиці (pracuju → pracuji, můžu → mohu). */
  formalForms?: Partial<Verb["conjugation"]>;
  /** Короткі пояснення до слова (вживання, відмінність від схожого дієслова). */
  notes?: string[];
  examples: Example[];
  exercises: Exercise[];
}

export type VerbLevel = Verb["level"];
