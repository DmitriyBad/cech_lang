import { describe, expect, it } from "vitest";
import { cardLevel, isDue, normalizeCard, reviewCard, todayNumber } from "./srs";

describe("spaced repetition", () => {
  it("grows intervals over several days: 1, 3, then × ease", () => {
    let card = reviewCard(undefined, true, 100);
    expect([card.reps, card.interval, card.due]).toEqual([1, 1, 101]);
    card = reviewCard(card, true, 101);
    expect([card.reps, card.interval, card.due]).toEqual([2, 3, 104]);
    card = reviewCard(card, true, 104);
    expect(card.reps).toBe(3);
    expect(card.interval).toBe(Math.round(3 * 2.55));
    expect(card.due).toBe(104 + card.interval);
  });

  it("does not grow the interval for repeated correct answers on the same day", () => {
    const first = reviewCard(undefined, true, 100);
    const again = reviewCard(first, true, 100);
    expect(again).toEqual(first);
  });

  it("returns a failed card to today and resets the streak", () => {
    const grown = reviewCard(reviewCard(reviewCard(undefined, true, 1), true, 2), true, 5);
    const failed = reviewCard(grown, false, 20);
    expect(failed.reps).toBe(0);
    expect(failed.due).toBe(20);
    expect(failed.lapses).toBe(1);
    expect(failed.ease).toBeLessThan(grown.ease);
    expect(isDue(failed, 20)).toBe(true);
    // повторна помилка того ж дня нічого не змінює
    expect(reviewCard(failed, false, 20)).toEqual(failed);
  });

  it("recovers a card corrected on the same day with a one-day interval", () => {
    const failed = reviewCard(undefined, false, 50);
    const fixed = reviewCard(failed, true, 50);
    expect([fixed.reps, fixed.interval, fixed.due]).toEqual([1, 1, 51]);
    expect(isDue(fixed, 50)).toBe(false);
  });

  it("keeps ease within bounds and caps the interval", () => {
    let card = reviewCard(undefined, false, 0);
    for (let i = 0; i < 20; i += 1) card = reviewCard(reviewCard(card, true, i * 1000 + 1), false, i * 1000 + 2);
    expect(card.ease).toBeGreaterThanOrEqual(1.3);
    let long = reviewCard(undefined, true, 0);
    for (let day = 1; day < 40; day += 1) long = reviewCard(long, true, long.due);
    expect(long.interval).toBeLessThanOrEqual(180);
    expect(long.ease).toBeLessThanOrEqual(2.8);
  });

  it("classifies levels and sanitizes stored data", () => {
    expect(cardLevel({ reps: 1, interval: 3, ease: 2.5, due: 0, lastDay: 0, lapses: 0 })).toBe("learning");
    expect(cardLevel({ reps: 4, interval: 12, ease: 2.5, due: 0, lastDay: 0, lapses: 0 })).toBe("known");
    expect(cardLevel({ reps: 6, interval: 60, ease: 2.5, due: 0, lastDay: 0, lapses: 0 })).toBe("strong");
    expect(normalizeCard({ reps: "x" })).toBeNull();
    expect(normalizeCard(null)).toBeNull();
    expect(normalizeCard({ reps: 1, interval: 999, ease: 9, due: 5, lastDay: 4, lapses: 0 })).toMatchObject({ interval: 180, ease: 2.8 });
  });

  it("computes a local day number", () => {
    expect(todayNumber(new Date(2026, 9, 19, 0, 5))).toBe(todayNumber(new Date(2026, 9, 19, 23, 55)));
    expect(todayNumber(new Date(2026, 9, 20, 0, 5))).toBe(todayNumber(new Date(2026, 9, 19, 12)) + 1);
  });
});
