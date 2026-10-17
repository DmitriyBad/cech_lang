import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PatternTable from "../components/PatternTable";
import SpeakButton from "../components/SpeakButton";
import {
  caseExplanations,
  declensionPatterns,
  prepositionGroups,
  rememberPoints,
  soundChanges,
  whereVsWhereTo,
} from "../data/declensionRules";

const genderOrder = ["чоловічий", "жіночий", "середній"] as const;

export default function NounRulesPage() {
  const { patternId } = useParams();

  // Хеш у URL зайнятий маршрутизатором, тому до потрібного зразка прокручуємо самі.
  useEffect(() => {
    if (patternId) {
      document.getElementById("pattern-" + patternId)?.scrollIntoView({ block: "start" });
    }
  }, [patternId]);

  return (
    <div className="space-y-8">
      <Link to="/nouns" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        До іменників
      </Link>

      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Правила відмінювання іменників</h1>
        <p className="max-w-3xl text-slate-700">
          У чеській, як і в українській, сім відмінків, і ставимо ми до них ті самі запитання. Різниця в тому, що чеська
          мова не має «одного» закінчення для відмінка: воно залежить від роду слова та від того, на що закінчується називний.
          Тому вчимо не слова по одному, а кілька зразків.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="cases-title">
        <h2 id="cases-title" className="text-xl font-bold text-slate-950">1. Сім відмінків</h2>
        <p className="text-sm text-slate-600">Чеська нумерація відрізняється від української: кличний п'ятий, а орудний сьомий.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {caseExplanations.map((item) => (
            <article key={item.key} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <h3 className="flex flex-wrap items-baseline gap-x-2 font-semibold text-slate-950">
                <span lang="cs">{item.title}</span>
                <span className="text-sm font-normal text-slate-500">= {item.ukrainian}</span>
              </h3>
              <p className="mt-1 text-sm font-medium text-blue-700">{item.question}</p>
              <p className="mt-2 text-sm text-slate-700">{item.usage}</p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span lang="cs" className="font-semibold text-slate-950">{item.example.cz}</span>
                <SpeakButton text={item.example.cz} />
                <span className="text-slate-500">— {item.example.ua}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="prepositions-title">
        <h2 id="prepositions-title" className="text-xl font-bold text-slate-950">2. Який відмінок після прийменника</h2>
        <div tabIndex={0} role="region" aria-label="Прийменники й відмінки" className="focus-ring relative overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-soft">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Відмінок</th>
                <th scope="col" className="px-3 py-2 font-semibold">Прийменники</th>
                <th scope="col" className="px-3 py-2 font-semibold">Приклад</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {prepositionGroups.map((group) => (
                <tr key={group.caseTitle}>
                  <th scope="row" className="px-3 py-2 font-semibold text-slate-800" lang="cs">{group.caseTitle}</th>
                  <td className="px-3 py-2 text-slate-700" lang="cs">{group.prepositions}</td>
                  <td className="px-3 py-2 text-slate-950" lang="cs">{group.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Де? чи куди? Один і той самий прийменник «na» дає різні відмінки.</p>
          <ul className="mt-2 space-y-1">
            {[whereVsWhereTo.where, whereVsWhereTo.whereTo].map((item) => (
              <li key={item.cz} className="flex flex-wrap items-center gap-2">
                <span lang="cs" className="font-semibold">{item.cz}</span>
                <SpeakButton text={item.cz} />
                <span>— {item.ua}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-xl font-bold text-slate-950">3. Як відмінювати слово: три кроки</h2>
        <ol className="list-decimal space-y-2 pl-6 text-slate-700">
          <li>Визначте рід: чоловічий (закінчується на приголосний), жіночий (на -a, -e чи -ost) або середній (на -o, -e, -í).</li>
          <li>Для чоловічого роду з'ясуйте, чи це істота (студент) чи річ (магазин), а також чи приголосний твердий чи м'який.</li>
          <li>Знайдіть нижче зразок із тим самим закінченням і поставте закінчення відмінка до основи вашого слова. Закінчення виділено синім.</li>
        </ol>
      </section>

      <section className="space-y-6" aria-labelledby="patterns-title">
        <h2 id="patterns-title" className="text-xl font-bold text-slate-950">4. Зразки відмінювання</h2>
        <p className="text-sm text-slate-600">
          Знак ∅ означає, що закінчення немає. Біля кожної форми є озвучення. Закінчення в таблицях типові: якщо слово має чергування чи виняток, його точні форми дивіться на сторінці слова.
        </p>
        {genderOrder.map((gender) => (
          <div key={gender} className="space-y-4">
            <h3 className="text-lg font-bold capitalize text-slate-950">{gender} рід</h3>
            {declensionPatterns
              .filter((pattern) => pattern.gender === gender)
              .map((pattern) => (
                <article
                  key={pattern.id}
                  id={"pattern-" + pattern.id}
                  className={"scroll-mt-24 space-y-2 rounded-lg " + (pattern.id === patternId ? "ring-2 ring-blue-400 ring-offset-4" : "")}
                >
                  <h4 className="font-semibold text-slate-950">
                    {pattern.title}: <span lang="cs">{pattern.example}</span> — {pattern.translation}
                  </h4>
                  <p className="text-sm text-slate-600">
                    Так відмінюються: <span lang="cs">{pattern.covers}</span>
                  </p>
                  <PatternTable pattern={pattern} />
                  {pattern.note ? <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{pattern.note}</p> : null}
                </article>
              ))}
          </div>
        ))}
        <p className="text-sm text-slate-600">
          Чоловічі слова на -a (<span lang="cs">kolega, turista</span>) мають чоловічий рід, але відмінюються здебільшого як <span lang="cs">žena</span>, а слово <span lang="cs">centrum</span> має особливу таблицю; їхні форми дивіться на сторінках слів.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="changes-title">
        <h2 id="changes-title" className="text-xl font-bold text-slate-950">5. Чергування, які треба знати</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {soundChanges.map((change) => (
            <article key={change.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <h3 className="font-semibold text-slate-950">{change.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{change.text}</p>
              <ul className="mt-2 space-y-1">
                {change.examples.map((example) => (
                  <li key={example.cz} className="flex flex-wrap items-center gap-2 text-sm">
                    <span lang="cs" className="font-semibold text-slate-950">{example.cz}</span>
                    <span className="text-slate-500">— {example.ua}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="remember-title">
        <h2 id="remember-title" className="text-xl font-bold text-slate-950">6. Запам'ятайте</h2>
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          {rememberPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <Link to="/nouns" className="focus-ring inline-flex min-h-11 items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        До списку іменників
      </Link>
    </div>
  );
}
