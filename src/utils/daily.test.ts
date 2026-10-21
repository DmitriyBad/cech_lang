import { describe, expect, it } from "vitest";
import { addAnswer, mergeActivity, normalizeActivity, normalizeGoal, recentDays, streakInfo, type ActivityLog } from "./daily";

const filled = (days: number[], answers: number): ActivityLog => Object.fromEntries(days.map((day) => [String(day), { answers, correct: answers }]));

describe("addAnswer", () => {
  it("counts answers and correct answers for the day", () => {
    let log = addAnswer({}, 100, true);
    log = addAnswer(log, 100, false);

    expect(log["100"]).toEqual({ answers: 2, correct: 1 });
  });

  it("drops entries older than about 13 months", () => {
    const log = addAnswer({ "10": { answers: 5, correct: 5 }, "900": { answers: 1, correct: 1 } }, 1000, true);

    expect(log["10"]).toBeUndefined();
    expect(log["900"]).toBeDefined();
  });
});

describe("streakInfo", () => {
  it("counts consecutive days that reached the goal, up to today", () => {
    const info = streakInfo(filled([97, 98, 99, 100], 10), 10, 100);

    expect(info.current).toBe(4);
    expect(info.todayDone).toBe(true);
  });

  it("keeps the streak alive until the end of today", () => {
    const info = streakInfo({ ...filled([97, 98, 99], 10), "100": { answers: 4, correct: 4 } }, 10, 100);

    expect(info.current).toBe(3);
    expect(info.todayDone).toBe(false);
    expect(info.todayAnswers).toBe(4);
  });

  it("resets after a missed day and finds the best streak", () => {
    const info = streakInfo(filled([90, 91, 92, 93, 97, 98], 10), 10, 100);

    expect(info.current).toBe(0);
    expect(info.best).toBe(4);
  });

  it("does not count days under the goal", () => {
    expect(streakInfo(filled([99, 100], 5), 10, 100).current).toBe(0);
    expect(streakInfo(filled([99, 100], 5), 5, 100).current).toBe(2);
  });
});

describe("merge and normalize", () => {
  it("takes the larger day when merging devices", () => {
    const merged = mergeActivity({ "5": { answers: 3, correct: 2 } }, { "5": { answers: 8, correct: 7 }, "6": { answers: 1, correct: 1 } });

    expect(merged["5"].answers).toBe(8);
    expect(merged["6"].answers).toBe(1);
  });

  it("sanitizes stored data", () => {
    expect(normalizeActivity({ "5": { answers: 3, correct: 99 }, x: { answers: 1 }, "6": { answers: -2 }, "7": null })).toEqual({ "5": { answers: 3, correct: 3 } });
    expect(normalizeActivity(null)).toEqual({});
    expect(normalizeGoal(20)).toBe(20);
    expect(normalizeGoal("abc")).toBe(10);
    expect(normalizeGoal(0)).toBe(10);
  });
});

describe("recentDays", () => {
  it("returns the last days ending today with weekday labels", () => {
    // 20747 = 2026-10-21 (середа).
    const bars = recentDays({ "20747": { answers: 12, correct: 10 } }, 10, 20747, 7);

    expect(bars).toHaveLength(7);
    expect(bars[6]).toMatchObject({ day: 20747, answers: 12, reached: true, isToday: true, label: "ср" });
    expect(bars[0].isToday).toBe(false);
  });
});
