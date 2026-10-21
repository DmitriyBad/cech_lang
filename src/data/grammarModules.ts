import type { LessonItem, LessonModule, LessonSentence } from "../types/Lesson";
import { firstParagraph } from "./explanations";
import { lessonSentences } from "./lessonSentences";
import { buildDictationExercise, buildErrorExercise, buildSentenceExercise, isBuildable } from "./sentenceExercises";

const czechUi = {
  chooseWord: "Vyberte správné slovo do české věty.",
};

// Тримаємо порядок «правильна відповідь першою»: ExerciseBlock сам перемішує варіанти.
const buildClozeExercises = (title: string, sentences: LessonSentence[], rule: string) =>
  sentences.map((sentence) => ({
    question:
      "UA: Оберіть правильну форму для теми “" +
      title +
      "”. Переклад: " +
      sentence.ua +
      "\nCZ: " +
      czechUi.chooseWord +
      "\n" +
      sentence.cz.replace(sentence.focus, "___"),
    options: [sentence.focus, ...sentence.wrong],
    correctAnswer: sentence.focus,
    explanation: ["Правило: " + rule, "Повне речення: " + sentence.cz + " — " + sentence.ua],
  }));

// Обираємо переклад речення; відволікачі — переклади інших речень цього ж уроку.
const buildTranslationExercises = (sentences: LessonSentence[], title: string, rule: string) =>
  sentences.map((sentence, index) => {
    const distractors = [1, 2]
      .map((offset) => sentences[(index + offset * 3) % sentences.length].ua)
      .filter((ua, position, all) => ua !== sentence.ua && all.indexOf(ua) === position);

    return {
      question: "Що означає: “" + sentence.cz + "”",
      options: [sentence.ua, ...distractors].slice(0, 3),
      correctAnswer: sentence.ua,
      explanation: ["Тема уроку «" + title + "». Правило: " + rule, "Ключова форма в реченні: " + sentence.focus + "."],
    };
  });

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
  tenses: {
    referenceTitle: "Минулий і майбутній час: допоміжні дієслова",
    referenceItems: [
      "já — jsem dělal / jsem dělala",
      "ty — jsi dělal / jsi dělala",
      "on / ona / ono — dělal / dělala / dělalo (без допоміжного)",
      "my — jsme dělali / jsme dělaly",
      "vy — jste dělali / jste dělaly (до однієї людини: jste dělal / jste dělala)",
      "oni / ony — dělali / dělaly (без допоміжного)",
      "Майбутній час (недоконані): budu / budeš / bude / budeme / budete / budou + інфінітив: budu dělat",
      "Майбутній час (доконані): проста форма, як у теперішньому: udělám, napíšu, přijdu",
    ],
  },
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

// Підзаголовок і пояснення вже показані на сторінці уроку, тому в «Короткий перелік» потрапляють лише приклади.
const buildStudyItems = (id: string, examples: string[]) =>
  specialStudyItemsByLessonId[id] ?? Array.from(new Set(examples)).slice(0, 8);

// Вправи на цілі речення уроку: складання, диктант і пошук хибної форми (`wrong` замість `focus`).
const buildSentenceSetExercises = (sentences: LessonSentence[], rule: string) => {
  const pool = sentences.filter((sentence) => isBuildable(sentence.cz));
  const exercises = pool.slice(0, 2).map(buildSentenceExercise);

  if (pool.length > 0) {
    exercises.push(buildDictationExercise(pool[Math.min(2, pool.length - 1)]));
  }

  for (const sentence of pool) {
    const exercise = buildErrorExercise(sentence, sentence.cz.replace(sentence.focus, sentence.wrong[0]), [
      "Правильна форма: «" + sentence.focus + "», а не «" + sentence.wrong[0] + "».",
      "Правило: " + rule,
    ]);

    if (exercise) {
      exercises.push(exercise);
      break;
    }
  }

  return exercises;
};

