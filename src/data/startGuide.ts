export interface SoundItem {
  /** Літера або поєднання літер. */
  letter: string;
  /** Приблизне українське пояснення звука. */
  sound: string;
  examples: Array<{ cz: string; ua: string }>;
  note?: string;
}

export interface SoundGroup {
  id: string;
  title: string;
  intro: string;
  items: SoundItem[];
}

export const pronunciationIntro =
  "Чеська читається так, як пишеться: кожна літера майже завжди дає один і той самий звук. " +
  "Українська транскрипція нижче приблизна; щоб почути правильно, натискайте кнопку озвучення біля слова.";

export const pronunciationRules: Array<{ title: string; text: string; example?: { cz: string; ua: string } }> = [
  {
    title: "Наголос завжди на першому складі",
    text: "Наголос не «стрибає», як в українській: майже в усіх словах він падає на перший склад, наприклад PRAha, UČitel, KAmarád. Прийменник читається разом зі словом: DO Prahy, NA stole. Знак над літерою (čárka) наголосу не показує, він лише робить голосний довгим.",
    example: { cz: "Praha", ua: "Прага" },
  },
  {
    title: "Довгі й короткі голосні",
    text: "á, é, í, ý, ú, ů читаються довше, ніж a, e, i, y, u. Різниця змінює значення слова: byt — квартира, але být — бути.",
    example: { cz: "být", ua: "бути" },
  },
  {
    title: "Дзвінкий приголосний наприкінці слова оглушується",
    text: "Наприкінці слова b, d, g, v, z, ž, h звучать як п, т, к, ф, с, ш, х. Пишемо hrad, а чуємо ≈ «грат».",
    example: { cz: "hrad", ua: "замок" },
  },
  {
    title: "Склади без голосних",
    text: "Літери r і l можуть самі утворювати склад, як у словах «vlk», «krk» (шия), «prst» (палець). Не вставляйте голосний усередину.",
    example: { cz: "vlk", ua: "вовк" },
  },
];

export const soundGroups: SoundGroup[] = [
  {
    id: "easy",
    title: "Схоже на українську",
    intro: "Ці літери вимовляються майже так само, як в українській.",
    items: [
      { letter: "c", sound: "ц", examples: [{ cz: "cena", ua: "ціна" }] },
      { letter: "č", sound: "ч", examples: [{ cz: "čaj", ua: "чай" }] },
      { letter: "š", sound: "ш", examples: [{ cz: "šest", ua: "шість" }] },
      { letter: "ž", sound: "ж", examples: [{ cz: "žena", ua: "жінка" }] },
      { letter: "ch", sound: "х", examples: [{ cz: "chléb", ua: "хліб" }] },
      { letter: "j", sound: "й", examples: [{ cz: "jméno", ua: "ім'я" }] },
      { letter: "y", sound: "и", examples: [{ cz: "my", ua: "ми" }] },
      {
        letter: "h",
        sound: "г (як в українському «гарно»)",
        examples: [{ cz: "hlava", ua: "голова" }],
        note: "Це український «г», а не російський. Для звука «ґ» є літера g, вона трапляється рідко.",
      },
    ],
  },
  {
    id: "special",
    title: "На що звернути увагу",
    intro: "Ці звуки та правила спершу здаються незвичними.",
    items: [
      {
        letter: "ě",
        sound: "м'якшує попередній приголосний, потім «е»",
        examples: [
          { cz: "děkuji", ua: "дякую" },
          { cz: "město", ua: "місто" },
        ],
        note: "dě, tě, ně читаються як «дє», «тє», «нє» (м'яко); після b, p, v, m: bě, pě, vě, mě — як «бйе», «пйе», «вйе», «мнє».",
      },
      {
        letter: "di, ti, ni",
        sound: "м'які «ді», «ті», «ні»",
        examples: [
          { cz: "dívka", ua: "дівчина" },
          { cz: "ticho", ua: "тиша" },
        ],
        note: "Склади dy, ty, ny — тверді: «ди», «ти», «ни».",
      },
      {
        letter: "ou",
        sound: "один склад «оу»",
        examples: [{ cz: "mouka", ua: "борошно" }],
      },
      {
        letter: "ů",
        sound: "довге «у»",
        examples: [{ cz: "dům", ua: "будинок" }],
        note: "Те саме, що ú, але ů пишуть лише всередині та наприкінці слова.",
      },
    ],
  },
  {
    id: "r-hacek",
    title: "Найважчий звук: ř",
    intro: "Цього звука немає в українській. Це не окремо «р» і не окремо «ж».",
    items: [
      {
        letter: "ř",
        sound: "«р» і «ж» одночасно",
        examples: [
          { cz: "řeka", ua: "річка" },
          { cz: "tři", ua: "три" },
          { cz: "dobře", ua: "добре" },
        ],
        note: "Після глухих (p, t, k, s…) ř звучить глухо, приблизно «рш»: tři, křeslo. Підніміть кінчик язика, як для «р», і спробуйте водночас вимовити «ж». Не засмучуйтесь, якщо одразу не вийде: чехи зрозуміють і з «рж».",
      },
    ],
  },
];
