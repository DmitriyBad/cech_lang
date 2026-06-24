import { LockKeyhole } from "lucide-react";

interface NicknameNoticeProps {
  title?: string;
}

export default function NicknameNotice({ title = "Введіть нікнейм, щоб почати навчання" }: NicknameNoticeProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-blue-700">
        <LockKeyhole size={20} aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-blue-800">
          Прогрес, правильні та неправильні відповіді зберігаються окремо для кожного нікнейма.
        </p>
      </div>
    </div>
  );
}
