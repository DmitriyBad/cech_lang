import type { Verb } from "../types/Verb";

const auxiliary = ["budu", "budeš", "bude", "budeme", "budete", "budou"];

// Дієслова руху, які в майбутньому мають власні форми замість «budu + інфінітив».
const prefixedFuture: Record<string, string[]> = {
  "jít": ["půjdu", "půjdeš", "půjde", "půjdeme", "půjdete", "půjdou"],
  "jet": ["pojedu", "pojedeš", "pojede", "pojedeme", "pojedete", "pojedou"],
};

/** Текст для озвучення: у реченні з підметом частка йде перед budu («já se budu učit»). */
export const speakableFuture = (pronoun: string, form: string): string => {
  const match = /^(budu|budeš|bude|budeme|budete|budou) (se|si) (.+)$/.exec(form);
  return match ? pronoun + " " + match[2] + " " + match[1] + " " + match[3] : pronoun + " " + form;
};

export const futureLabels = ["já", "ty", "on / ona / ono", "my", "vy", "oni / ony"];

/**
 * Форми майбутнього часу для недоконаного дієслова (шість осіб).
 * Для доконаних повертає null: їхні «теперішні» форми й є майбутнім часом.
 */
export const buildFutureForms = (verb: Pick<Verb, "infinitive" | "aspect">): string[] | null => {
  if (verb.aspect === "perfective") {
    return null;
  }

  const { infinitive } = verb;

  if (infinitive === "být") {
    return [...auxiliary];
  }

  if (prefixedFuture[infinitive]) {
    return prefixedFuture[infinitive];
  }

  // Окрема форма в таблиці: «učit se» → «budu se učit» (у реченні з підметом частка йде перед budu: já se budu učit).
  const match = /^(.+) (se|si)$/.exec(infinitive);
  const base = match ? match[1] : infinitive;
  const particle = match ? match[2] : "";

  return auxiliary.map((form) => [form, particle, base].filter(Boolean).join(" "));
};
