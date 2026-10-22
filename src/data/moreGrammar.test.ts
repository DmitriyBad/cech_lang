import { describe, expect, it } from "vitest";
import { grammarModules } from "./grammarModules";
import { moreLessonSentences, moreModuleDefs } from "./moreGrammar";
import { tokenize } from "./sentenceExercises";

const wordAt = (text: string, focus: string) => {
  const index = text.indexOf(focus);
  const before = index === 0 ? "" : text[index - 1];
  const after = text[index + focus.length] ?? "";
  return index >= 0 && !/[\p{L}]/u.test(before) && !/[\p{L}]/u.test(after);
};

describe("Етап 4: нові модулі", () => {
  it("кожен урок має 8 речень і є в grammarModules", () => {
    for (const module of moreModuleDefs) {
      const built = grammarModules.find((item) => item.id === module.id);
      expect(built, module.id).toBeDefined();
      for (const [id] of module.lessons) {
        expect(moreLessonSentences[id], id).toHaveLength(8);
        expect(built!.lessons.find((lesson) => lesson.id === id), id).toBeDefined();
      }
    }
  });

  it("ключове слово — окреме слово в реченні, а хибні форми відрізняються", () => {
    const bad: string[] = [];
    for (const [id, sentences] of Object.entries(moreLessonSentences)) {
      for (const sentence of sentences) {
        const [w1, w2] = sentence.wrong;
        if (!wordAt(sentence.cz, sentence.focus)) bad.push(id + ": focus " + sentence.cz);
        if (new Set([sentence.focus, w1, w2]).size !== 3) bad.push(id + ": однакові варіанти " + sentence.cz);
        if (!sentence.ua.trim() || tokenize(sentence.cz).length < 2) bad.push(id + ": порожній переклад " + sentence.cz);
      }
    }
    expect(bad).toEqual([]);
  });

  it("речення в межах уроку не повторюються", () => {
    for (const [id, sentences] of Object.entries(moreLessonSentences)) {
      expect(new Set(sentences.map((sentence) => sentence.cz)).size, id).toBe(sentences.length);
    }
  });

  it("у кожного уроку є вправи й унікальні запитання", () => {
    for (const module of moreModuleDefs) {
      for (const [id] of module.lessons) {
        const lesson = grammarModules.find((item) => item.id === module.id)!.lessons.find((item) => item.id === id)!;
        expect(lesson.exercises.length, id).toBeGreaterThanOrEqual(16);
        expect(lesson.exercises.every((exercise) => exercise.options.includes(exercise.correctAnswer) || exercise.kind), id).toBe(true);
      }
    }
  });
});
