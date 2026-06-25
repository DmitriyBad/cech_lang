import type { LessonItem, LessonModule } from "../types/Lesson";

const fallbackOptions = [
  "je",
  "jsou",
  "mám",
  "jde",
  "dnes",
  "ráno",
  "dobře",
  "prosím",
  "korun",
  "hodin",
  "studenti",
  "města",
];

const createOptions = (correctAnswer: string, alternatives: string[]) => {
  const options = new Set<string>();

  [correctAnswer, ...alternatives, ...fallbackOptions].forEach((item) => {
    if (item && item !== correctAnswer && options.size < 3) {
      options.add(item);
    }
  });

  return [correctAnswer, ...Array.from(options)].slice(0, 3);
};

const czechUi = {
  practiceExample: "Praktický příklad",
  forTopic: "k tématu",
  chooseWord: "Vyberte správné slovo do české věty.",
};

const numberUnits = [
  "nula",
  "jedna",
  "dva/dvě",
  "tři",
  "čtyři",
  "pět",
  "šest",
  "sedm",
  "osm",
  "devět",
  "deset",
  "jedenáct",
  "dvanáct",
  "třináct",
  "čtrnáct",
  "patnáct",
  "šestnáct",
  "sedmnáct",
  "osmnáct",
  "devatenáct",
];

const numberTens: Record<number, string> = {
  20: "dvacet",
  30: "třicet",
  40: "čtyřicet",
  50: "padesát",
  60: "šedesát",
  70: "sedmdesát",
  80: "osmdesát",
  90: "devadesát",
  100: "sto",
};

const numberHundreds: Record<number, string> = {
  200: "dvě stě",
  300: "tři sta",
  400: "čtyři sta",
  500: "pět set",
  600: "šest set",
  700: "sedm set",
  800: "osm set",
  900: "devět set",
  1000: "tisíc",
};

const formatCzechNumber = (number: number) => {
  if (number <= 19) {
    return numberUnits[number];
  }

  if (number <= 100) {
    const tens = Math.floor(number / 10) * 10;
    const unit = number % 10;

    return unit === 0 ? numberTens[tens] : numberTens[tens] + " " + numberUnits[unit];
  }

  return numberHundreds[number];
};

const numberReferenceItems = [
  ...Array.from({ length: 101 }, (_, number) => number + " — " + formatCzechNumber(number)),
  ...[200, 300, 400, 500, 600, 700, 800, 900, 1000].map((number) => number + " — " + formatCzechNumber(number)),
];

const moduleReferences: Record<string, { referenceTitle: string; referenceItems: string[] }> = {
  numbers: {
    referenceTitle: "Числа і написання",
    referenceItems: numberReferenceItems,
  },
};

const specialStudyItemsByLessonId: Record<string, string[]> = {
  "time-days": [
    "pondělí — v pondělí — понеділок",
    "úterý — v úterý — вівторок",
    "středa — ve středu — середа",
    "čtvrtek — ve čtvrtek — четвер",
    "pátek — v pátek — п'ятниця",
    "sobota — v sobotu — субота",
    "neděle — v neděli — неділя",
    "víkend — o víkendu — вихідні",
  ],
  "time-months": [
    "leden — v lednu — січень",
    "únor — v únoru — лютий",
    "březen — v březnu — березень",
    "duben — v dubnu — квітень",
    "květen — v květnu — травень",
    "červen — v červnu — червень",
    "červenec — v červenci — липень",
    "srpen — v srpnu — серпень",
    "září — v září — вересень",
    "říjen — v říjnu — жовтень",
    "listopad — v listopadu — листопад",
    "prosinec — v prosinci — грудень",
  ],
};

