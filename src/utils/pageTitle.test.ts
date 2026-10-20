import { describe, expect, it } from "vitest";
import { grammarModules } from "../data/grammarModules";
import { nouns } from "../data/nouns";
import { verbs } from "../data/verbs";
import { documentTitle, pageTitle } from "./pageTitle";

describe("pageTitle", () => {
  it("titles static pages", () => {
    expect(pageTitle("/practice")).toBe("Тренування");
    expect(pageTitle("/verbs/")).toBe("Дієслова");
    expect(documentTitle("/")).toContain("Česky A1–A2");
    expect(documentTitle("/profile")).toBe("Профіль · Česky A1–A2");
  });

  it("titles word and lesson pages from the data", () => {
    expect(pageTitle("/verbs/" + verbs[0].id)).toBe("Дієслово " + verbs[0].infinitive);
    expect(pageTitle("/verbs/" + verbs[0].id + "/exercises")).toBe("Вправи: " + verbs[0].infinitive);
    expect(pageTitle("/nouns/" + nouns[0].id)).toBe("Іменник " + nouns[0].noun);
    const module = grammarModules[0];
    expect(pageTitle("/modules/" + module.id)).toBe(module.title);
    expect(pageTitle("/modules/" + module.id + "/" + module.lessons[0].id)).toBe("Урок " + module.lessons[0].title);
  });

  it("has a distinct title for every page the site can open", () => {
    const paths = ["/", "/learn", "/verbs", "/nouns", "/nouns/rules", "/modules", "/start/pronunciation", "/start/phrases", "/practice", "/statistics", "/profile", "/privacy", "/admin"];
    const titles = paths.map(pageTitle);

    expect(titles.some((title) => title.includes("не знайдено"))).toBe(false);
    expect(new Set(titles).size).toBe(paths.length);
  });

  it("explains unknown pages", () => {
    expect(pageTitle("/verbs/99999")).toBe("Дієслово не знайдено");
    expect(pageTitle("/nonsense")).toBe("Сторінку не знайдено");
  });
});
