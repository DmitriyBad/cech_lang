import { beforeEach, describe, expect, it, vi } from "vitest";
import { emptyProgress, loadActiveNickname, loadProgress, mergeProgress, renameProfile, saveActiveNickname, saveProgress } from "./storage";

const card = (lastDay: number, interval: number) => ({ reps: 1, interval, ease: 2.5, due: lastDay + interval, lastDay, lapses: 0 });

describe("mergeProgress", () => {
  it("unions learned verbs and keeps the larger counters", () => {
    const merged = mergeProgress(
      { ...emptyProgress, learnedVerbIds: [1, 2], correctAnswers: 10, wrongAnswers: 2, mistakesByVerbId: { 1: 3 } },
      { ...emptyProgress, learnedVerbIds: [2, 3], correctAnswers: 7, wrongAnswers: 5, mistakesByVerbId: { 1: 1, 4: 2 } },
    );

    expect(merged.learnedVerbIds.sort()).toEqual([1, 2, 3]);
    expect(merged.correctAnswers).toBe(10);
    expect(merged.wrongAnswers).toBe(5);
    expect(merged.mistakesByVerbId).toEqual({ 1: 3, 4: 2 });
  });

  it("merges module progress and prefers the fresher srs card", () => {
    const merged = mergeProgress(
      {
        ...emptyProgress,
        moduleProgress: { nouns: { completedItemIds: ["1"], correctAnswers: 3, wrongAnswers: 0, mistakesByItemId: {} } },
        srs: { "v:1": card(100, 3), "v:2": card(90, 1) },
      },
      {
        ...emptyProgress,
        moduleProgress: { nouns: { completedItemIds: ["2"], correctAnswers: 1, wrongAnswers: 1, mistakesByItemId: { "2": 1 } } },
        srs: { "v:1": card(95, 1), "v:3": card(50, 1) },
      },
    );

    expect(merged.moduleProgress.nouns.completedItemIds.sort()).toEqual(["1", "2"]);
    expect(merged.moduleProgress.nouns.correctAnswers).toBe(3);
    expect(merged.moduleProgress.nouns.mistakesByItemId).toEqual({ "2": 1 });
    expect(merged.srs["v:1"].lastDay).toBe(100);
    expect(Object.keys(merged.srs).sort()).toEqual(["v:1", "v:2", "v:3"]);
  });

  it("is symmetric for learned verbs", () => {
    const a = { ...emptyProgress, learnedVerbIds: [1] };
    const b = { ...emptyProgress, learnedVerbIds: [2] };
    expect(mergeProgress(a, b).learnedVerbIds.sort()).toEqual(mergeProgress(b, a).learnedVerbIds.sort());
  });
});

describe("renameProfile", () => {
  beforeEach(() => {
    const data = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => void data.set(key, value),
        removeItem: (key: string) => void data.delete(key),
      },
      dispatchEvent: () => true,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    });
    vi.stubGlobal("Event", class {});
  });

  it("moves progress to the new nickname and activates it", () => {
    saveActiveNickname("Old");
    saveProgress("Old", { ...emptyProgress, learnedVerbIds: [5] });

    expect(renameProfile("Old", "New")).toBe("New");
    expect(loadActiveNickname()).toBe("New");
    expect(loadProgress("New").learnedVerbIds).toEqual([5]);
    expect(loadProgress("Old").learnedVerbIds).toEqual([]);
  });

  it("merges into an existing profile instead of overwriting it", () => {
    saveProgress("A", { ...emptyProgress, learnedVerbIds: [1] });
    saveProgress("B", { ...emptyProgress, learnedVerbIds: [2] });

    renameProfile("A", "B");

    expect(loadProgress("B").learnedVerbIds.sort()).toEqual([1, 2]);
  });
});
