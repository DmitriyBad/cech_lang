import { describe, expect, it } from "vitest";
import { buildFutureForms } from "./verbFuture";
import { verbs } from "./verbs";

describe("future tense forms", () => {
  it("builds budu + infinitive for imperfective verbs", () => {
    expect(buildFutureForms({ infinitive: "dělat", aspect: "imperfective" })).toEqual([
      "budu dělat", "budeš dělat", "bude dělat", "budeme dělat", "budete dělat", "budou dělat",
    ]);
  });

  it("puts reflexive particles after the auxiliary", () => {
    expect(buildFutureForms({ infinitive: "učit se", aspect: "imperfective" })![0]).toBe("budu se učit");
    expect(buildFutureForms({ infinitive: "pamatovat si", aspect: "imperfective" })![1]).toBe("budeš si pamatovat");
    expect(buildFutureForms({ infinitive: "mít rád", aspect: "imperfective" })![2]).toBe("bude mít rád");
  });

  it("uses own forms for být, jít, jet", () => {
    expect(buildFutureForms({ infinitive: "být", aspect: "imperfective" })).toEqual(["budu", "budeš", "bude", "budeme", "budete", "budou"]);
    expect(buildFutureForms({ infinitive: "jít", aspect: "imperfective" })![0]).toBe("půjdu");
    expect(buildFutureForms({ infinitive: "jet", aspect: "imperfective" })![5]).toBe("pojedou");
    expect(buildFutureForms({ infinitive: "běžet", aspect: "imperfective" })![0]).toBe("budu běžet");
  });

  it("returns null for perfective verbs and six forms for every other verb", () => {
    for (const verb of verbs) {
      const forms = buildFutureForms(verb);
      if (verb.aspect === "perfective") {
        expect(forms, verb.infinitive).toBeNull();
      } else {
        expect(forms, verb.infinitive).toHaveLength(6);
        expect(forms!.every((form) => form.trim().length > 0), verb.infinitive).toBe(true);
      }
    }
  });

  it("has no other motion verbs that would need special future forms", () => {
    const motion = ["letět", "nést", "vézt", "lézt"];
    expect(verbs.filter((verb) => motion.includes(verb.infinitive))).toEqual([]);
  });
});

describe("speakable forms", () => {
  it("moves the reflexive particle before the auxiliary", async () => {
    const { speakableFuture } = await import("./verbFuture");
    expect(speakableFuture("já", "budu se učit")).toBe("já se budu učit");
    expect(speakableFuture("já", "budu dělat")).toBe("já budu dělat");
  });

  it("moves the particle before the participle in 3rd person past", async () => {
    const { speakablePast } = await import("./verbPast");
    expect(speakablePast("on", "učil se")).toBe("on se učil");
    expect(speakablePast("já", "jsem se učil")).toBe("já jsem se učil");
    expect(speakablePast("ty", "ses učil")).toBe("ty ses učil");
    expect(speakablePast("on", "byl")).toBe("on byl");
  });
});
