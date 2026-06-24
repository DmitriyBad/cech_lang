interface ProgressBarProps {
  value: number;
  label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
          <span>{label}</span>
          <span>{normalizedValue}%</span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-md bg-slate-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={normalizedValue}>
        <div className="h-full rounded-md bg-blue-600 transition-all" style={{ width: normalizedValue + "%" }} />
      </div>
    </div>
  );
}
