import { describe, expect, it } from "vitest";
import { emptyProgress } from "../utils/storage";
import {
  createSession,
  currentIndex,
  getPracticeItem,
  isFinished,
  mistakeSources,
  pickSessionItems,
  recordAnswer,
  sanitizeSession,
  sessionScore,
} from "./practice";

// Простий детермінований генератор для відтворюваних тестів.
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe("practice picking", () => {
  it("picks 10 unique valid items for each topic", () => {
    for (const topic of ["all", "verbs", "nouns", "grammar"] as const) {
      const ids = pickSessionItems(topic, emptyProgress, 10, seeded(7));
      expect(ids).toHaveLength(10);
      expect(new Set(ids).size).toBe(10);
      for (const id of ids) expect(getPracticeItem(id), id).not.toBeNull();
    }
  });

  it("mixes verbs, nouns and lessons in «all»", () => {
    const kinds = new Set(pickSessionItems("all", emptyProgress, 9, seeded(3)).map((id) => id.split(":")[0]));
    expect(kinds).toEqual(new Set(["v", "n", "l"]));
  });

  it("uses different words when there are enough of them", () => {
    const ids = pickSessionItems("verbs", emptyProgress, 10, seeded(11));
    expect(new Set(ids.map((id) => id.split(":")[1])).size).toBe(10);
  });

  it("restricts «mistakes» to words with mistakes", () => {
    const progress = {
      ...emptyProgress,
      mistakesByVerbId: { 3: 2 },
      moduleProgress: { nouns: { completedItemIds: [], correctAnswers: 0, wrongAnswers: 0, mistakesByItemId: { "5": 1 } } },
    };
    expect(mistakeSources(progress).map((source) => source.kind + source.key).sort()).toEqual(["noun5", "verb3"]);
    const ids = pickSessionItems("mistakes", progress, 10, seeded(1));
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.every((id) => id.startsWith("v:3:") || id.startsWith("n:5:"))).toBe(true);
    expect(pickSessionItems("mistakes", emptyProgress, 10)).toEqual([]);
  });
});

describe("practice session", () => {
  it("tracks answers, score and finish", () => {
    const ids = pickSessionItems("verbs", emptyProgress, 3, seeded(2));
    let session = createSession("verbs", ids, 1);
    expect(currentIndex(session)).toBe(0);
    session = recordAnswer(session, 0, { correct: true, given: "a" });
    session = recordAnswer(session, 0, { correct: false, given: "b" }); // повторний запис ігнорується
    session = recordAnswer(session, 1, { correct: false, given: "" });
    expect(sessionScore(session)).toEqual({ correct: 1, answered: 2, total: 3 });
    expect(isFinished(session)).toBe(false);
    session = recordAnswer(session, 2, { correct: true, given: "c" });
    expect(isFinished(session)).toBe(true);
  });

  it("sanitizes stored sessions", () => {
    const ids = pickSessionItems("nouns", emptyProgress, 2, seeded(5));
    const session = createSession("nouns", ids, 1);
    expect(sanitizeSession(JSON.parse(JSON.stringify(session)))).toEqual(session);
    expect(sanitizeSession({ ...session, items: ["v:99999:0", ids[1]] })).toBeNull();
    expect(sanitizeSession({ ...session, answers: [null] })).toBeNull();
    expect(sanitizeSession({ ...session, topic: "x" })).toBeNull();
    expect(sanitizeSession(null)).toBeNull();
  });
});
