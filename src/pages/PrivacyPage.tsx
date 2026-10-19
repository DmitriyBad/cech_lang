import { Link } from "react-router-dom";
import { setConsent, useConsent } from "../lib/analytics";

export default function PrivacyPage() {
  const consent = useConsent();

  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Конфіденційність</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Що зберігається в браузері</h2>
        <p className="text-slate-700">Прогрес навчання (вивчені слова, відповіді, помилки, графік повторення) і налаштування лежать у пам'яті вашого браузера. Без входу вони нікуди не передаються.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Вхід і хмарний прогрес</h2>
        <p className="text-slate-700">Якщо ви входите за email, ми зберігаємо email, нікнейм і ваш прогрес на сервері, щоб він був доступний на всіх ваших пристроях. Вхід відбувається за лінком із листа, пароль не потрібен. На сторінці «Профіль» можна видалити всі свої хмарні дані.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Статистика відвідувань</h2>
        <p className="text-slate-700">Тільки за вашою згодою ми записуємо: випадковий ідентифікатор браузера, відкриті сторінки, чи була відповідь у вправі правильною, тип пристрою (телефон, планшет, комп'ютер) і мову браузера. Імена, тексти ваших відповідей і IP-адреси в цій статистиці не зберігаються. Якщо ви ввійшли в акаунт, події прив'язуються до нього, і їх видаляє кнопка видалення даних у профілі. Статистику бачить лише власник сайту й використовує її, щоб покращувати вправи.</p>
        <p className="text-slate-700">Зараз: <strong>{consent === "granted" ? "дозволено" : consent === "denied" ? "не дозволено" : "ще не обрано"}</strong>.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setConsent("granted")} className="focus-ring min-h-11 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">Дозволити</button>
          <button type="button" onClick={() => setConsent("denied")} className="focus-ring min-h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">Не дозволяти</button>
        </div>
      </section>

      <p className="text-sm text-slate-700"><Link to="/profile" className="font-semibold text-blue-700 underline">До профілю</Link></p>
    </div>
  );
}
