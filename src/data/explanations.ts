import type { CzechCaseKey, Noun } from "../types/Noun";
import { caseOrder, declensionPatterns } from "./declensionRules";

type NounForExplanation = Pick<Noun, "noun" | "translation" | "singular" | "plural"> & Partial<Pick<Noun, "gender" | "animate" | "patternId">>;

const caseTitles: Record<CzechCaseKey, string> = {
  nominative: "Називний (nominativ, kdo? co?)",
  genitive: "Родовий (genitiv, koho? čeho?)",
  dative: "Давальний (dativ, komu? čemu?)",
  accusative: "Знахідний (akuzativ, koho? co?)",
  vocative: "Кличний (vokativ)",
  locative: "Місцевий (lokál, o kom? o čem?)",
  instrumental: "Орудний (instrumentál, kým? čím?)",
};

const caseUsage: Record<CzechCaseKey, string> = {
  nominative: "Це форма зі словника; так стоїть підмет: To je …",
  genitive: "Вживається після bez, do, od, z, u, vedle та після Nemám, Hodně, Trochu.",
  dative: "Вживається після k, díky, proti та коли комусь щось даємо чи допомагаємо.",
  accusative: "Прямий додаток: Vidím …, Mám …, Potřebuju …; а також напрям після na, za, před.",
  vocative: "Звертання до людини.",
  locative: "Завжди з прийменником: v, na, o, po, při.",
  instrumental: "Вживається після s («з») і для засобу: jedu autobusem.",
};

const genderTitles: Record<NonNullable<Noun["gender"]>, string> = { masculine: "чоловічий", feminine: "жіночий", neuter: "середній" };

/** Перший абзац пояснення уроку (правило), обмежений за довжиною. */
export const firstParagraph = (text: string, max = 320): string => {
  const paragraph = text.split("\n")[0].trim();
  return paragraph.length > max ? paragraph.slice(0, paragraph.lastIndexOf(" ", max)) + "…" : paragraph;
};

const formNote = (noun: NounForExplanation, key: CzechCaseKey, number: "singular" | "plural"): string => {
  const pattern = declensionPatterns.find((item) => item.id === noun.patternId);
  const index = caseOrder.indexOf(key);
  const ending = pattern?.[number][index];
  const nominativeEnding = pattern?.singular[0];

  if (!pattern || ending === null || ending === undefined || nominativeEnding === undefined || nominativeEnding === null) {
    return "";
  }

  const singularNominative = noun.singular.nominative;
  const base = singularNominative.endsWith(nominativeEnding) ? singularNominative.slice(0, singularNominative.length - nominativeEnding.length) : null;
  const form = noun[number][key];

  if (base !== null && base + ending === form) {
    return "Закінчення цього типу слів (зразок «" + pattern.example + "»): " + (ending === "" ? "без закінчення" : "-" + ending) + ".";
  }

  return "У цьому слові є чергування чи виняток: форму треба запам'ятати.";
};

const explainForm = (noun: NounForExplanation, key: CzechCaseKey, number: "singular" | "plural", prefix = ""): string[] => {
  const numberTitle = number === "singular" ? "однина" : "множина";
  const lines = [
    caseTitles[key] + ", " + numberTitle + ": " + prefix + noun[number][key] + ". " + caseUsage[key],
  ];
  const note = formNote(noun, key, number);

  if (note) {
    lines.push(note);
  }

  return lines;
};

const caseByName: Record<string, CzechCaseKey> = {
  nominativ: "nominative",
  genitiv: "genitive",
  dativ: "dative",
  akuzativ: "accusative",
  vokativ: "vocative",
  locativ: "locative",
  lokál: "locative",
  instrumentál: "instrumental",
};

/** Пояснення до шаблонних вправ на іменники. Повертає undefined, якщо шаблон невідомий. */
export const explainNounExercise = (question: string, noun: NounForExplanation): string[] | undefined => {
  const askCase = /^Оберіть (\S+) (однини|множини) для/.exec(question);

  if (askCase && caseByName[askCase[1]]) {
    return explainForm(noun, caseByName[askCase[1]], askCase[2] === "однини" ? "singular" : "plural");
  }

  if (/^Оберіть locativ після/.test(question)) return explainForm(noun, "locative", "singular", "o ");
  if (/^Оберіть instrumentál після/.test(question)) return explainForm(noun, "instrumental", "singular", "s ");

  if (/^Доповніть: Nemám/.test(question)) return explainForm(noun, "genitive", "singular", "Nemám ");
  if (/^Доповніть: Vidím/.test(question)) return explainForm(noun, "accusative", "singular", "Vidím ");
  if (/^Доповніть: Tady jsou/.test(question)) return explainForm(noun, "nominative", "plural", "Tady jsou ");
  if (/^Доповніть: Pracuju s/.test(question)) return explainForm(noun, "instrumental", "plural", "Pracuju s ");

  if (/^Що означає “/.test(question)) {
    const gender = noun.gender ? ", " + genderTitles[noun.gender] + " рід" + (noun.gender === "masculine" ? (noun.animate ? ", істота" : ", неістота") : "") : "";
    return [noun.noun + " — " + noun.translation + gender + ". Множина: " + noun.plural.nominative + "."];
  }

  const phrase = /^Який відмінок у фразі “(\S+) /.exec(question);
  if (phrase?.[1] === "do") return ["Прийменник do завжди вимагає родового відмінка (genitiv): do " + noun.singular.genitive + "."];
  if (phrase?.[1] === "o") return ["Прийменник o («про») завжди вимагає місцевого відмінка (lokál): o " + noun.singular.locative + "."];

  if (/^Яка пара однина-множина/.test(question)) {
    return ["Називний однини і називний множини: " + noun.singular.nominative + " — " + noun.plural.nominative + ". Решта форм — це інші відмінки."];
  }

  return undefined;
};
