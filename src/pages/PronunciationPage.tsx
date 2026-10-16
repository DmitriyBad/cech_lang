import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SpeakButton from "../components/SpeakButton";
import { pronunciationIntro, pronunciationRules, soundGroups } from "../data/startGuide";
import { updateStartGuideState } from "../utils/startGuide";

export default function PronunciationPage() {
  useEffect(() => {
    updateStartGuideState({ pronunciationSeen: true });
  }, []);

  return (
    <div className="space-y-6">
      <Link to="/" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        На головну
      </Link>

      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Вимова: з чого почати</h1>
        <p className="max-w-3xl text-slate-700">{pronunciationIntro}</p>
      </section>

      <section className="space-y-3" aria-labelledby="rules-title">
        <h2 id="rules-title" className="text-xl font-bold text-slate-950">Чотири головні правила</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {pronunciationRules.map((rule) => (
            <article key={rule.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <h3 className="font-semibold text-slate-950">{rule.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{rule.text}</p>
              {rule.example ? (
                <p className="mt-3 flex items-center gap-2 text-sm">
                  <span lang="cs" className="font-semibold text-slate-950">{rule.example.cz}</span>
                  <SpeakButton text={rule.example.cz} />
                  <span className="text-slate-500">— {rule.example.ua}</span>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {soundGroups.map((group) => (
        <section key={group.id} className="space-y-3" aria-labelledby={"group-" + group.id}>
          <div>
            <h2 id={"group-" + group.id} className="text-xl font-bold text-slate-950">{group.title}</h2>
            <p className="text-sm text-slate-600">{group.intro}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {group.items.map((item) => (
              <article key={item.letter} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span lang="cs" className="text-2xl font-bold text-blue-700">{item.letter}</span>
                  <span className="text-sm text-slate-700">≈ {item.sound}</span>
                </p>
                <ul className="mt-2 space-y-1">
                  {item.examples.map((example) => (
                    <li key={example.cz} className="flex items-center gap-2 text-sm">
                      <span lang="cs" className="font-semibold text-slate-950">{example.cz}</span>
                      <SpeakButton text={example.cz} />
                      <span className="text-slate-500">— {example.ua}</span>
                    </li>
                  ))}
                </ul>
                {item.note ? <p className="mt-2 text-xs text-slate-600">{item.note}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ))}

      <Link to="/start/phrases" className="focus-ring inline-flex min-h-11 items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        Далі: перші фрази
      </Link>
    </div>
  );
}