const buildLesson = (
  id: string,
  title: string,
  subtitle: string,
  level: "A1" | "A2",
  explanation: string,
  seedExamples: string[],
): LessonItem => {
  const sentences = lessonSentences[id];

  if (!sentences || sentences.length === 0) {
    throw new Error("Немає речень для уроку: " + id);
  }

  return {
    id,
    title,
    subtitle,
    level,
    explanation,
    studyItems: buildStudyItems(id, seedExamples),
    examples: sentences.map(({ cz, ua }) => ({ cz, ua })),
    exercises: [
      ...buildClozeExercises(title, sentences, firstParagraph(explanation)),
      ...buildTranslationExercises(sentences, title, firstParagraph(explanation)),
      ...buildSentenceSetExercises(sentences, firstParagraph(explanation)),
    ],
  };
};

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
        "Для істот (людей, тварин) після твердого приголосного множина має -i: student → studenti, kamarád → kamarádi.\nПеред -i приголосний змінюється: k → c (kluk → kluci), h → z (vrah → vrazi), ch → š (Čech → Češi), r → ř (bratr → bratři).\nСлова на -tel, -an, -ista мають -é: učitel → učitelé, občan → občané, turista → turisté.\nСлова на -ec втрачають «e»: cizinec → cizinci. Деякі слова мають -ové: pán → pánové, syn → synové.",
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
        "Після твердого приголосного множина має -y: obchod → obchody, vlak → vlaky, lístek → lístky (при цьому «e» випадає).\nПісля м'якого приголосного (č, š, ž, ř, c, j) множина має -e: klíč → klíče, pokoj → pokoje, měsíc → měsíce.\nНеправильні форми треба запам'ятати: dům → domy, den → dny.",
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
        "Жіночий рід на -a: у множині -a змінюється на -y: škola → školy, mapa → mapy, taška → tašky.\nУ родовому відмінку множини -a зникає, а між приголосними з'являється «e»: škol, ale tašek.",
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
        "Жіночий рід на -e (ulice, restaurace, informace) у називному множини не змінюється: jedna ulice → dvě ulice. Число видно з контексту.\nЖіночі іменники на приголосний (věc, místnost, noc) мають у множині -i: věc → věci, místnost → místnosti, noc → noci.",
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
        "Середній рід на -o у множині має -a: město → města, slovo → slova, auto → auta.\nСлова на -um втрачають його: centrum → centra, muzeum → muzea.\nСлова на -e/-ě не змінюються: moře → moře, letiště → letiště.",
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
        "Середній рід на -í у називному множини не змінюється: nádraží → nádraží, cvičení → cvičení.\nЧисло видно з контексту: jedno nádraží, dvě nádraží.",
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
        "Після числівника іменник змінює форму за правилом:\n1 → називний однини: jedna koruna;\n2, 3, 4 → називний множини: dvě koruny, tři koruny, čtyři koruny;\n5 і більше → родовий множини: pět korun, sto korun. Так само після kolik: Kolik korun?\nРід: jeden stůl, jedna koruna, jedno auto; dva stoly, але dvě koruny і dvě auta.",
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
        "Вік кажуть через конструкцію Je mi + число + рік: «мені …» (буквально).\n1 → Je mi jeden rok. 2, 3, 4 → Jsou mi dva roky. 5 і більше → Je mi pět let (родовий множини).\nПитання: Kolik je ti let? (до друга), Kolik je vám let? (ввічливо).",
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
        "Номер телефону зазвичай називають групами по три цифри, кожну цифру окремо: 777 123 456 → sedm sedm sedm, jedna dva tři, čtyři pět šest.\nНуль читається nula. Питання: Jaké je vaše telefonní číslo?",
        [
          "Moje číslo je 777 123 456.",
          "Napište mi prosím své telefonní číslo.",
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
        "Відповідь на питання Kdy? («коли?»): v/ve + знахідний відмінок: v pondělí, v úterý, ve středu, ve čtvrtek, v pátek, v sobotu, v neděli.\nПеред скупченням приголосних замість v стоїть ve: ve středu, ve čtvrtek.\nВихідні кажуть інакше: o víkendu (o + місцевий відмінок).",
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
        "Чеською півгодини й чверті рахують до НАСТУПНОЇ години:\npůl třetí = 2:30 (половина на шляху до третьої). Форма жіночого роду в родовому відмінку: půl jedné (12:30), půl druhé (1:30), půl třetí (2:30), půl deváté (8:30).\nčtvrt na pět = 4:15; tři čtvrtě na osm = 7:45.\nKolik je hodin? → Je půl třetí. Kdy? → V půl třetí, ve čtvrt na pět; цілі години: v jednu, ve dvě, ve tři.",
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
        "Дату пишуть як порядкове число з крапкою і місяць у родовому відмінку: 25. června, 3. března, 12. května.\nВимовляють порядковим числівником у родовому відмінку: dvacátého pátého června.\nМісяці в родовому: ledna, února, března, dubna, května, června, července, srpna, září, října, listopadu, prosince.",
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
        "Вищий ступінь: до основи додають -ější/-ejší або -ší: nový → novější, rychlý → rychlejší, levný → levnější.\nНеправильні, їх треба запам'ятати: dobrý → lepší, malý → menší, velký → větší, špatný → horší, dlouhý → delší.\nПорівняння з «ніж»: Pokoj je větší než kuchyně. Найвищий ступінь: nej- + вищий: nejlepší, největší.",
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
        "Родовий відмінок (koho? čeho?) завжди стоїть після прийменників do, z/ze, od, bez, u, vedle, kolem, podle, blízko.\ndo školy («до школи», усередину), bez vody, od kamaráda, u doktora, vedle banky.",
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
        "Давальний відмінок (komu? čemu?) стоїть після прийменників k/ke («до, у напрямку до»), díky («завдяки»), kvůli («через»), naproti («навпроти») і після дієслів, які керують давальним: pomáhat, telefonovat.\nk lékaři = до лікаря (до людини); ke škole = у напрямку до школи, але не всередину. Усередину кажуть do školy.\nБез прийменника: Pomáhám sousedovi. Telefonuju sousedovi.",
        [
          "Jdu k lékaři.",
          "Jdeme ke škole.",
          "Telefonuju sousedovi."
        ]
      ],
      [
        "prep-accusative",
        "Akuzativ",
        "na poštu, pro kamaráda",
        "A1",
        "Знахідний відмінок (koho? co?) стоїть після na, pro, přes, za (напрям) і як прямий додаток: Vidím sestru. Mám kávu.\nНапрям на установу чи подію: na + знахідний (Jdu na poštu). Напрям у приміщення кажуть інакше: do + родовий (do práce, do školy).\nЯкщо слово назва істоти чоловічого роду, знахідний збігається з родовим: Vidím studenta.",
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
        "Місцевий відмінок (o kom? o čem?) вживається лише з прийменниками: v/ve (всередині: v Praze, v knihovně), na (на установі, події, поверхні: na poště, na nádraží), o (про: mluvím o práci), po, při.\nПрийменник v чи na треба запам'ятати разом зі словом.\nУ формах змінюється приголосний: h → z (Praha → v Praze), k → c (taška → v tašce), r → ř (sestra → o sestře). Після d, t, n пишеться -ě: v kavárně, v Brně.",
        [
          "Bydlím v Praze.",
          "Stojím na nádraží.",
          "Mluvím o práci."
        ]
      ],
      [
        "prep-instrumental",
        "Instrumentál",
        "s kamarádem",
        "A1",
        "Орудний відмінок (kým? čím?) стоїть після s/se («з»): s kamarádem, se sestrou (se — перед скупченням приголосних).\nБез прийменника він означає засіб чи знаряддя: píšu perem, platím kartou, jedu autem.\nТакож після před, za, nad, pod, mezi, коли йдеться про місце: před školou, za domem, nad městem.",
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
        "На питання Kam? («куди?») відповідають напрямком, на питання Kde? («де?») — місцем:\nKam? Jdu na poštu (знахідний). Jedeme do centra (родовий).\nKde? Jsem na poště (місцевий). Jsme v centru (місцевий).\nПари: na poštu → na poště, do školy → ve škole, do Prahy → v Praze.",
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
  },
  {
    "id": "tenses",
    "title": "Теперішній, минулий і майбутній час",
    "subtitle": "Як змінюється дієслово: що я роблю зараз, що робив учора і що зроблю завтра.",
    "icon": "clock",
    "lessons": [
      ["tenses-present-a", "Теперішній час: dělat, čekat", "dělám, děláš, dělá", "A1", "Більшість дієслів на -at (dělat, čekat, hledat, poslouchat, snídat) змінюються за особами так: já -ám, ty -áš, on/ona/ono -á, my -áme, vy -áte, oni -ají.\nОсобовий займенник (já, ty, my…) зазвичай опускають: Dělám úkol. Він потрібен лише для підкреслення: Já dělám, ale ty ne.\nЧеське теперішнє відповідає і українському «роблю», і «роблю зараз»: окремої форми для тривалості немає.\nУ вправах особу визначайте за українським перекладом.", ["Dělám úkol.", "Co děláš večer?", "Studenti dělají cvičení."]],
      ["tenses-present-i", "Теперішній час: mluvit, bydlet", "mluvím, mluvíš, mluví", "A1", "Більшість дієслів на -it, -et, -ět (mluvit, bydlet, platit, vidět, učit) мають закінчення: já -ím, ty -íš, on/ona/ono -í, my -íme, vy -íte, oni -í.\nЗверніть увагу: форми «він» і «вони» однакові: on bydlí, oni bydlí. Їх відрізняють за змістом і за підметом.", ["Mluvím česky.", "Petr bydlí v Praze.", "Kde bydlíte?"]],
      ["tenses-present-uju", "Теперішній час: pracovat, kupovat", "pracuji, pracuješ, pracuje", "A1", "Дієслова на -ovat (pracovat, studovat, kupovat, cestovat, potřebovat) змінюють -ova- на -uj-: já pracuji, ty pracuješ, on pracuje, my pracujeme, vy pracujete, oni pracují.\nУ розмовній мові часто кажуть pracuju (я) і pracujou (вони). Це нормально, але на письмі й у школі вчать форми з -uji, -ují.", ["Pracuji v kanceláři.", "Studenti studují češtinu.", "Cestujeme vlakem."]],
      ["tenses-past-form", "Минулий час: як утворюється", "dělal jsem, byl jsem", "A1", "Минулий час складається з двох частин: допоміжного дієслова být у теперішньому часі (jsem, jsi, jsme, jste) і форми на -l: у більшості дієслів від інфінітива відкидаємо -t і додаємо -l: dělat → dělal, mluvit → mluvil, bydlet → bydlel, studovat → studoval.\nУ першій і другій особі допоміжне дієслово обов'язкове: dělal jsem, dělal jsi, dělali jsme, dělali jste. У третій особі його немає: dělal, dělali.\nJsem, jsi, jsme, jste зазвичай не стоять на початку речення: Včera jsem dělal úkol або Dělal jsem úkol.", ["Včera jsem dělal úkol.", "Mluvil jsem s lékařem.", "Oni bydleli v Brně."]],
      ["tenses-past-gender", "Минулий час: рід і число", "byl, byla, bylo, byli, byly", "A1", "Форма на -l узгоджується з тим, хто діє: чоловічий рід -l (byl), жіночий -la (byla), середній -lo (bylo), множина чоловіків -li (byli); множина жіночого роду й неживих чоловічих іменників -ly (ženy byly, domy byly); множина середнього роду -la (auta byla).\nЧоловік каже: byl jsem, жінка: byla jsem. Якщо серед тих, хто діє, є хоча б один чоловік, вживаємо -li: my jsme byli.\nСлово děti вживається з -ly: děti hrály (не hráli).\nЧемне «vy» до однієї людини: Vy jste byl (до чоловіка), Vy jste byla (до жінки), а до кількох: Vy jste byli.\nУ вправах рід і час визначайте за українським перекладом.", ["Petr byl doma.", "Anna byla v kavárně.", "Auto bylo drahé."]],
      ["tenses-past-irregular", "Минулий час: неправильні форми", "šel, mohl, četl, řekl, jedl", "A2", "У частині дієслів форма на -l не збігається з інфінітивом, і її треба запам'ятати: být → byl, mít → měl, jít → šel (šla, šlo, šli, šly), moci → mohl, číst → četl, říct → řekl, jíst → jedl, vzít → vzal, najít → našel, přinést → přinesl.\nЗакінчення -a, -o, -i, -y додаються так само: šel, šla, šlo, šli, šly.", ["Včera jsem šel domů.", "Měl jsem hlad.", "Řekl jsem to učiteli."]],
      ["tenses-past-neg-refl", "Минулий час: заперечення і se", "nebyl jsem, díval jsem se", "A2", "Заперечення ne- додається до форми на -l: byl → nebyl, šel → nešel, rozuměla → nerozuměla. Допоміжне jsem залишається окремо: Nebyl jsem doma.\nЧастки se та si в минулому часі стоять після jsem/jsi/jsme/jste: Díval jsem se. Vrátil jsem se. У третій особі jsem немає: Petr se bál.\nУ другій особі jsi se часто стягується в ses: ty ses díval (= ty jsi se díval); так само jsi si → sis: ty sis pamatoval.", ["Nebyl jsem doma.", "Díval jsem se na film.", "Petr se bál tmy."]],
      ["tenses-future-budu", "Майбутній час: budu + інфінітив", "budu dělat, budeš dělat", "A1", "Недоконані дієслова (dělat, pracovat, čekat, učit se…) утворюють майбутній час так: допоміжне дієслово být у формі майбутнього + інфінітив (виняток: jít → půjdu, jet → pojedu, див. урок про дієслова руху): já budu dělat, ty budeš dělat, on/ona/ono bude dělat, my budeme dělat, vy budete dělat, oni budou dělat.\nІнфінітив не змінюється, змінюється лише budu, budeš, bude, budeme, budete, budou.\nСамо дієслово být у майбутньому стоїть без інфінітива: Zítra budu doma. Příští týden budeme v Praze.\nЗаперечення: ne- додається до budu: nebudu dělat, nebudeš dělat.\nПро заплановане майбутнє часто кажуть і теперішнім часом: Zítra jdu do kina (завтра йду в кіно). Це теж нормально.\nУ вправах особу визначайте за підметом.", ["Zítra budu doma.", "Co budeš dělat o víkendu?", "Budeme studovat češtinu."]],
      ["tenses-future-perfective", "Майбутній час: доконані дієслова", "napíšu, koupím, udělám", "A2", "Доконані дієслова відповідають на питання «що зробити?» (napsat, koupit, udělat, zavolat, přijít). Теперішнього часу в них немає: форми, які виглядають як теперішній час, означають майбутнє: napíšu = «напишу», koupím = «куплю», přijdu = «прийду».\nЗакінчення ті самі, що в теперішньому часі: udělám, uděláš, udělá, uděláme, uděláte, udělají.\nНе можна казати budu napsat чи budu udělat: правильно napíšu, udělám.\nЧасто недоконане й доконане дієслова утворюють пару: dělat — udělat, psát — napsat, kupovat — koupit, volat — zavolat, číst — přečíst, vidět — uvidět.\nBudu psát підкреслює процес («буду писати»), napíšu — результат («напишу, закінчу»).", ["Zítra to udělám.", "Napíšu ti večer.", "Kdy přijdeš domů?"]],
      ["tenses-future-motion", "Майбутній час: půjdu, pojedu", "půjdu, pojedu", "A2", "Дієслова руху jít та jet у майбутньому мають особливі форми з префіксом (pů-, po-), тому budu їм не потрібне: jít → půjdu, půjdeš, půjde, půjdeme, půjdete, půjdou; jet → pojedu, pojedeš, pojede, pojedeme, pojedete, pojedou. Форми budu jít, budu jet для однієї конкретної дії не вживаємо: кажемо půjdu, pojedu.\nЗаперечення: nepůjdu, nepojedu.\nДля повторюваних дій вживаємо budu chodit (буду ходити): Budu chodit do školy každý den.", ["Zítra půjdu do školy.", "Pojedeme vlakem.", "Nepůjdu do práce."]],
      ["tenses-future-neg-refl", "Майбутній час: заперечення і se", "nebudu dělat, budu se učit", "A2", "Заперечення: ne- + форма budu: nebudu, nebudeš, nebude, nebudeme, nebudete, nebudou: nebudu pracovat, nebudeme čekat. У доконаних дієслів ne- додається до самої форми: nenapíšu, nepřijdu.\nЧастки se та si стоять на другому місці в реченні. Якщо речення починається з budu, частка йде одразу після нього: Budu se učit česky, Nebudu se bát. Якщо перед budu є підмет чи обставина, частка стоїть перед budu: Já se budu učit, Zítra se budu učit, Petr se nebude bát. У доконаних так само: Já se vrátím, My se uvidíme, але Vrátím se (дієслово на початку).\nЧастки se та si не можуть стояти на першому місці: Budu se učit česky, але не Se budu učit.", ["Nebudu pracovat.", "Budu se učit česky.", "Uvidíme se zítra."]],
      ["tenses-choose", "Який час: слова-підказки", "dnes, včera, zítra", "A1", "Слова часу підказують, яку форму обрати. Теперішній: teď (зараз), každý den (щодня), obvykle (зазвичай). Минулий: včera (вчора), minulý týden (минулого тижня), před hodinou (годину тому), loni (торік). Майбутній: zítra (завтра), pozítří (післязавтра), příští týden (наступного тижня), za hodinu (через годину), brzy (незабаром).\nСлово dnes (сьогодні) може стояти з будь-яким часом (Dnes pracuji, Dnes ráno jsem pracoval, Dnes večer budu doma), тож дивіться на зміст.\nУ майбутньому більшість недоконаних дієслів мають budu + інфінітив (zítra budu psát), доконані мають просту форму (zítra napíšu). Заплановане майбутнє можна виражати й теперішнім часом: Příští týden jedeme do Prahy.", ["Dnes pracuji doma.", "Včera jsem pracoval v kanceláři.", "Zítra budu pracovat doma."]]
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
