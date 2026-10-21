import { grammarModules } from "../data/grammarModules";
import { nouns } from "../data/nouns";
import { verbs } from "../data/verbs";

export const SITE_TITLE = "Česky A1–A2";

const staticTitles: Record<string, string> = {
  "/": "Головна",
  "/learn": "Вчити",
  "/course": "Курс A1–A2",
  "/verbs": "Дієслова",
  "/nouns": "Іменники",
  "/nouns/rules": "Правила відмінювання іменників",
  "/modules": "Граматика",
  "/start/pronunciation": "Вимова",
  "/start/phrases": "Перші фрази",
  "/practice": "Тренування",
  "/statistics": "Статистика",
  "/profile": "Профіль",
  "/privacy": "Конфіденційність",
  "/admin": "Статистика сайту",
};

/** Назва сторінки для вкладки браузера й екранних читачів, наприклад «Дієслово dělat · Česky A1–A2». */
export const pageTitle = (pathname: string): string => {
  const path = pathname.replace(/\/+$/, "") || "/";
  const known = staticTitles[path];

  const verb = /^\/verbs\/(\d+)(\/exercises)?$/.exec(path);
  if (verb) {
    const found = verbs.find((item) => item.id === Number(verb[1]));
    return found ? (verb[2] ? "Вправи: " : "Дієслово ") + found.infinitive : "Дієслово не знайдено";
  }

  const noun = /^\/nouns\/(\d+)(\/exercises)?$/.exec(path);
  if (noun) {
    const found = nouns.find((item) => item.id === Number(noun[1]));
    return found ? (noun[2] ? "Вправи: " : "Іменник ") + found.noun : "Іменник не знайдено";
  }

  if (/^\/nouns\/rules\/[^/]+$/.test(path)) {
    return "Правила відмінювання іменників";
  }

  const lesson = /^\/modules\/([^/]+)\/([^/]+)(\/exercises)?$/.exec(path);
  if (lesson) {
    const found = grammarModules.find((module) => module.id === lesson[1])?.lessons.find((item) => item.id === lesson[2]);
    return found ? (lesson[3] ? "Вправи: " : "Урок ") + found.title : "Урок не знайдено";
  }

  const module = /^\/modules\/([^/]+)$/.exec(path);
  if (module) {
    return grammarModules.find((item) => item.id === module[1])?.title ?? "Модуль не знайдено";
  }

  return known ?? "Сторінку не знайдено";
};

export const documentTitle = (pathname: string) => {
  const title = pageTitle(pathname);
  return title === "Головна" ? SITE_TITLE + " · вивчаємо чеську мову" : title + " · " + SITE_TITLE;
};