const exampleSceneTemplates = [
  {
    cz: (sentence: string) => sentence,
    ua: (sentence: string, title: string, index: number) => "Приклад " + index + " для теми “" + title + "”: " + sentence,
  },
  {
    cz: (sentence: string) => "Na tabuli je věta: “" + sentence + "”.",
    ua: (sentence: string) => "На дошці речення: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "V krátkém dialogu použiju: “" + sentence + "”.",
    ua: (sentence: string) => "У короткому діалозі я використовую: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Učitel říká pomalu: “" + sentence + "”.",
    ua: (sentence: string) => "Учитель повільно каже: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "V sešitě mám poznámku: “" + sentence + "”.",
    ua: (sentence: string) => "У зошиті маю нотатку: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Kamarád se ptá a já odpovím: “" + sentence + "”.",
    ua: (sentence: string) => "Друг питає, і я відповідаю: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "V aplikaci si ukládám kartu: “" + sentence + "”.",
    ua: (sentence: string) => "У застосунку я зберігаю картку: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Před testem si opakuju: “" + sentence + "”.",
    ua: (sentence: string) => "Перед тестом я повторюю: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "V malé scénce zazní: “" + sentence + "”.",
    ua: (sentence: string) => "У маленькій сценці лунає: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Do zprávy píšu: “" + sentence + "”.",
    ua: (sentence: string) => "У повідомленні я пишу: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Na kartičce vidím českou větu: “" + sentence + "”.",
    ua: (sentence: string) => "На картці я бачу чеське речення: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Při domácím úkolu doplním: “" + sentence + "”.",
    ua: (sentence: string) => "У домашньому завданні я доповнюю: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Ve třídě porovnáváme větu: “" + sentence + "”.",
    ua: (sentence: string) => "У класі ми порівнюємо речення: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "V běžné řeči často uslyším: “" + sentence + "”.",
    ua: (sentence: string) => "У звичайній мові я часто чую: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Když mluvím česky, hodí se věta: “" + sentence + "”.",
    ua: (sentence: string) => "Коли я говорю чеською, корисне речення: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "V překladu kontroluju český tvar: “" + sentence + "”.",
    ua: (sentence: string) => "У перекладі я перевіряю чеську форму: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Na konci lekce čtu nahlas: “" + sentence + "”.",
    ua: (sentence: string) => "Наприкінці уроку я читаю вголос: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "V rychlém cvičení vybírám větu: “" + sentence + "”.",
    ua: (sentence: string) => "У швидкій вправі я вибираю речення: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Pro vlastní příklad si zapíšu: “" + sentence + "”.",
    ua: (sentence: string) => "Для власного прикладу я записую: “" + sentence + "”.",
  },
  {
    cz: (sentence: string) => "Tuto větu chci umět říct bez dlouhého přemýšlení: “" + sentence + "”.",
    ua: (sentence: string) => "Це речення я хочу вміти сказати без довгих роздумів: “" + sentence + "”.",
  },
];

const buildTwentyExamples = (title: string, examples: string[]) =>
  Array.from({ length: 20 }, (_, index) => {
    const baseExample = examples[index % examples.length];
    const template = exampleSceneTemplates[index % exampleSceneTemplates.length];

    return {
      cz: template.cz(baseExample),
      ua: template.ua(baseExample, title, index + 1),
    };
  });

const normalizeWord = (word: string) => word.replace(/^[“"„(]+|[”".,!?;:)]+$/g, "").trim();

const extractWords = (text: string) =>
  text
    .replace(/->/g, " ")
    .split(/\s+/)
    .map(normalizeWord)
    .filter((word) => word.length > 1 && !/^\d+$/.test(word));

const pickAnswer = (example: string, index: number) => {
  const targetPart = example.includes("->") ? example.split("->").pop() ?? example : example;
  const words = extractWords(targetPart);
  const fallbackWords = extractWords(example);
  const candidates = words.length > 0 ? words : fallbackWords;

  if (candidates.length === 0) {
    return example;
  }

  const offset = index % Math.min(candidates.length, 2);
  return candidates[candidates.length - 1 - offset];
};

const buildClozeSentence = (example: string, answer: string) => {
  const position = example.lastIndexOf(answer);

  if (position === -1) {
    return example + " ___";
  }

  return example.slice(0, position) + "___" + example.slice(position + answer.length);
};

const buildStudyItems = (id: string, subtitle: string, explanation: string, examples: string[]) =>
  specialStudyItemsByLessonId[id] ?? Array.from(new Set([subtitle, explanation, ...examples])).slice(0, 8);

const buildTwentyExercises = (title: string, _level: "A1" | "A2", examples: string[]) =>
  Array.from({ length: 20 }, (_, index) => {
    const baseExample = examples[index % examples.length];
    const correctAnswer = pickAnswer(baseExample, index);
    const clozeSentence = buildClozeSentence(baseExample, correctAnswer);
    const alternatives = examples
      .filter((example) => example !== baseExample)
      .flatMap(extractWords)
      .filter((word) => word !== correctAnswer);

    return {
      question:
        "UA: Оберіть правильне слово для чеського речення в темі “" +
        title +
        "”. CZ: " +
        czechUi.chooseWord +
        "\n" +
        clozeSentence,
      options: createOptions(correctAnswer, alternatives),
      correctAnswer,
    };
  });

