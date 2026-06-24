import type { Verb } from "../types/Verb";

interface ConjugationTableProps {
  conjugation: Verb["conjugation"];
}

const rows = [
  ["já", "ja"],
  ["ty", "ty"],
  ["on/ona/ono", "on"],
  ["my", "my"],
  ["vy", "vy"],
  ["oni/ony", "oni"],
] as const;

export default function ConjugationTable({ conjugation }: ConjugationTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <table className="w-full border-collapse text-left">
        <thead className="bg-slate-100 text-sm text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Особа</th>
            <th className="px-4 py-3 font-semibold">Форма</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map(([label, key]) => (
            <tr key={key}>
              <td className="px-4 py-3 text-sm font-medium text-slate-600">{label}</td>
              <td className="px-4 py-3 text-base font-semibold text-slate-950">{conjugation[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
