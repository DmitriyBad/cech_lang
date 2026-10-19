import { describe, expect, it } from "vitest";
import { grammarModules } from "./grammarModules";
import { nouns } from "./nouns";
import { verbs } from "./verbs";

const all = [
  ...verbs.flatMap((verb) => verb.exercises.map((exercise) => ({ where: "verb " + verb.infinitive, exercise }))),
  ...nouns.flatMap((noun) => noun.exercises.map((exercise) => ({ where: "noun " + noun.noun, exercise }))),
  ...grammarModules.flatMap((module) =>
    module.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => ({ where: "lesson " + lesson.id, exercise }))),
  ),
];

describe("exercise explanations", () => {
  it("every exercise has a non-empty explanation", () => {
    const missing = all.filter(({ exercise }) => !exercise.explanation || exercise.explanation.length === 0);
    expect(missing.map((item) => item.where + ": " + item.exercise.question.slice(0, 50))).toEqual([]);
  });

  it("explanations contain no leftovers of template bugs", () => {
    const bad = all.filter(({ exercise }) => (exercise.explanation ?? []).some((line) => /undefined|null|NaN|\[object|\s{2,}/.test(line)));
    expect(bad.map((item) => item.where)).toEqual([]);
  });

  it("noun explanations mention the actual form", () => {
    const student = nouns.find((noun) => noun.noun === "student")!;
    const genitive = student.exercises.find((exercise) => exercise.question.startsWith("Оберіть genitiv однини"))!;
    expect(genitive.explanation!.join(" ")).toContain("studenta");
    expect(genitive.explanation!.join(" ")).toContain("-a");
  });

  it("flags exceptions instead of claiming a regular ending", () => {
    const listek = nouns.find((noun) => noun.noun === "lístek")!;
    const genitive = listek.exercises.find((exercise) => exercise.question.startsWith("Оберіть genitiv однини"))!;
    expect(genitive.explanation!.join(" ")).toContain("чергування чи виняток");
  });
});
