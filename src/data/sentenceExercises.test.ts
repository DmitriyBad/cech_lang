import { describe, expect, it } from "vitest";
import type { Exercise } from "../types/Verb";
import { grammarModules } from "./grammarModules";
import { nouns } from "./nouns";
import { buildErrorExercise, buildSentenceExercise, coreWord, isBuildable, sentenceAlternatives, tokenize } from "./sentenceExercises";
import { verbs } from "./verbs";

const all: Array<{ where: string; exercise: Exercise }> = [
  ...verbs.flatMap((verb) => verb.exercises.map((exercise) => ({ where: "verb " + verb.infinitive, exercise }))),
  ...nouns.flatMap((noun) => noun.exercises.map((exercise) => ({ where: "noun " + noun.noun, exercise }))),
  ...grammarModules.flatMap((module) => module.lessons.flatMap((lesson) => lesson.exercises.map((exercise) => ({ where: "lesson " + lesson.id, exercise })))),
];
const sentenceKinds = all.filter(({ exercise }) => exercise.kind);

describe("sentence helpers", () => {
  it("tokenizes and limits sentence length", () => {
    expect(tokenize("  Já   jedu domů. ")).toEqual(["Já", "jedu", "domů."]);
    expect(isBuildable("Já jedu domů.")).toBe(true);
    expect(isBuildable("Ahoj!")).toBe(false);
    expect(isBuildable("a b c d e f g h i j")).toBe(false);
  });

  it("accepts a sentence without the subject pronoun", () => {
    expect(sentenceAlternatives("Já jedu domů.")).toEqual(["Jedu domů."]);
    expect(sentenceAlternatives("Jedu domů.")).toEqual([]);
  });

  it("strips punctuation from a word", () => {
    expect(coreWord("„Domů!“")).toBe("domů");
  });

  it("builds a sentence exercise from an example", () => {
    const exercise = buildSentenceExercise({ cz: "Já jedu domů.", ua: "Я їду додому." });

    expect(exercise.kind).toBe("build");
    expect(exercise.tokens).toEqual(["Já", "jedu", "domů."]);
    expect(exercise.acceptable).toEqual(["Jedu domů."]);
  });

  it("builds an error exercise for one wrong word and rejects bigger differences", () => {
    const example = { cz: "Já jedu domů.", ua: "Я їду додому." };
    const exercise = buildErrorExercise(example, "Já jedeš domů.", ["Пояснення"]);

    expect(exercise?.errorIndexes).toEqual([1]);
    expect(exercise?.correctAnswer).toBe("jedeš");
    expect(exercise?.answerText).toBe("Já jedu domů.");
    expect(buildErrorExercise(example, "Ty jedeš školy.", [])).toBeNull();
    expect(buildErrorExercise(example, "Já jedu.", [])).toBeNull();
  });
});

describe("generated sentence exercises", () => {
  it("exist for verbs, nouns and lessons", () => {
    expect(sentenceKinds.some(({ where, exercise }) => where.startsWith("verb") && exercise.kind === "build")).toBe(true);
    expect(sentenceKinds.some(({ where, exercise }) => where.startsWith("noun") && exercise.kind === "error")).toBe(true);
    expect(sentenceKinds.some(({ where, exercise }) => where.startsWith("lesson") && exercise.kind === "dictation")).toBe(true);
  });

  it("build and dictation tokens rebuild the correct sentence", () => {
    const broken = sentenceKinds.filter(({ exercise }) => (exercise.kind === "build" || exercise.kind === "dictation") && (exercise.tokens ?? []).join(" ") !== exercise.correctAnswer);

    expect(broken.map((item) => item.where)).toEqual([]);
  });

  it("error exercises point at a real wrong word and differ from the correct sentence", () => {
    const errors = sentenceKinds.filter(({ exercise }) => exercise.kind === "error");
    const broken = errors.filter(({ exercise }) => {
      const tokens = exercise.tokens ?? [];
      const indexes = exercise.errorIndexes ?? [];
      return indexes.length === 0 || indexes.some((index) => index < 0 || index >= tokens.length) || tokens.join(" ") === exercise.answerText || tokenize(exercise.answerText ?? "").length !== tokens.length;
    });

    expect(errors.length).toBeGreaterThan(100);
    expect(broken.map((item) => item.where)).toEqual([]);
  });

  it("every sentence exercise has audio, an explanation and no Cyrillic in the Czech sentence", () => {
    const hasCyrillic = (text: string) => /[Ѐ-ӿ]/.test(text);
    const broken = sentenceKinds.filter(({ exercise }) => !exercise.audio || hasCyrillic(exercise.audio) || !exercise.explanation?.length || (exercise.tokens ?? []).some(hasCyrillic));

    expect(broken.map((item) => item.where)).toEqual([]);
  });

  it("dictation never reveals the sentence in the question", () => {
    const leaks = sentenceKinds.filter(({ exercise }) => exercise.kind === "dictation" && exercise.question.includes(exercise.correctAnswer));

    expect(leaks).toEqual([]);
  });

  it("no word is a unique dead end: tiles can always be matched back to the sentence", () => {
    const tooShort = sentenceKinds.filter(({ exercise }) => (exercise.kind === "build" || exercise.kind === "dictation") && (exercise.tokens ?? []).length < 3);

    expect(tooShort).toEqual([]);
  });
});

describe("preposition exercises", () => {
  const drills = nouns.flatMap((noun) =>
    noun.exercises.filter((exercise) => /після прийменника/.test(exercise.question)).map((exercise) => ({ noun, exercise })),
  );

  it("every noun gets at least one, with a valid answer and explanation", () => {
    const covered = new Set(drills.map((item) => item.noun.noun));

    expect(nouns.filter((noun) => !covered.has(noun.noun)).map((noun) => noun.noun)).toEqual([]);
    expect(drills.filter(({ exercise }) => !exercise.options.includes(exercise.correctAnswer) || exercise.options.length < 2 || !exercise.explanation?.length)).toEqual([]);
  });

  it("the answer is the form of the case the preposition requires", () => {
    const required: Record<string, keyof (typeof nouns)[number]["singular"]> = {
      bez: "genitive", do: "genitive", od: "genitive", vedle: "genitive", k: "dative", o: "locative", s: "instrumental", pro: "accusative",
    };
    const wrong = drills.filter(({ noun, exercise }) => {
      const preposition = /прийменника “([^”]+)”/.exec(exercise.question)?.[1] ?? "";
      return noun.singular[required[preposition]] !== exercise.correctAnswer;
    });

    expect(wrong.map((item) => item.noun.noun + ": " + item.exercise.question)).toEqual([]);
  });

  it("does not ask «s» or «k» before words that need se / ke", () => {
    const risky = drills.filter(({ exercise }) => (/“s”/.test(exercise.question) && /^[szšž]/i.test(exercise.correctAnswer)) || (/“k”/.test(exercise.question) && /^[kg]/i.test(exercise.correctAnswer)));

    expect(risky).toEqual([]);
  });
});
