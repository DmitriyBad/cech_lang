import { describe, expect, it } from "vitest";
import { caseOrder, declensionPatterns, patternToNounForms } from "./declensionRules";
import { nouns } from "./nouns";

// Зразки на сторінці правил мають збігатися з таблицями реальних слів сайту.
describe("declension patterns", () => {
  for (const pattern of declensionPatterns) {
    const noun = nouns.find((item) => item.noun === pattern.example);

    if (!noun) {
      it("pattern " + pattern.id + " has no matching noun in the dictionary (skipped)", () => {
        expect(pattern.id).toBe("mistnost");
      });
      continue;
    }

    it("matches the forms of «" + pattern.example + "»", () => {
      const forms = patternToNounForms(pattern);

      for (const key of caseOrder) {
        if (forms.singular[key] !== undefined) {
          expect(forms.singular[key], "singular " + key).toBe(noun.singular[key]);
        }
        if (forms.plural[key] !== undefined) {
          expect(forms.plural[key], "plural " + key).toBe(noun.plural[key]);
        }
      }
    });
  }
});
