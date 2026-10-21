import { describe, expect, it } from "vitest";
import { courseSteps, courseSummary, courseUnits, nextSteps, stepStatus } from "./course";
import { grammarModules } from "./grammarModules";
import { nouns } from "./nouns";
import { verbs } from "./verbs";
import { emptyProgress } from "../utils/storage";

describe("курс A1 → A2", () => {
  it("містить кожен урок граматики рівно один раз", () => {
    const lessonIds = courseSteps.filter((step) => step.kind === "lesson").map((step) => step.itemIds[0]);
    const all = grammarModules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
    expect([...lessonIds].sort()).toEqual([...all].sort());
  });

  it("містить кожне дієслово й іменник рівно один раз", () => {
    const verbIds = courseSteps.filter((step) => step.kind === "verbs").flatMap((step) => step.itemIds);
    const nounIds = courseSteps.filter((step) => step.kind === "nouns").flatMap((step) => step.itemIds);
    expect(verbIds.length).toBe(verbs.length);
    expect(new Set(verbIds).size).toBe(verbs.length);
    expect(nounIds.length).toBe(nouns.length);
    expect(new Set(nounIds).size).toBe(nouns.length);
  });

  it("має унікальні id і непорожні одиниці", () => {
    expect(new Set(courseSteps.map((step) => step.id)).size).toBe(courseSteps.length);
    courseUnits.forEach((unit) => expect(unit.steps.length).toBeGreaterThan(0));
  });

  it("рахує пройдені кроки й добирає чергу", () => {
    expect(courseSummary(emptyProgress).done).toBe(0);
    const first = courseSteps[0];
    const state = {
      ...emptyProgress,
      moduleProgress: { [first.moduleId as string]: { completedItemIds: first.itemIds, correctAnswers: 0, wrongAnswers: 0, mistakesByItemId: {} } },
    };
    expect(stepStatus(first, state).complete).toBe(true);
    expect(nextSteps(state, 2)[0].id).toBe(courseSteps[1].id);
    expect(courseSummary(state).done).toBe(1);
  });

  it("зараховує набір дієслів, коли всі вивчені", () => {
    const step = courseSteps.find((item) => item.kind === "verbs")!;
    const state = { ...emptyProgress, learnedVerbIds: step.itemIds.map(Number) };
    expect(stepStatus(step, state)).toMatchObject({ done: step.itemIds.length, complete: true });
  });
});
