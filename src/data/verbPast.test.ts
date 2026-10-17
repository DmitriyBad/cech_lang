import { describe, expect, it } from "vitest";
import { buildPastRows, pastMasculine } from "./verbPast";
import { verbs } from "./verbs";

// Дієслова, у яких форма на -l не виходить простим «інфінітив без -t + l» (скорочення голосного, зміна кореня).
const irregular = new Set([
  "být", "mít", "jít", "chtít", "moci", "říct", "dát", "vzít", "přijít", "odejít", "žít", "znát", "číst", "psát", "jíst", "pít", "najít",
  "začít", "otevřít", "zavřít", "přinést", "odnést", "zapomenout", "mít rád", "ptát se", "stát se", "zapnout", "vypnout", "umřít",
]);

describe("past tense forms", () => {
  it("has a form for every verb of the dictionary and no extras", () => {
    expect(verbs.map((verb) => verb.infinitive).sort()).toEqual(Object.keys(pastMasculine).sort());
  });

  it("builds regular forms from the infinitive", () => {
    for (const [infinitive, masculine] of Object.entries(pastMasculine)) {
      if (irregular.has(infinitive)) continue;
      expect(masculine, infinitive).toBe(infinitive.split(" ")[0].slice(0, -1) + "l");
    }
  });

  it("builds the full table for být", () => {
    const rows = buildPastRows("být")!;
    expect(rows.map((row) => row.masculine)).toEqual(["jsem byl", "jsi byl", "byl", "jsme byli", "jste byli", "byli"]);
    expect(rows.map((row) => row.feminine)).toEqual(["jsem byla", "jsi byla", "byla", "jsme byly", "jste byly", "byly"]);
    expect(rows[2].neuter).toBe("bylo");
  });

  it("handles šel / šla", () => {
    const rows = buildPastRows("jít")!;
    expect(rows[2]).toMatchObject({ masculine: "šel", feminine: "šla", neuter: "šlo" });
    expect(rows[5]).toMatchObject({ masculine: "šli", feminine: "šly" });
  });

  it("places reflexive particles correctly", () => {
    const rows = buildPastRows("učit se")!;
    expect(rows.map((row) => row.masculine)).toEqual(["jsem se učil", "ses učil", "učil se", "jsme se učili", "jste se učili", "učili se"]);
    expect(buildPastRows("pamatovat si")![1].feminine).toBe("sis pamatovala");
    expect(buildPastRows("stát se")![0].masculine).toBe("jsem se stal");
  });

  it("agrees the complement of «mít rád»", () => {
    const rows = buildPastRows("mít rád")!;
    expect(rows[0]).toMatchObject({ masculine: "jsem měl rád", feminine: "jsem měla ráda" });
    expect(rows[5]).toMatchObject({ masculine: "měli rádi", feminine: "měly rády" });
  });

  it("does not drop e in slyšel", () => {
    expect(buildPastRows("slyšet")![2]).toMatchObject({ feminine: "slyšela", neuter: "slyšelo" });
    expect(buildPastRows("přijít")![2].feminine).toBe("přišla");
  });

  it("keeps the movable e (otevřel → otevřela)", () => {
    expect(buildPastRows("otevřít")![2].feminine).toBe("otevřela");
  });
});
