import { Link } from "react-router-dom";
import { buildFutureForms, futureLabels, speakableFuture } from "../data/verbFuture";
import type { Verb } from "../types/Verb";
import SpeakButton from "./SpeakButton";

const pronounsForSpeech = ["já", "ty", "on", "my", "vy", "oni"];

export default function FutureTenseTable({ verb }: { verb: Pick<Verb, "infinitive" | "aspect"> }) {
  const forms = buildFutureForms(verb);

  if (!forms) {
    return null;
  }

  const own = ["být", "jít", "jet"].includes(verb.infinitive);

  return (
    <div className="space-y-2">
      <div tabIndex={0} role="region" aria-label={"Майбутній час дієслова " + verb.infinitive} className="focus-ring relative overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-soft">
        <table className="w-full min-w-[300px] border-collapse text-left">
          <caption className="sr-only">Майбутній час дієслова {verb.infinitive}</caption>
          <thead className="bg-slate-100 text-sm text-slate-600">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Особа</th>
              <th scope="col" className="px-3 py-2 font-semibold">Форма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {forms.map((form, index) => (
              <tr key={futureLabels[index]}>
                <th scope="row" className="px-3 py-2 text-sm font-medium text-slate-600">{futureLabels[index]}</th>
                <td className="px-3 py-2 font-semibold text-slate-950">
                  <span className="flex items-center justify-between gap-2">
                    <span lang="cs">{form}</span>
                    <SpeakButton text={speakableFuture(pronounsForSpeech[index], form)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
        {own
          ? "У цього дієслова майбутній час має особливі форми."
          : "Майбутній час недоконаного дієслова: budu, budeš, bude… + інфінітив."}{" "}
        Про заплановане майбутнє можна говорити й теперішнім часом.{" "}
        <Link to="/modules/tenses" className="font-semibold text-blue-700 underline">Уроки про майбутній час</Link>
      </p>
    </div>
  );
}
