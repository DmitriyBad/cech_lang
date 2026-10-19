import { Cloud, LogOut, Mail, Save, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { verbs } from "../data/verbs";
import { useProgress } from "../hooks/useProgress";
import { setConsent, useConsent } from "../lib/analytics";
import { signInWithEmail, signInWithGoogle, signOut, useAuth } from "../lib/auth";
import { deleteCloudData, pullAndMerge, pushNow, useSyncStatus } from "../lib/sync";
import { renameProfile } from "../utils/storage";

const statusText = {
  idle: "",
  syncing: "Синхронізація…",
  ok: "Прогрес збережено в хмарі",
  error: "Не вдалося синхронізувати. Перевірте з'єднання й спробуйте ще раз.",
} as const;

export default function ProfilePage() {
  const { activeNickname, changeNickname, learnedCount, totalAnswers, successRate } = useProgress(verbs.length);
  const { session, isAdmin, ready } = useAuth();
  const syncStatus = useSyncStatus();
  const consent = useConsent();
  const [draft, setDraft] = useState(activeNickname);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    setDraft(activeNickname);
  }, [activeNickname]);

  const handleNickname = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (session) {
      // В акаунті прогрес один: нікнейм лише змінює ім'я, а не створює новий профіль.
      renameProfile(activeNickname, draft);
      await pushNow();
    } else {
      changeNickname(draft);
    }

    setSaved(true);
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setAuthMessage("");
    const error = await signInWithEmail(email);
    setSending(false);
    setAuthError(Boolean(error));
    setAuthMessage(error ? "Не вдалося надіслати лист: " + error : "Лист надіслано. Відкрийте лінк із листа на цьому пристрої.");
  };

  const handleGoogle = async () => {
    setAuthError(false);
    setAuthMessage("");
    const error = await signInWithGoogle();

    if (error) {
      setAuthError(true);
      setAuthMessage("Не вдалося увійти через Google: " + error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Видалити з хмари ваш прогрес, профіль і статистику? Локальний прогрес у цьому браузері лишиться.")) {
      return;
    }

    const done = await deleteCloudData();
    if (done) {
      await signOut();
    }
    setDeleteMessage(done ? "Хмарні дані видалено." : "Не вдалося видалити. Спробуйте ще раз.");
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Профіль</h1>
        <p className="mt-2 max-w-2xl text-slate-700">
          Без входу прогрес зберігається лише в цьому браузері. Увійдіть за email, щоб мати його на всіх пристроях.
        </p>
      </section>

      <section className="max-w-xl space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft" aria-label="Вхід">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <Cloud size={20} className="text-blue-700" aria-hidden="true" />
          {session ? "Ви ввійшли" : "Вхід за email"}
        </h2>

        {!ready ? (
          <p className="text-sm text-slate-700">Завантаження…</p>
        ) : session ? (
          <>
            <p className="text-sm text-slate-800">Акаунт: <strong>{session.user.email}</strong></p>
            <p role="status" className="text-sm text-slate-700">{statusText[syncStatus]}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void pullAndMerge()} className="focus-ring min-h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                Синхронізувати зараз
              </button>
              <button type="button" onClick={() => void signOut()} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                <LogOut size={17} aria-hidden="true" />
                Вийти
              </button>
              {isAdmin ? (
                <Link to="/admin" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800">
                  <ShieldCheck size={17} aria-hidden="true" />
                  Статистика сайту
                </Link>
              ) : null}
            </div>
          </>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-3">
            <button type="button" onClick={() => void handleGoogle()} className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              Увійти через Google
            </button>
            <p className="text-center text-xs text-slate-700">або</p>
            <label className="block text-sm font-semibold text-slate-950" htmlFor="auth-email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-base text-slate-950 placeholder:text-slate-500"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <button type="submit" disabled={sending} className="focus-ring min-h-11 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {sending ? "Надсилаємо…" : "Надіслати лінк для входу"}
            </button>
            <p role="status" className={authError ? "text-sm text-red-700" : "text-sm text-slate-700"}>{authMessage}</p>
            <p className="text-xs text-slate-700">Пароль не потрібен. Прогрес гостя з цього браузера перенесеться в акаунт.</p>
          </form>
        )}
      </section>

      <form onSubmit={handleNickname} className="max-w-xl space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <label className="block text-sm font-semibold text-slate-950" htmlFor="profile-nickname">Нікнейм</label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
          <input
            id="profile-nickname"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setSaved(false);
            }}
            className="focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-base text-slate-950 placeholder:text-slate-500"
            placeholder="Ваш нікнейм"
            type="text"
            autoComplete="nickname"
            maxLength={32}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
            <Save size={17} aria-hidden="true" />
            Зберегти
          </button>
          <p role="status" className="text-sm text-slate-700">{saved ? "Збережено" : ""}</p>
        </div>
      </form>

      <section className="grid max-w-xl gap-3 sm:grid-cols-3" aria-label="Підсумок профілю">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-700">Вивчено дієслів</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{learnedCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-700">Відповідей</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{totalAnswers}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-700">Успішність</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{successRate}%</p>
        </div>
      </section>

      <section className="max-w-xl space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft" aria-label="Конфіденційність">
        <h2 className="text-lg font-bold text-slate-950">Конфіденційність</h2>
        <label className="flex min-h-11 items-center gap-3 text-sm text-slate-900">
          <input
            type="checkbox"
            checked={consent === "granted"}
            onChange={(event) => setConsent(event.target.checked ? "granted" : "denied")}
            className="h-5 w-5"
          />
          Дозволити анонімну статистику відвідувань
        </label>
        <p className="text-sm text-slate-700">
          <Link to="/privacy" className="font-semibold text-blue-700 underline">Що саме зберігається</Link>
        </p>
        {session ? (
          <div className="space-y-2">
            <button type="button" onClick={() => void handleDelete()} className="focus-ring min-h-11 rounded-md border border-red-300 bg-white px-4 text-sm font-semibold text-red-800 hover:bg-red-50">
              Видалити мої хмарні дані
            </button>
            <p role="status" className="text-sm text-slate-700">{deleteMessage}</p>
          </div>
        ) : null}
      </section>

      <p className="text-sm text-slate-700">
        Скинути локальний прогрес можна на сторінці <Link to="/statistics" className="font-semibold text-blue-700 underline">«Статистика»</Link>.
      </p>
    </div>
  );
}
