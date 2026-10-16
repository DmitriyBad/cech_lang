import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SpeakButton from "../components/SpeakButton";
import { emergencyNote, phraseGroups } from "../data/startPhrases";
import { updateStartGuideState } from "../utils/startGuide";

export default function PhrasesPage() {
  useEffect(() => {
    updateStartGuideState({ phrasesSeen: true });
  }, []);

  return (
    <div className="space-y-6">
      <Link to="/" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
        <ArrowLeft size={18} aria-hidden="true" />
        На головну
      </Link>

      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Перші фрази</h1>
        <p className="max-w-3xl text-slate-700">
          Фрази, які знадобляться в перший же день. Вчіть їх цілими, без розбору граматики: послухайте й повторіть уголос.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {phraseGroups.map((group) => (
          <section key={group.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft" aria-labelledby={"phrases-" + group.id}>
            <h2 id={"phrases-" + group.id} className="text-lg font-bold text-slate-950">{group.title}</h2>
            <ul className="mt-3 divide-y divide-slate-100">
              {group.phrases.map((phrase) => (
                <li key={phrase.cz} className="py-2">
                  <p className="flex items-center gap-2">
                    <span lang="cs" className="font-semibold text-slate-950">{phrase.cz}</span>
                    <SpeakButton text={phrase.cz} />
                  </p>
                  <p className="text-sm text-slate-600">{phrase.ua}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">{emergencyNote}</p>

      <Link to="/modules/numbers/numbers-0-10" className="focus-ring inline-flex min-h-11 items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
        Далі: числа 0–10
      </Link>
    </div>
  );
}
