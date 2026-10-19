import { BookMarked, BookOpen, Grid2X2 } from "lucide-react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { grammarModules } from "../data/grammarModules";
import { nouns } from "../data/nouns";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";

export default function LearnPage() {
  const { learnedCount, getModuleStats } = useProgress(verbs.length);
  const nounStats = getModuleStats("nouns", nouns.length);
  const lessonTotal = grammarModules.reduce((sum, module) => sum + module.lessons.length, 0);
  const lessonDone = grammarModules.reduce((sum, module) => sum + getModuleStats(module.id, module.lessons.length).learnedCount, 0);

  const sections = [
    { to: "/verbs", icon: BookOpen, title: "Дієслова", text: "Відмінювання, минулий і майбутній час, приклади", done: learnedCount, total: verbs.length },
    { to: "/nouns", icon: BookMarked, title: "Іменники", text: "Відмінки однини й множини, правила відмінювання", done: nounStats.learnedCount, total: nouns.length },
    { to: "/modules", icon: Grid2X2, title: "Граматика", text: "Числа, дати, прикметники, прийменники, часи", done: lessonDone, total: lessonTotal },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Вчити</h1>
        <p className="mt-2 text-slate-600">Оберіть, що вчити сьогодні.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.to} to={section.to} className="focus-ring block rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:border-blue-300">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-blue-700">
              <section.icon size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{section.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{section.text}</p>
            <div className="mt-4">
              <ProgressBar value={section.total === 0 ? 0 : Math.round((section.done / section.total) * 100)} label={section.done + " з " + section.total} />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