const buildLesson = (
  id: string,
  title: string,
  subtitle: string,
  level: "A1" | "A2",
  explanation: string,
  examples: string[],
): LessonItem => ({
  id,
  title,
  subtitle,
  level,
  explanation: explanation + " / Česky: " + czechUi.practiceExample + " " + czechUi.forTopic + " “" + title + "”.",
  studyItems: buildStudyItems(id, subtitle, explanation, examples),
  examples: buildTwentyExamples(title, examples),
  exercises: buildTwentyExercises(title, level, examples),
});

const rawModules = [
  {
    "id": "plural",
    "title": "Однина і множина",
    "subtitle": "Як змінюються іменники: student-studenti, škola-školy, město-města.",
    "icon": "copy",
    "lessons": [
      [
        "plural-masc-animate",
        "Чоловічий рід: люди",
        "student -> studenti",
        "A1",
        "У чоловічому роді для людей часто з'являються форми -i або -é.",
        [
          "jeden student -> dva studenti",
          "jeden učitel -> dva učitelé",
          "jeden kamarád -> dva kamarádi"
        ]
      ],
      [
        "plural-masc-inanimate",
        "Чоловічий рід: речі",
        "obchod -> obchody",
        "A1",
        "Для неживих іменників часто бачимо закінчення -y або -e.",
        [
          "jeden obchod -> dva obchody",
          "jeden klíč -> dva klíče",
          "jeden pokoj -> dva pokoje"
        ]
      ],
      [
        "plural-feminine-a",
        "Жіночий рід на -a",
        "škola -> školy",
        "A1",
        "Багато жіночих іменників на -a у множині мають -y.",
        [
          "jedna škola -> dvě školy",
          "jedna taška -> dvě tašky",
          "jedna mapa -> dvě mapy"
        ]
      ],
      [
        "plural-feminine-e",
        "Жіночий рід на -e",
        "ulice -> ulice",
        "A1",
        "Частина жіночих іменників має однакову форму в називному однини та множини.",
        [
          "jedna ulice -> dvě ulice",
          "jedna restaurace -> dvě restaurace",
          "jedna informace -> dvě informace"
        ]
      ],
      [
        "plural-neuter-o",
        "Середній рід на -o",
        "město -> města",
        "A1",
        "Середній рід на -o часто переходить у -a.",
        [
          "jedno město -> dvě města",
          "jedno slovo -> dvě slova",
          "jedno auto -> dvě auta"
        ]
      ],
      [
        "plural-neuter-i",
        "Середній рід на -í",
        "nádraží -> nádraží",
        "A2",
        "Іменники на -í часто мають однаковий вигляд у множині.",
        [
          "jedno nádraží -> dvě nádraží",
          "jedno cvičení -> dvě cvičení",
          "jedno zaměstnání -> dvě zaměstnání"
        ]
      ]
    ]
  },
  {
    "id": "numbers",
    "title": "Числа",
    "subtitle": "0-100, сотні, ціни, телефони й вік.",
    "icon": "hash",
    "lessons": [
      [
        "numbers-0-10",
        "Числа 0-10",
        "nula, jedna, dva...",
        "A1",
        "Ці числа потрібні для телефону, адреси, ціни й часу.",
        [
          "0 nula",
          "1 jedna",
          "2 dva/dvě",
          "10 deset"
        ]
      ],
      [
        "numbers-11-20",
        "Числа 11-20",
        "jedenáct, dvanáct...",
        "A1",
        "У чеській 11-19 мають окремі форми.",
        [
          "11 jedenáct",
          "15 patnáct",
          "20 dvacet"
        ]
      ],
      [
        "numbers-tens",
        "Десятки",
        "třicet, čtyřicet...",
        "A1",
        "Десятки комбінуються з одиницями.",
        [
          "30 třicet",
          "42 čtyřicet dva",
          "99 devadesát devět"
        ]
      ],
      [
        "numbers-hundreds",
        "Сотні й тисячі",
        "sto, tisíc",
        "A2",
        "Для покупок і документів треба знати великі числа.",
        [
          "100 sto",
          "500 pět set",
          "1000 tisíc"
        ]
      ],
      [
        "numbers-prices",
        "Ціни",
        "Kolik to stojí?",
        "A1",
        "Після 5+ часто вживаємо genitiv plural: pět korun.",
        [
          "jedna koruna",
          "dvě koruny",
          "pět korun"
        ]
      ],
      [
        "numbers-age",
        "Вік",
        "Je mi dvacet let",
        "A1",
        "Вік у чеській кажуть через конструкцію Je mi...",
        [
          "Je mi jeden rok.",
          "Jsou mi dva roky.",
          "Je mi pět let."
        ]
      ],
      [
        "numbers-phone",
        "Телефонні номери",
        "по цифрах",
        "A1",
        "Номери зазвичай читають групами цифр.",
        [
          "Moje číslo je 777 123 456.",
          "Napište prosím telefon.",
          "Zavolám na nové číslo."
        ]
      ]
    ]
  },
  {
    "id": "time",
    "title": "Дати і години",
    "subtitle": "Дні, місяці, час, зустрічі й розклад.",
    "icon": "calendar",
    "lessons": [
      [
        "time-days",
        "Дні тижня",
        "v pondělí, v úterý",
        "A1",
        "Для днів тижня часто вживаємо v + accusativ/lokál у сталих формах.",
        [
          "v pondělí",
          "ve středu",
          "o víkendu"
        ]
      ],
      [
        "time-months",
        "Місяці",
        "v lednu, v červnu",
        "A1",
        "Для місяців використовуємо v + lokál.",
        [
          "v lednu",
          "v dubnu",
          "v prosinci"
        ]
      ],
      [
        "time-clock-basic",
        "Повна година",
        "Je jedna hodina",
        "A1",
        "Проста відповідь на Kolik je hodin?",
        [
          "Je jedna hodina.",
          "Jsou dvě hodiny.",
          "Je pět hodin."
        ]
      ],
      [
        "time-half-quarter",
        "Пів і чверть",
        "půl třetí, čtvrt na pět",
        "A2",
        "Чеський час часто рахує до наступної години.",
        [
          "Je půl třetí.",
          "Je čtvrt na pět.",
          "Je tři čtvrtě na osm."
        ]
      ],
      [
        "time-meetings",
        "Зустрічі",
        "v osm, v sobotu",
        "A1",
        "Розклад поєднує день, час і місце.",
        [
          "Schůzka je v pondělí v osm.",
          "Kurz začíná v šest večer.",
          "Přijdu ve středu ráno."
        ]
      ],
      [
        "time-dates",
        "Дати",
        "25. června",
        "A2",
        "Дати читаємо з порядковими числівниками.",
        [
          "Dnes je 25. června.",
          "Narodil jsem se 3. března.",
          "Rezervace je na 12. května."
        ]
      ]
    ]
  },
  {
    "id": "adjectives",
    "title": "Прикметники",
    "subtitle": "nový, nová, nové та узгодження з іменником.",
    "icon": "palette",
    "lessons": [
      [
        "adj-gender",
        "Рід прикметника",
        "nový/nová/nové",
        "A1",
        "Прикметник змінюється за родом іменника.",
        [
          "nový telefon",
          "nová kniha",
          "nové auto"
        ]
      ],
      [
        "adj-plural",
        "Множина",
        "noví studenti / nové knihy",
        "A2",
        "У множині форми залежать від роду та істотності.",
        [
          "dobří studenti",
          "nové školy",
          "malá města"
        ]
      ],
      [
        "adj-colors",
        "Кольори",
        "modrý, červený, zelený",
        "A1",
        "Кольори поводяться як звичайні прикметники.",
        [
          "modrý batoh",
          "červená taška",
          "zelené jablko"
        ]
      ],
      [
        "adj-size",
        "Розмір і якість",
        "malý, velký, dobrý",
        "A1",
        "Ці прикметники дуже часті в побуті.",
        [
          "malý pokoj",
          "velká kavárna",
          "dobré jídlo"
        ]
      ],
      [
        "adj-cases",
        "Прикметник у відмінку",
        "v novém bytě",
        "A2",
        "Прикметник змінюється разом з іменником.",
        [
          "v novém hotelu",
          "bez dobré kávy",
          "s českým učitelem"
        ]
      ],
      [
        "adj-comparison",
        "Порівняння",
        "lepší, větší, menší",
        "A2",
        "На A2 корисно знати базові порівняння.",
        [
          "To je lepší plán.",
          "Pokoj je větší.",
          "Cena je menší."
        ]
      ]
    ]
  },
  {
    "id": "prepositions",
    "title": "Прийменники",
    "subtitle": "do, bez, k, v, na, s і правильний відмінок.",
    "icon": "route",
    "lessons": [
      [
        "prep-genitive",
        "Genitiv",
        "do školy, bez vody",
        "A1",
        "Після do, bez, od часто потрібен genitiv.",
        [
          "Jdu do školy.",
          "Jsem bez vody.",
          "Dopis je od kamaráda."
        ]
      ],
      [
        "prep-dative",
        "Dativ",
        "k lékaři, k domu",
        "A1",
        "Після k/ke часто потрібен dativ.",
        [
          "Jdu k lékaři.",
          "Jdeme ke škole.",
          "Telefonuju k sousedovi."
        ]
      ],
      [
        "prep-accusative",
        "Akuzativ",
        "na poštu, do práce",
        "A1",
        "Напрям руху часто вимагає akuzativ.",
        [
          "Jdu na poštu.",
          "Dívám se na film.",
          "Čekám na autobus."
        ]
      ],
      [
        "prep-locative",
        "Lokál",
        "v Praze, na nádraží",
        "A1",
        "Місце часто має v/na + lokál.",
        [
          "Bydlím v Praze.",
          "Čekám na nádraží.",
          "Mluvím o práci."
        ]
      ],
      [
        "prep-instrumental",
        "Instrumentál",
        "s kamarádem",
        "A1",
        "Після s/со вживаємо instrumentál.",
        [
          "Jdu s kamarádem.",
          "Píšu perem.",
          "Mluvím s učitelem."
        ]
      ],
      [
        "prep-vs-direction-place",
        "Напрям чи місце",
        "na poštu / na poště",
        "A2",
        "Рух і місце можуть давати різні відмінки.",
        [
          "Jdu na poštu.",
          "Jsem na poště.",
          "Jedeme do centra."
        ]
      ]
    ]
  },
  {
    "id": "scenarios",
    "title": "Життєві сценарії",
    "subtitle": "Магазин, транспорт, лікар, робота, кафе, житло й подорож.",
    "icon": "messages",
    "lessons": [
      [
        "scenario-shop",
        "У магазині",
        "ціна, оплата, пакет",
        "A1",
        "Покупки тренують числа, akuzativ і ввічливі фрази.",
        [
          "Kolik to stojí?",
          "Platím kartou.",
          "Máte prosím tašku?"
        ]
      ],
      [
        "scenario-transport",
        "Транспорт",
        "квиток, зупинка, час",
        "A1",
        "Транспорт поєднує час, напрям і місце.",
        [
          "Kde je zastávka?",
          "Potřebuju lístek.",
          "Autobus jede za pět minut."
        ]
      ],
      [
        "scenario-doctor",
        "У лікаря",
        "самопочуття і симптоми",
        "A2",
        "Корисні фрази для безпеки й побуту.",
        [
          "Bolí mě hlava.",
          "Mám teplotu.",
          "Potřebuju lékaře."
        ]
      ],
      [
        "scenario-work",
        "На роботі",
        "зустріч, завдання, e-mail",
        "A2",
        "Робочі ситуації потребують ввічливих форм і часу.",
        [
          "Mám schůzku v devět.",
          "Pošlu e-mail.",
          "Potřebuju dokončit úkol."
        ]
      ],
      [
        "scenario-cafe",
        "У кафе",
        "замовлення і рахунок",
        "A1",
        "Кафе добре тренує objednat, platit, dát si.",
        [
          "Dám si kávu.",
          "Máte něco sladkého?",
          "Zaplatím u pokladny."
        ]
      ],
      [
        "scenario-housing",
        "Житло",
        "адреса, оренда, кімната",
        "A2",
        "Житло тренує lokál, genitiv і опис.",
        [
          "Bydlím v malém bytě.",
          "Hledám pokoj.",
          "Adresa je blízko centra."
        ]
      ],
      [
        "scenario-intro",
        "Знайомство",
        "ім'я, країна, робота",
        "A1",
        "Перші розмови мають прості стабільні шаблони.",
        [
          "Jmenuju se Anna.",
          "Jsem z Ukrajiny.",
          "Učím se česky."
        ]
      ],
      [
        "scenario-travel",
        "Подорож",
        "готель, вокзал, бронювання",
        "A2",
        "Подорож поєднує напрям, дату й питання.",
        [
          "Mám rezervaci.",
          "Kde je nádraží?",
          "Jedeme v pátek ráno."
        ]
      ]
    ]
  }
];

export const grammarModules: LessonModule[] = rawModules.map((module) => ({
  ...module,
  ...moduleReferences[String(module.id)],
  lessons: module.lessons.map(([id, title, subtitle, level, explanation, examples]) =>
    buildLesson(String(id), String(title), String(subtitle), level as "A1" | "A2", String(explanation), examples as string[]),
  ),
})) as LessonModule[];
