import { describe, expect, it } from "vitest";
import type { CzechCaseKey } from "../types/Noun";
import { nouns } from "./nouns";
import { verbs } from "./verbs";

const cases: CzechCaseKey[] = ["nominative", "genitive", "dative", "accusative", "vocative", "locative", "instrumental"];
const noun = (word: string) => {
  const found = nouns.find((item) => item.noun === word);
  if (!found) throw new Error("Noun not found: " + word);
  return found;
};

// Еталонні форми (Internetová jazyková příručka). Додаємо сюди кожне слово, у якому колись знаходили помилку.
type Expected = { singular?: Partial<Record<CzechCaseKey, string>>; plural?: Partial<Record<CzechCaseKey, string>> };
const expectedForms: Record<string, Expected> = {
  kolega: {
    singular: { genitive: "kolegy", accusative: "kolegu", vocative: "kolego", instrumental: "kolegou" },
    plural: { genitive: "kolegů", dative: "kolegům", accusative: "kolegy", locative: "kolezích", instrumental: "kolegy" },
  },
  turista: {
    singular: { genitive: "turisty", accusative: "turistu", vocative: "turisto", instrumental: "turistou" },
    plural: { genitive: "turistů", dative: "turistům", accusative: "turisty", locative: "turistech", instrumental: "turisty" },
  },
  číšník: { plural: { locative: "číšnících" } },
  pracovník: { plural: { locative: "pracovnících" } },
  rok: { singular: { locative: "roce" }, plural: { locative: "rocích" } },
  čas: { singular: { locative: "čase" } },
  měsíc: {
    singular: { genitive: "měsíce", dative: "měsíci", instrumental: "měsícem" },
    plural: { genitive: "měsíců", locative: "měsících", instrumental: "měsíci" },
  },
  pokoj: {
    singular: { genitive: "pokoje", dative: "pokoji", instrumental: "pokojem" },
    plural: { genitive: "pokojů", instrumental: "pokoji" },
  },
  účet: { singular: { genitive: "účtu", instrumental: "účtem" }, plural: { genitive: "účtů", instrumental: "účty" } },
  práce: {
    singular: { instrumental: "prací" },
    plural: { genitive: "prací", dative: "pracím", locative: "pracích", instrumental: "pracemi" },
  },
  kuchyně: { plural: { genitive: "kuchyní", instrumental: "kuchyněmi" } },
  // Раніше виправлені форми
  vlak: { plural: { locative: "vlacích" } },
  batoh: { plural: { locative: "batozích" } },
  lístek: { singular: { genitive: "lístku", instrumental: "lístkem" }, plural: { locative: "lístcích" } },
  taška: { plural: { genitive: "tašek" } },
  okno: { plural: { genitive: "oken" } },
  jídlo: { plural: { genitive: "jídel" } },
  parkoviště: { singular: { genitive: "parkoviště", instrumental: "parkovištěm" }, plural: { genitive: "parkovišť" } },
  centrum: { singular: { genitive: "centra" }, plural: { genitive: "center" } },
  bratr: { singular: { vocative: "bratře" }, plural: { locative: "bratřích" } },
};

describe("noun forms", () => {
  it("every noun has all 14 non-empty forms", () => {
    for (const item of nouns) {
      for (const key of cases) {
        expect(item.singular[key], item.noun + " singular " + key).toBeTruthy();
        expect(item.plural[key], item.noun + " plural " + key).toBeTruthy();
      }
    }
  });

  it("has 100 nouns with unique ids and words", () => {
    expect(nouns).toHaveLength(100);
    expect(new Set(nouns.map((item) => item.id)).size).toBe(100);
    expect(new Set(nouns.map((item) => item.noun)).size).toBe(100);
  });

  for (const [word, expected] of Object.entries(expectedForms)) {
    it("has correct forms for " + word, () => {
      const item = noun(word);

      for (const [key, form] of Object.entries(expected.singular ?? {})) {
        expect(item.singular[key as CzechCaseKey], word + " singular " + key).toBe(form);
      }
      for (const [key, form] of Object.entries(expected.plural ?? {})) {
        expect(item.plural[key as CzechCaseKey], word + " plural " + key).toBe(form);
      }
    });
  }

  it("masculine -a nouns do not append endings to the final -a", () => {
    for (const word of ["kolega", "turista"]) {
      const forms = [...Object.values(noun(word).singular), ...Object.values(noun(word).plural)];
      for (const form of forms) {
        expect(form, word + " -> " + form).not.toMatch(/a[yuoůaeě]/);
      }
    }
  });

  it("hard masculine stems ending in k/h/g take -cích/-zích in the locative plural", () => {
    for (const item of nouns) {
      if (item.gender !== "masculine") continue;
      const stem = item.noun.replace(/ek$/, "k");
      if (/[kgh]$/.test(stem) && item.plural.locative.endsWith("ech")) {
        throw new Error(item.noun + " locative plural should not end in -ech: " + item.plural.locative);
      }
    }
  });
});

describe("verbs", () => {
  it("has 100 verbs with unique infinitives and ids", () => {
    expect(verbs).toHaveLength(100);
    expect(new Set(verbs.map((verb) => verb.infinitive)).size).toBe(100);
    expect(new Set(verbs.map((verb) => verb.id)).size).toBe(100);
  });

  it("every verb has six non-empty present-tense forms", () => {
    for (const verb of verbs) {
      for (const form of Object.values(verb.conjugation)) {
        expect(form, verb.infinitive).toBeTruthy();
      }
    }
  });
});

describe("known exceptions", () => {
  it("jazyk has genitive jazyka", () => {
    const jazyk = nouns.find((noun) => noun.noun === "jazyk")!;
    expect(jazyk.singular.genitive).toBe("jazyka");
    expect(jazyk.singular.locative).toBe("jazyku");
  });
});
