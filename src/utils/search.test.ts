import { describe, expect, it } from "vitest";
import { matchesSearch, normalizeSearch } from "./search";

describe("search", () => {
  it("ignores Czech diacritics and case", () => {
    expect(matchesSearch("byt", "být")).toBe(true);
    expect(matchesSearch("DELAT", "dělat")).toBe(true);
    expect(matchesSearch("ctit", "číst", "читати")).toBe(false);
    expect(matchesSearch("cist", "číst")).toBe(true);
  });

  it("keeps Cyrillic letters intact", () => {
    expect(normalizeSearch("Йти")).toBe("йти");
    expect(matchesSearch("йти", "jít", "йти")).toBe(true);
    expect(matchesSearch("ити", "jít", "йти")).toBe(false);
  });

  it("matches everything for an empty query", () => {
    expect(matchesSearch("  ", "cokoliv")).toBe(true);
  });
});
