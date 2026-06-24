import type { Example, Exercise, Verb } from "../types/Verb";

type VerbSeed = Omit<Verb, "exercises">;
type ConjugationKey = keyof Verb["conjugation"];

const personPrompts = [
  { label: "já", key: "ja", ua: "я" },
  { label: "ty", key: "ty", ua: "ти" },
  { label: "on/ona/ono", key: "on", ua: "він/вона/воно" },
  { label: "my", key: "my", ua: "ми" },
  { label: "vy", key: "vy", ua: "ви" },
  { label: "oni/ony", key: "oni", ua: "вони" },
] as const satisfies Array<{ label: string; key: ConjugationKey; ua: string }>;

const createOptions = (correctAnswer: string, alternatives: string[]) => {
  const uniqueOptions = Array.from(
    new Set([correctAnswer, ...alternatives.filter((item) => item && item !== correctAnswer)]),
  );
  return uniqueOptions.slice(0, 3);
};

const pickAlternatives = (correctAnswer: string, candidates: string[], count = 2) =>
  Array.from(new Set(candidates.filter((item) => item && item !== correctAnswer))).slice(0, count);

const removeFinalPunctuation = (sentence: string) => sentence.trim().replace(/[.!?]+$/, "");

const lowerFirst = (sentence: string, locale: string) => {
  const trimmedSentence = removeFinalPunctuation(sentence);
  return trimmedSentence.charAt(0).toLocaleLowerCase(locale) + trimmedSentence.slice(1);
};

const toCzechSubordinateClause = (sentence: string) =>
  lowerFirst(sentence, "cs-CZ").replace(/^(já|ty|my|vy|oni|ony)\s+/i, "");

const buildExamples = (verb: VerbSeed): Example[] => {
  const expandedExamples = verb.examples.flatMap((example) => {
    const czClause = toCzechSubordinateClause(example.cz);
    const uaClause = lowerFirst(example.ua, "uk-UA");

    return [
      example,
      {
        cz: "Myslím, že " + czClause + ".",
        ua: "Думаю, що " + uaClause + ".",
      },
      {
        cz: "Vím, že " + czClause + ", ale chci si to ještě ověřit.",
        ua: "Я знаю, що " + uaClause + ", але хочу ще це перевірити.",
      },
      {
        cz: "Řekl jsem učiteli, že " + czClause + ".",
        ua: "Я сказав учителю, що " + uaClause + ".",
      },
      {
        cz: "Když se mě někdo ptá, odpovím klidně, že " + czClause + ".",
        ua: "Коли мене хтось питає, я спокійно відповідаю, що " + uaClause + ".",
      },
    ];
  });

  return expandedExamples.slice(0, 15);
};

const buildExercises = (verb: VerbSeed, allVerbs: VerbSeed[]): Exercise[] => {
  const exerciseExamples = verb.examples.slice(0, 3);
  const allForms = personPrompts.map(({ key }) => verb.conjugation[key]);

  const conjugationExercises = personPrompts.map(({ label, key }) => {
    const correctAnswer = verb.conjugation[key];

    return {
      question: "Доповніть форму для “" + label + "”: " + verb.infinitive,
      options: createOptions(correctAnswer, allForms.filter((form) => form !== correctAnswer)),
      correctAnswer,
    };
  });

  const translationExercises = exerciseExamples.map((example) => ({
    question: "Що означає: “" + example.cz + "”",
    options: createOptions(
      example.ua,
      exerciseExamples.map((candidate) => candidate.ua).filter((translation) => translation !== example.ua),
    ),
    correctAnswer: example.ua,
  }));

  const reverseTranslationExercises = exerciseExamples.map((example) => ({
    question: "Оберіть чеське речення: “" + example.ua + "”",
    options: createOptions(
      example.cz,
      exerciseExamples.map((candidate) => candidate.cz).filter((sentence) => sentence !== example.cz),
    ),
    correctAnswer: example.cz,
  }));

  const meaningExercises = [
    {
      question: "Як українською: “" + verb.infinitive + "”",
      options: createOptions(
        verb.translation,
        pickAlternatives(
          verb.translation,
          allVerbs.map((candidate) => candidate.translation),
        ),
      ),
      correctAnswer: verb.translation,
    },
    {
      question: "Оберіть чеський інфінітив для: “" + verb.translation + "”",
      options: createOptions(
        verb.infinitive,
        pickAlternatives(
          verb.infinitive,
          allVerbs.map((candidate) => candidate.infinitive),
        ),
      ),
      correctAnswer: verb.infinitive,
    },
    {
      question: "Оберіть правильну пару особа + форма для “" + verb.infinitive + "”",
      options: createOptions("já — " + verb.conjugation.ja, [
        "ty — " + verb.conjugation.ja,
        "já — " + verb.conjugation.ty,
      ]),
      correctAnswer: "já — " + verb.conjugation.ja,
    },
  ];

  return [...conjugationExercises, ...translationExercises, ...reverseTranslationExercises, ...meaningExercises];
};

const verbBase = [
  {
    "id": 1,
    "infinitive": "být",
    "translation": "бути",
    "level": "A1",
    "conjugation": {
      "ja": "jsem",
      "ty": "jsi",
      "on": "je",
      "my": "jsme",
      "vy": "jste",
      "oni": "jsou"
    },
    "examples": [
      {
        "cz": "Já jsem doma.",
        "ua": "Я вдома."
      },
      {
        "cz": "Ty jsi student.",
        "ua": "Ти студент."
      },
      {
        "cz": "My jsme v Praze.",
        "ua": "Ми в Празі."
      }
    ]
  },
  {
    "id": 2,
    "infinitive": "mít",
    "translation": "мати",
    "level": "A1",
    "conjugation": {
      "ja": "mám",
      "ty": "máš",
      "on": "má",
      "my": "máme",
      "vy": "máte",
      "oni": "mají"
    },
    "examples": [
      {
        "cz": "Já mám nový slovník.",
        "ua": "Я маю новий словник."
      },
      {
        "cz": "Ty máš dnes čas.",
        "ua": "Ти маєш сьогодні час."
      },
      {
        "cz": "My máme malý byt.",
        "ua": "Ми маємо маленьку квартиру."
      }
    ]
  },
  {
    "id": 3,
    "infinitive": "dělat",
    "translation": "робити",
    "level": "A1",
    "conjugation": {
      "ja": "dělám",
      "ty": "děláš",
      "on": "dělá",
      "my": "děláme",
      "vy": "děláte",
      "oni": "dělají"
    },
    "examples": [
      {
        "cz": "Já dělám domácí úkol.",
        "ua": "Я роблю домашнє завдання."
      },
      {
        "cz": "Ty děláš kávu.",
        "ua": "Ти робиш каву."
      },
      {
        "cz": "My děláme večeři.",
        "ua": "Ми готуємо вечерю."
      }
    ]
  },
  {
    "id": 4,
    "infinitive": "jít",
    "translation": "йти",
    "level": "A1",
    "conjugation": {
      "ja": "jdu",
      "ty": "jdeš",
      "on": "jde",
      "my": "jdeme",
      "vy": "jdete",
      "oni": "jdou"
    },
    "examples": [
      {
        "cz": "Já jdu do školy.",
        "ua": "Я йду до школи."
      },
      {
        "cz": "Ty jdeš do obchodu.",
        "ua": "Ти йдеш до магазину."
      },
      {
        "cz": "My jdeme domů.",
        "ua": "Ми йдемо додому."
      }
    ]
  },
  {
    "id": 5,
    "infinitive": "jet",
    "translation": "їхати",
    "level": "A1",
    "conjugation": {
      "ja": "jedu",
      "ty": "jedeš",
      "on": "jede",
      "my": "jedeme",
      "vy": "jedete",
      "oni": "jedou"
    },
    "examples": [
      {
        "cz": "Já jedu autobusem.",
        "ua": "Я їду автобусом."
      },
      {
        "cz": "Ty jedeš vlakem.",
        "ua": "Ти їдеш потягом."
      },
      {
        "cz": "My jedeme do Brna.",
        "ua": "Ми їдемо до Брно."
      }
    ]
  },
  {
    "id": 6,
    "infinitive": "chtít",
    "translation": "хотіти",
    "level": "A1",
    "conjugation": {
      "ja": "chci",
      "ty": "chceš",
      "on": "chce",
      "my": "chceme",
      "vy": "chcete",
      "oni": "chtějí"
    },
    "examples": [
      {
        "cz": "Já chci vodu.",
        "ua": "Я хочу воду."
      },
      {
        "cz": "Ty chceš kávu.",
        "ua": "Ти хочеш каву."
      },
      {
        "cz": "My chceme mluvit česky.",
        "ua": "Ми хочемо говорити чеською."
      }
    ]
  },
  {
    "id": 7,
    "infinitive": "moci",
    "translation": "могти",
    "level": "A1",
    "conjugation": {
      "ja": "můžu",
      "ty": "můžeš",
      "on": "může",
      "my": "můžeme",
      "vy": "můžete",
      "oni": "můžou"
    },
    "examples": [
      {
        "cz": "Já můžu přijít zítra.",
        "ua": "Я можу прийти завтра."
      },
      {
        "cz": "Ty můžeš sedět tady.",
        "ua": "Ти можеш сидіти тут."
      },
      {
        "cz": "My můžeme začít hned.",
        "ua": "Ми можемо почати одразу."
      }
    ]
  },
  {
    "id": 8,
    "infinitive": "muset",
    "translation": "мусити",
    "level": "A1",
    "conjugation": {
      "ja": "musím",
      "ty": "musíš",
      "on": "musí",
      "my": "musíme",
      "vy": "musíte",
      "oni": "musí"
    },
    "examples": [
      {
        "cz": "Já musím pracovat.",
        "ua": "Я мушу працювати."
      },
      {
        "cz": "Ty musíš čekat.",
        "ua": "Ти мусиш чекати."
      },
      {
        "cz": "My musíme jít domů.",
        "ua": "Ми мусимо йти додому."
      }
    ]
  },
  {
    "id": 9,
    "infinitive": "umět",
    "translation": "уміти",
    "level": "A1",
    "conjugation": {
      "ja": "umím",
      "ty": "umíš",
      "on": "umí",
      "my": "umíme",
      "vy": "umíte",
      "oni": "umějí"
    },
    "examples": [
      {
        "cz": "Já umím číst česky.",
        "ua": "Я вмію читати чеською."
      },
      {
        "cz": "Ty umíš dobře vařit.",
        "ua": "Ти вмієш добре готувати."
      },
      {
        "cz": "My umíme hrát fotbal.",
        "ua": "Ми вміємо грати у футбол."
      }
    ]
  },
  {
    "id": 10,
    "infinitive": "vědět",
    "translation": "знати",
    "level": "A1",
    "conjugation": {
      "ja": "vím",
      "ty": "víš",
      "on": "ví",
      "my": "víme",
      "vy": "víte",
      "oni": "vědí"
    },
    "examples": [
      {
        "cz": "Já vím odpověď.",
        "ua": "Я знаю відповідь."
      },
      {
        "cz": "Ty víš, kde je nádraží.",
        "ua": "Ти знаєш, де вокзал."
      },
      {
        "cz": "My víme, co potřebujeme.",
        "ua": "Ми знаємо, що нам потрібно."
      }
    ]
  },
  {
    "id": 11,
    "infinitive": "říct",
    "translation": "сказати",
    "level": "A1",
    "conjugation": {
      "ja": "řeknu",
      "ty": "řekneš",
      "on": "řekne",
      "my": "řekneme",
      "vy": "řeknete",
      "oni": "řeknou"
    },
    "examples": [
      {
        "cz": "Já řeknu pravdu.",
        "ua": "Я скажу правду."
      },
      {
        "cz": "Ty řekneš své jméno.",
        "ua": "Ти скажеш своє ім'я."
      },
      {
        "cz": "My řekneme adresu.",
        "ua": "Ми скажемо адресу."
      }
    ]
  },
  {
    "id": 12,
    "infinitive": "dát",
    "translation": "дати",
    "level": "A1",
    "conjugation": {
      "ja": "dám",
      "ty": "dáš",
      "on": "dá",
      "my": "dáme",
      "vy": "dáte",
      "oni": "dají"
    },
    "examples": [
      {
        "cz": "Já dám dítěti jablko.",
        "ua": "Я дам дитині яблуко."
      },
      {
        "cz": "Ty dáš klíče na stůl.",
        "ua": "Ти покладеш ключі на стіл."
      },
      {
        "cz": "My dáme učiteli sešit.",
        "ua": "Ми дамо вчителю зошит."
      }
    ]
  },
  {
    "id": 13,
    "infinitive": "vidět",
    "translation": "бачити",
    "level": "A1",
    "conjugation": {
      "ja": "vidím",
      "ty": "vidíš",
      "on": "vidí",
      "my": "vidíme",
      "vy": "vidíte",
      "oni": "vidí"
    },
    "examples": [
      {
        "cz": "Já vidím dům.",
        "ua": "Я бачу будинок."
      },
      {
        "cz": "Ty vidíš tramvaj.",
        "ua": "Ти бачиш трамвай."
      },
      {
        "cz": "My vidíme krásný park.",
        "ua": "Ми бачимо гарний парк."
      }
    ]
  },
  {
    "id": 14,
    "infinitive": "slyšet",
    "translation": "чути",
    "level": "A1",
    "conjugation": {
      "ja": "slyším",
      "ty": "slyšíš",
      "on": "slyší",
      "my": "slyšíme",
      "vy": "slyšíte",
      "oni": "slyší"
    },
    "examples": [
      {
        "cz": "Já slyším hudbu.",
        "ua": "Я чую музику."
      },
      {
        "cz": "Ty slyšíš telefon.",
        "ua": "Ти чуєш телефон."
      },
      {
        "cz": "My slyšíme učitele.",
        "ua": "Ми чуємо вчителя."
      }
    ]
  },
  {
    "id": 15,
    "infinitive": "cítit",
    "translation": "відчувати",
    "level": "A1",
    "conjugation": {
      "ja": "cítím",
      "ty": "cítíš",
      "on": "cítí",
      "my": "cítíme",
      "vy": "cítíte",
      "oni": "cítí"
    },
    "examples": [
      {
        "cz": "Já cítím vůni kávy.",
        "ua": "Я відчуваю запах кави."
      },
      {
        "cz": "Ty cítíš chlad.",
        "ua": "Ти відчуваєш холод."
      },
      {
        "cz": "My cítíme radost.",
        "ua": "Ми відчуваємо радість."
      }
    ]
  },
  {
    "id": 16,
    "infinitive": "vzít",
    "translation": "взяти",
    "level": "A1",
    "conjugation": {
      "ja": "vezmu",
      "ty": "vezmeš",
      "on": "vezme",
      "my": "vezmeme",
      "vy": "vezmete",
      "oni": "vezmou"
    },
    "examples": [
      {
        "cz": "Já vezmu tašku.",
        "ua": "Я візьму сумку."
      },
      {
        "cz": "Ty vezmeš deštník.",
        "ua": "Ти візьмеш парасольку."
      },
      {
        "cz": "My vezmeme mapu.",
        "ua": "Ми візьмемо мапу."
      }
    ]
  },
  {
    "id": 17,
    "infinitive": "přijít",
    "translation": "прийти",
    "level": "A1",
    "conjugation": {
      "ja": "přijdu",
      "ty": "přijdeš",
      "on": "přijde",
      "my": "přijdeme",
      "vy": "přijdete",
      "oni": "přijdou"
    },
    "examples": [
      {
        "cz": "Já přijdu večer.",
        "ua": "Я прийду ввечері."
      },
      {
        "cz": "Ty přijdeš v osm.",
        "ua": "Ти прийдеш о восьмій."
      },
      {
        "cz": "My přijdeme spolu.",
        "ua": "Ми прийдемо разом."
      }
    ]
  },
  {
    "id": 18,
    "infinitive": "odejít",
    "translation": "піти",
    "level": "A1",
    "conjugation": {
      "ja": "odejdu",
      "ty": "odejdeš",
      "on": "odejde",
      "my": "odejdeme",
      "vy": "odejdete",
      "oni": "odejdou"
    },
    "examples": [
      {
        "cz": "Já odejdu brzy.",
        "ua": "Я піду рано."
      },
      {
        "cz": "Ty odejdeš po obědě.",
        "ua": "Ти підеш після обіду."
      },
      {
        "cz": "My odejdeme domů.",
        "ua": "Ми підемо додому."
      }
    ]
  },
  {
    "id": 19,
    "infinitive": "přijet",
    "translation": "приїхати",
    "level": "A1",
    "conjugation": {
      "ja": "přijedu",
      "ty": "přijedeš",
      "on": "přijede",
      "my": "přijedeme",
      "vy": "přijedete",
      "oni": "přijedou"
    },
    "examples": [
      {
        "cz": "Já přijedu vlakem.",
        "ua": "Я приїду потягом."
      },
      {
        "cz": "Ty přijedeš zítra.",
        "ua": "Ти приїдеш завтра."
      },
      {
        "cz": "My přijedeme do Prahy.",
        "ua": "Ми приїдемо до Праги."
      }
    ]
  },
  {
    "id": 20,
    "infinitive": "odjet",
    "translation": "поїхати",
    "level": "A1",
    "conjugation": {
      "ja": "odjedu",
      "ty": "odjedeš",
      "on": "odjede",
      "my": "odjedeme",
      "vy": "odjedete",
      "oni": "odjedou"
    },
    "examples": [
      {
        "cz": "Já odjedu ráno.",
        "ua": "Я поїду вранці."
      },
      {
        "cz": "Ty odjedeš autobusem.",
        "ua": "Ти поїдеш автобусом."
      },
      {
        "cz": "My odjedeme v pátek.",
        "ua": "Ми поїдемо в п'ятницю."
      }
    ]
  },
  {
    "id": 21,
    "infinitive": "pracovat",
    "translation": "працювати",
    "level": "A1",
    "conjugation": {
      "ja": "pracuju",
      "ty": "pracuješ",
      "on": "pracuje",
      "my": "pracujeme",
      "vy": "pracujete",
      "oni": "pracují"
    },
    "examples": [
      {
        "cz": "Já pracuju v kanceláři.",
        "ua": "Я працюю в офісі."
      },
      {
        "cz": "Ty pracuješ doma.",
        "ua": "Ти працюєш удома."
      },
      {
        "cz": "My pracujeme každý den.",
        "ua": "Ми працюємо щодня."
      }
    ]
  },
  {
    "id": 22,
    "infinitive": "bydlet",
    "translation": "мешкати",
    "level": "A1",
    "conjugation": {
      "ja": "bydlím",
      "ty": "bydlíš",
      "on": "bydlí",
      "my": "bydlíme",
      "vy": "bydlíte",
      "oni": "bydlí"
    },
    "examples": [
      {
        "cz": "Já bydlím v Praze.",
        "ua": "Я мешкаю в Празі."
      },
      {
        "cz": "Ty bydlíš blízko centra.",
        "ua": "Ти мешкаєш близько до центру."
      },
      {
        "cz": "My bydlíme v malém domě.",
        "ua": "Ми мешкаємо в маленькому будинку."
      }
    ]
  },
  {
    "id": 23,
    "infinitive": "žít",
    "translation": "жити",
    "level": "A1",
    "conjugation": {
      "ja": "žiju",
      "ty": "žiješ",
      "on": "žije",
      "my": "žijeme",
      "vy": "žijete",
      "oni": "žijí"
    },
    "examples": [
      {
        "cz": "Já žiju v Česku.",
        "ua": "Я живу в Чехії."
      },
      {
        "cz": "Ty žiješ s rodinou.",
        "ua": "Ти живеш із родиною."
      },
      {
        "cz": "My žijeme klidně.",
        "ua": "Ми живемо спокійно."
      }
    ]
  },
  {
    "id": 24,
    "infinitive": "studovat",
    "translation": "навчатися",
    "level": "A1",
    "conjugation": {
      "ja": "studuju",
      "ty": "studuješ",
      "on": "studuje",
      "my": "studujeme",
      "vy": "studujete",
      "oni": "studují"
    },
    "examples": [
      {
        "cz": "Já studuju češtinu.",
        "ua": "Я вивчаю чеську."
      },
      {
        "cz": "Ty studuješ na univerzitě.",
        "ua": "Ти навчаєшся в університеті."
      },
      {
        "cz": "My studujeme spolu.",
        "ua": "Ми навчаємося разом."
      }
    ]
  },
  {
    "id": 25,
    "infinitive": "učit se",
    "translation": "вчитися",
    "level": "A1",
    "conjugation": {
      "ja": "učím se",
      "ty": "učíš se",
      "on": "učí se",
      "my": "učíme se",
      "vy": "učíte se",
      "oni": "učí se"
    },
    "examples": [
      {
        "cz": "Já se učím nová slova.",
        "ua": "Я вчу нові слова."
      },
      {
        "cz": "Ty se učíš doma.",
        "ua": "Ти вчишся вдома."
      },
      {
        "cz": "My se učíme česky.",
        "ua": "Ми вчимося чеською."
      }
    ]
  },
  {
    "id": 26,
    "infinitive": "učit",
    "translation": "навчати",
    "level": "A1",
    "conjugation": {
      "ja": "učím",
      "ty": "učíš",
      "on": "učí",
      "my": "učíme",
      "vy": "učíte",
      "oni": "učí"
    },
    "examples": [
      {
        "cz": "Já učím děti češtinu.",
        "ua": "Я навчаю дітей чеської."
      },
      {
        "cz": "Ty učíš novou lekci.",
        "ua": "Ти викладаєш новий урок."
      },
      {
        "cz": "My učíme ve škole.",
        "ua": "Ми викладаємо в школі."
      }
    ]
  },
  {
    "id": 27,
    "infinitive": "mluvit",
    "translation": "говорити",
    "level": "A1",
    "conjugation": {
      "ja": "mluvím",
      "ty": "mluvíš",
      "on": "mluví",
      "my": "mluvíme",
      "vy": "mluvíte",
      "oni": "mluví"
    },
    "examples": [
      {
        "cz": "Já mluvím trochu česky.",
        "ua": "Я трохи говорю чеською."
      },
      {
        "cz": "Ty mluvíš rychle.",
        "ua": "Ти говориш швидко."
      },
      {
        "cz": "My mluvíme s učitelem.",
        "ua": "Ми говоримо з учителем."
      }
    ]
  },
  {
    "id": 28,
    "infinitive": "říkat",
    "translation": "казати",
    "level": "A1",
    "conjugation": {
      "ja": "říkám",
      "ty": "říkáš",
      "on": "říká",
      "my": "říkáme",
      "vy": "říkáte",
      "oni": "říkají"
    },
    "examples": [
      {
        "cz": "Já říkám dobrý den.",
        "ua": "Я кажу добрий день."
      },
      {
        "cz": "Ty říkáš pravdu.",
        "ua": "Ти кажеш правду."
      },
      {
        "cz": "My říkáme nová slova nahlas.",
        "ua": "Ми кажемо нові слова вголос."
      }
    ]
  },
  {
    "id": 29,
    "infinitive": "rozumět",
    "translation": "розуміти",
    "level": "A1",
    "conjugation": {
      "ja": "rozumím",
      "ty": "rozumíš",
      "on": "rozumí",
      "my": "rozumíme",
      "vy": "rozumíte",
      "oni": "rozumějí"
    },
    "examples": [
      {
        "cz": "Já rozumím otázce.",
        "ua": "Я розумію запитання."
      },
      {
        "cz": "Ty rozumíš učiteli.",
        "ua": "Ти розумієш учителя."
      },
      {
        "cz": "My rozumíme pomalu mluvené češtině.",
        "ua": "Ми розуміємо повільну чеську мову."
      }
    ]
  },
  {
    "id": 30,
    "infinitive": "znát",
    "translation": "знати",
    "level": "A1",
    "conjugation": {
      "ja": "znám",
      "ty": "znáš",
      "on": "zná",
      "my": "známe",
      "vy": "znáte",
      "oni": "znají"
    },
    "examples": [
      {
        "cz": "Já znám tu ulici.",
        "ua": "Я знаю цю вулицю."
      },
      {
        "cz": "Ty znáš našeho souseda.",
        "ua": "Ти знаєш нашого сусіда."
      },
      {
        "cz": "My známe dobré místo.",
        "ua": "Ми знаємо гарне місце."
      }
    ]
  },
  {
    "id": 31,
    "infinitive": "číst",
    "translation": "читати",
    "level": "A1",
    "conjugation": {
      "ja": "čtu",
      "ty": "čteš",
      "on": "čte",
      "my": "čteme",
      "vy": "čtete",
      "oni": "čtou"
    },
    "examples": [
      {
        "cz": "Já čtu krátký text.",
        "ua": "Я читаю короткий текст."
      },
      {
        "cz": "Ty čteš českou knihu.",
        "ua": "Ти читаєш чеську книжку."
      },
      {
        "cz": "My čteme noviny.",
        "ua": "Ми читаємо газету."
      }
    ]
  },
  {
    "id": 32,
    "infinitive": "psát",
    "translation": "писати",
    "level": "A1",
    "conjugation": {
      "ja": "píšu",
      "ty": "píšeš",
      "on": "píše",
      "my": "píšeme",
      "vy": "píšete",
      "oni": "píšou"
    },
    "examples": [
      {
        "cz": "Já píšu e-mail.",
        "ua": "Я пишу електронного листа."
      },
      {
        "cz": "Ty píšeš poznámky.",
        "ua": "Ти пишеш нотатки."
      },
      {
        "cz": "My píšeme cvičení.",
        "ua": "Ми пишемо вправу."
      }
    ]
  },
  {
    "id": 33,
    "infinitive": "poslouchat",
    "translation": "слухати",
    "level": "A1",
    "conjugation": {
      "ja": "poslouchám",
      "ty": "posloucháš",
      "on": "poslouchá",
      "my": "posloucháme",
      "vy": "posloucháte",
      "oni": "poslouchají"
    },
    "examples": [
      {
        "cz": "Já poslouchám rádio.",
        "ua": "Я слухаю радіо."
      },
      {
        "cz": "Ty posloucháš hudbu.",
        "ua": "Ти слухаєш музику."
      },
      {
        "cz": "My posloucháme český podcast.",
        "ua": "Ми слухаємо чеський подкаст."
      }
    ]
  },
  {
    "id": 34,
    "infinitive": "dívat se",
    "translation": "дивитися",
    "level": "A1",
    "conjugation": {
      "ja": "dívám se",
      "ty": "díváš se",
      "on": "dívá se",
      "my": "díváme se",
      "vy": "díváte se",
      "oni": "dívají se"
    },
    "examples": [
      {
        "cz": "Já se dívám na film.",
        "ua": "Я дивлюся фільм."
      },
      {
        "cz": "Ty se díváš z okna.",
        "ua": "Ти дивишся з вікна."
      },
      {
        "cz": "My se díváme na mapu.",
        "ua": "Ми дивимося на мапу."
      }
    ]
  },
  {
    "id": 35,
    "infinitive": "sledovat",
    "translation": "стежити, дивитися",
    "level": "A1",
    "conjugation": {
      "ja": "sleduju",
      "ty": "sleduješ",
      "on": "sleduje",
      "my": "sledujeme",
      "vy": "sledujete",
      "oni": "sledují"
    },
    "examples": [
      {
        "cz": "Já sleduju zprávy.",
        "ua": "Я дивлюся новини."
      },
      {
        "cz": "Ty sleduješ seriál.",
        "ua": "Ти дивишся серіал."
      },
      {
        "cz": "My sledujeme počasí.",
        "ua": "Ми стежимо за погодою."
      }
    ]
  },
  {
    "id": 36,
    "infinitive": "jíst",
    "translation": "їсти",
    "level": "A1",
    "conjugation": {
      "ja": "jím",
      "ty": "jíš",
      "on": "jí",
      "my": "jíme",
      "vy": "jíte",
      "oni": "jedí"
    },
    "examples": [
      {
        "cz": "Já jím polévku.",
        "ua": "Я їм суп."
      },
      {
        "cz": "Ty jíš chleba.",
        "ua": "Ти їси хліб."
      },
      {
        "cz": "My jíme oběd.",
        "ua": "Ми їмо обід."
      }
    ]
  },
  {
    "id": 37,
    "infinitive": "pít",
    "translation": "пити",
    "level": "A1",
    "conjugation": {
      "ja": "piju",
      "ty": "piješ",
      "on": "pije",
      "my": "pijeme",
      "vy": "pijete",
      "oni": "pijí"
    },
    "examples": [
      {
        "cz": "Já piju vodu.",
        "ua": "Я п'ю воду."
      },
      {
        "cz": "Ty piješ čaj.",
        "ua": "Ти п'єш чай."
      },
      {
        "cz": "My pijeme kávu.",
        "ua": "Ми п'ємо каву."
      }
    ]
  },
  {
    "id": 38,
    "infinitive": "vařit",
    "translation": "готувати, варити",
    "level": "A1",
    "conjugation": {
      "ja": "vařím",
      "ty": "vaříš",
      "on": "vaří",
      "my": "vaříme",
      "vy": "vaříte",
      "oni": "vaří"
    },
    "examples": [
      {
        "cz": "Já vařím večeři.",
        "ua": "Я готую вечерю."
      },
      {
        "cz": "Ty vaříš polévku.",
        "ua": "Ти вариш суп."
      },
      {
        "cz": "My vaříme doma.",
        "ua": "Ми готуємо вдома."
      }
    ]
  },
  {
    "id": 39,
    "infinitive": "kupovat",
    "translation": "купувати",
    "level": "A1",
    "conjugation": {
      "ja": "kupuju",
      "ty": "kupuješ",
      "on": "kupuje",
      "my": "kupujeme",
      "vy": "kupujete",
      "oni": "kupují"
    },
    "examples": [
      {
        "cz": "Já kupuju lístek.",
        "ua": "Я купую квиток."
      },
      {
        "cz": "Ty kupuješ ovoce.",
        "ua": "Ти купуєш фрукти."
      },
      {
        "cz": "My kupujeme potraviny.",
        "ua": "Ми купуємо продукти."
      }
    ]
  },
  {
    "id": 40,
    "infinitive": "prodávat",
    "translation": "продавати",
    "level": "A2",
    "conjugation": {
      "ja": "prodávám",
      "ty": "prodáváš",
      "on": "prodává",
      "my": "prodáváme",
      "vy": "prodáváte",
      "oni": "prodávají"
    },
    "examples": [
      {
        "cz": "Já prodávám staré kolo.",
        "ua": "Я продаю старий велосипед."
      },
      {
        "cz": "Ty prodáváš knihy.",
        "ua": "Ти продаєш книжки."
      },
      {
        "cz": "My prodáváme zeleninu na trhu.",
        "ua": "Ми продаємо овочі на ринку."
      }
    ]
  },
  {
    "id": 41,
    "infinitive": "platit",
    "translation": "платити",
    "level": "A1",
    "conjugation": {
      "ja": "platím",
      "ty": "platíš",
      "on": "platí",
      "my": "platíme",
      "vy": "platíte",
      "oni": "platí"
    },
    "examples": [
      {
        "cz": "Já platím kartou.",
        "ua": "Я плачу карткою."
      },
      {
        "cz": "Ty platíš hotově.",
        "ua": "Ти платиш готівкою."
      },
      {
        "cz": "My platíme účet.",
        "ua": "Ми оплачуємо рахунок."
      }
    ]
  },
  {
    "id": 42,
    "infinitive": "objednat",
    "translation": "замовити",
    "level": "A1",
    "conjugation": {
      "ja": "objednám",
      "ty": "objednáš",
      "on": "objedná",
      "my": "objednáme",
      "vy": "objednáte",
      "oni": "objednají"
    },
    "examples": [
      {
        "cz": "Já objednám pizzu.",
        "ua": "Я замовлю піцу."
      },
      {
        "cz": "Ty objednáš taxi.",
        "ua": "Ти замовиш таксі."
      },
      {
        "cz": "My objednáme stůl v restauraci.",
        "ua": "Ми замовимо столик у ресторані."
      }
    ]
  },
  {
    "id": 43,
    "infinitive": "rezervovat",
    "translation": "резервувати",
    "level": "A2",
    "conjugation": {
      "ja": "rezervuju",
      "ty": "rezervuješ",
      "on": "rezervuje",
      "my": "rezervujeme",
      "vy": "rezervujete",
      "oni": "rezervují"
    },
    "examples": [
      {
        "cz": "Já rezervuju pokoj.",
        "ua": "Я резервую номер."
      },
      {
        "cz": "Ty rezervuješ lístky online.",
        "ua": "Ти резервуєш квитки онлайн."
      },
      {
        "cz": "My rezervujeme stůl na večer.",
        "ua": "Ми резервуємо столик на вечір."
      }
    ]
  },
  {
    "id": 44,
    "infinitive": "hledat",
    "translation": "шукати",
    "level": "A1",
    "conjugation": {
      "ja": "hledám",
      "ty": "hledáš",
      "on": "hledá",
      "my": "hledáme",
      "vy": "hledáte",
      "oni": "hledají"
    },
    "examples": [
      {
        "cz": "Já hledám klíče.",
        "ua": "Я шукаю ключі."
      },
      {
        "cz": "Ty hledáš adresu.",
        "ua": "Ти шукаєш адресу."
      },
      {
        "cz": "My hledáme levný hotel.",
        "ua": "Ми шукаємо недорогий готель."
      }
    ]
  },
  {
    "id": 45,
    "infinitive": "najít",
    "translation": "знайти",
    "level": "A1",
    "conjugation": {
      "ja": "najdu",
      "ty": "najdeš",
      "on": "najde",
      "my": "najdeme",
      "vy": "najdete",
      "oni": "najdou"
    },
    "examples": [
      {
        "cz": "Já najdu cestu.",
        "ua": "Я знайду дорогу."
      },
      {
        "cz": "Ty najdeš správnou odpověď.",
        "ua": "Ти знайдеш правильну відповідь."
      },
      {
        "cz": "My najdeme dobrý kurz.",
        "ua": "Ми знайдемо хороший курс."
      }
    ]
  },
  {
    "id": 46,
    "infinitive": "čekat",
    "translation": "чекати",
    "level": "A1",
    "conjugation": {
      "ja": "čekám",
      "ty": "čekáš",
      "on": "čeká",
      "my": "čekáme",
      "vy": "čekáte",
      "oni": "čekají"
    },
    "examples": [
      {
        "cz": "Já čekám na autobus.",
        "ua": "Я чекаю на автобус."
      },
      {
        "cz": "Ty čekáš na kamaráda.",
        "ua": "Ти чекаєш на друга."
      },
      {
        "cz": "My čekáme před školou.",
        "ua": "Ми чекаємо перед школою."
      }
    ]
  },
  {
    "id": 47,
    "infinitive": "začít",
    "translation": "почати",
    "level": "A1",
    "conjugation": {
      "ja": "začnu",
      "ty": "začneš",
      "on": "začne",
      "my": "začneme",
      "vy": "začnete",
      "oni": "začnou"
    },
    "examples": [
      {
        "cz": "Já začnu novou lekci.",
        "ua": "Я почну новий урок."
      },
      {
        "cz": "Ty začneš pracovat v devět.",
        "ua": "Ти почнеш працювати о дев'ятій."
      },
      {
        "cz": "My začneme zítra.",
        "ua": "Ми почнемо завтра."
      }
    ]
  },
  {
    "id": 48,
    "infinitive": "skončit",
    "translation": "закінчити",
    "level": "A1",
    "conjugation": {
      "ja": "skončím",
      "ty": "skončíš",
      "on": "skončí",
      "my": "skončíme",
      "vy": "skončíte",
      "oni": "skončí"
    },
    "examples": [
      {
        "cz": "Já skončím práci v pět.",
        "ua": "Я закінчу роботу о п'ятій."
      },
      {
        "cz": "Ty skončíš cvičení.",
        "ua": "Ти закінчиш вправу."
      },
      {
        "cz": "My skončíme kurz v červnu.",
        "ua": "Ми закінчимо курс у червні."
      }
    ]
  },
  {
    "id": 49,
    "infinitive": "otevřít",
    "translation": "відкрити",
    "level": "A1",
    "conjugation": {
      "ja": "otevřu",
      "ty": "otevřeš",
      "on": "otevře",
      "my": "otevřeme",
      "vy": "otevřete",
      "oni": "otevřou"
    },
    "examples": [
      {
        "cz": "Já otevřu okno.",
        "ua": "Я відкрию вікно."
      },
      {
        "cz": "Ty otevřeš dveře.",
        "ua": "Ти відкриєш двері."
      },
      {
        "cz": "My otevřeme obchod ráno.",
        "ua": "Ми відкриємо магазин вранці."
      }
    ]
  },
  {
    "id": 50,
    "infinitive": "zavřít",
    "translation": "закрити",
    "level": "A1",
    "conjugation": {
      "ja": "zavřu",
      "ty": "zavřeš",
      "on": "zavře",
      "my": "zavřeme",
      "vy": "zavřete",
      "oni": "zavřou"
    },
    "examples": [
      {
        "cz": "Já zavřu okno.",
        "ua": "Я закрию вікно."
      },
      {
        "cz": "Ty zavřeš dveře.",
        "ua": "Ти закриєш двері."
      },
      {
        "cz": "My zavřeme obchod večer.",
        "ua": "Ми закриємо магазин увечері."
      }
    ]
  },
  {
    "id": 51,
    "infinitive": "sedět",
    "translation": "сидіти",
    "level": "A1",
    "conjugation": {
      "ja": "sedím",
      "ty": "sedíš",
      "on": "sedí",
      "my": "sedíme",
      "vy": "sedíte",
      "oni": "sedí"
    },
    "examples": [
      {
        "cz": "Já sedím u okna.",
        "ua": "Я сиджу біля вікна."
      },
      {
        "cz": "Ty sedíš vedle mě.",
        "ua": "Ти сидиш поруч зі мною."
      },
      {
        "cz": "My sedíme v kavárně.",
        "ua": "Ми сидимо в кав'ярні."
      }
    ]
  },
  {
    "id": 52,
    "infinitive": "stát",
    "translation": "стояти, коштувати",
    "level": "A1",
    "conjugation": {
      "ja": "stojím",
      "ty": "stojíš",
      "on": "stojí",
      "my": "stojíme",
      "vy": "stojíte",
      "oni": "stojí"
    },
    "examples": [
      {
        "cz": "Já stojím na zastávce.",
        "ua": "Я стою на зупинці."
      },
      {
        "cz": "Ty stojíš u dveří.",
        "ua": "Ти стоїш біля дверей."
      },
      {
        "cz": "My stojíme ve frontě.",
        "ua": "Ми стоїмо в черзі."
      }
    ]
  },
  {
    "id": 53,
    "infinitive": "ležet",
    "translation": "лежати",
    "level": "A1",
    "conjugation": {
      "ja": "ležím",
      "ty": "ležíš",
      "on": "leží",
      "my": "ležíme",
      "vy": "ležíte",
      "oni": "leží"
    },
    "examples": [
      {
        "cz": "Já ležím na posteli.",
        "ua": "Я лежу на ліжку."
      },
      {
        "cz": "Ty ležíš na gauči.",
        "ua": "Ти лежиш на дивані."
      },
      {
        "cz": "My ležíme na pláži.",
        "ua": "Ми лежимо на пляжі."
      }
    ]
  },
  {
    "id": 54,
    "infinitive": "běžet",
    "translation": "бігти",
    "level": "A1",
    "conjugation": {
      "ja": "běžím",
      "ty": "běžíš",
      "on": "běží",
      "my": "běžíme",
      "vy": "běžíte",
      "oni": "běží"
    },
    "examples": [
      {
        "cz": "Já běžím do parku.",
        "ua": "Я біжу до парку."
      },
      {
        "cz": "Ty běžíš rychle.",
        "ua": "Ти біжиш швидко."
      },
      {
        "cz": "My běžíme na autobus.",
        "ua": "Ми біжимо на автобус."
      }
    ]
  },
  {
    "id": 55,
    "infinitive": "chodit",
    "translation": "ходити",
    "level": "A1",
    "conjugation": {
      "ja": "chodím",
      "ty": "chodíš",
      "on": "chodí",
      "my": "chodíme",
      "vy": "chodíte",
      "oni": "chodí"
    },
    "examples": [
      {
        "cz": "Já chodím do práce pěšky.",
        "ua": "Я ходжу на роботу пішки."
      },
      {
        "cz": "Ty chodíš do školy.",
        "ua": "Ти ходиш до школи."
      },
      {
        "cz": "My chodíme často do kina.",
        "ua": "Ми часто ходимо в кіно."
      }
    ]
  },
  {
    "id": 56,
    "infinitive": "nosit",
    "translation": "носити",
    "level": "A1",
    "conjugation": {
      "ja": "nosím",
      "ty": "nosíš",
      "on": "nosí",
      "my": "nosíme",
      "vy": "nosíte",
      "oni": "nosí"
    },
    "examples": [
      {
        "cz": "Já nosím brýle.",
        "ua": "Я ношу окуляри."
      },
      {
        "cz": "Ty nosíš modrou bundu.",
        "ua": "Ти носиш синю куртку."
      },
      {
        "cz": "My nosíme knihy do školy.",
        "ua": "Ми носимо книжки до школи."
      }
    ]
  },
  {
    "id": 57,
    "infinitive": "přinést",
    "translation": "принести",
    "level": "A2",
    "conjugation": {
      "ja": "přinesu",
      "ty": "přineseš",
      "on": "přinese",
      "my": "přineseme",
      "vy": "přinesete",
      "oni": "přinesou"
    },
    "examples": [
      {
        "cz": "Já přinesu vodu.",
        "ua": "Я принесу воду."
      },
      {
        "cz": "Ty přineseš dokumenty.",
        "ua": "Ти принесеш документи."
      },
      {
        "cz": "My přineseme dort.",
        "ua": "Ми принесемо торт."
      }
    ]
  },
  {
    "id": 58,
    "infinitive": "odnést",
    "translation": "віднести",
    "level": "A2",
    "conjugation": {
      "ja": "odnesu",
      "ty": "odneseš",
      "on": "odnese",
      "my": "odneseme",
      "vy": "odnesete",
      "oni": "odnesou"
    },
    "examples": [
      {
        "cz": "Já odnesu talíře.",
        "ua": "Я віднесу тарілки."
      },
      {
        "cz": "Ty odneseš tašku domů.",
        "ua": "Ти віднесеш сумку додому."
      },
      {
        "cz": "My odneseme knihy do knihovny.",
        "ua": "Ми віднесемо книжки до бібліотеки."
      }
    ]
  },
  {
    "id": 59,
    "infinitive": "vrátit se",
    "translation": "повернутися",
    "level": "A1",
    "conjugation": {
      "ja": "vrátím se",
      "ty": "vrátíš se",
      "on": "vrátí se",
      "my": "vrátíme se",
      "vy": "vrátíte se",
      "oni": "vrátí se"
    },
    "examples": [
      {
        "cz": "Já se vrátím večer.",
        "ua": "Я повернуся ввечері."
      },
      {
        "cz": "Ty se vrátíš z práce.",
        "ua": "Ти повернешся з роботи."
      },
      {
        "cz": "My se vrátíme domů.",
        "ua": "Ми повернемося додому."
      }
    ]
  },
  {
    "id": 60,
    "infinitive": "zůstat",
    "translation": "залишитися",
    "level": "A1",
    "conjugation": {
      "ja": "zůstanu",
      "ty": "zůstaneš",
      "on": "zůstane",
      "my": "zůstaneme",
      "vy": "zůstanete",
      "oni": "zůstanou"
    },
    "examples": [
      {
        "cz": "Já zůstanu doma.",
        "ua": "Я залишуся вдома."
      },
      {
        "cz": "Ty zůstaneš v práci déle.",
        "ua": "Ти залишишся на роботі довше."
      },
      {
        "cz": "My zůstaneme tady.",
        "ua": "Ми залишимося тут."
      }
    ]
  },
  {
    "id": 61,
    "infinitive": "pomáhat",
    "translation": "допомагати",
    "level": "A1",
    "conjugation": {
      "ja": "pomáhám",
      "ty": "pomáháš",
      "on": "pomáhá",
      "my": "pomáháme",
      "vy": "pomáháte",
      "oni": "pomáhají"
    },
    "examples": [
      {
        "cz": "Já pomáhám mamince.",
        "ua": "Я допомагаю мамі."
      },
      {
        "cz": "Ty pomáháš kamarádovi.",
        "ua": "Ти допомагаєш другові."
      },
      {
        "cz": "My pomáháme sousedům.",
        "ua": "Ми допомагаємо сусідам."
      }
    ]
  },
  {
    "id": 62,
    "infinitive": "potřebovat",
    "translation": "потребувати",
    "level": "A1",
    "conjugation": {
      "ja": "potřebuju",
      "ty": "potřebuješ",
      "on": "potřebuje",
      "my": "potřebujeme",
      "vy": "potřebujete",
      "oni": "potřebují"
    },
    "examples": [
      {
        "cz": "Já potřebuju pomoc.",
        "ua": "Я потребую допомоги."
      },
      {
        "cz": "Ty potřebuješ nové boty.",
        "ua": "Ти потребуєш нового взуття."
      },
      {
        "cz": "My potřebujeme čas.",
        "ua": "Ми потребуємо часу."
      }
    ]
  },
  {
    "id": 63,
    "infinitive": "používat",
    "translation": "використовувати",
    "level": "A2",
    "conjugation": {
      "ja": "používám",
      "ty": "používáš",
      "on": "používá",
      "my": "používáme",
      "vy": "používáte",
      "oni": "používají"
    },
    "examples": [
      {
        "cz": "Já používám slovník.",
        "ua": "Я використовую словник."
      },
      {
        "cz": "Ty používáš mobil.",
        "ua": "Ти використовуєш мобільний телефон."
      },
      {
        "cz": "My používáme aplikaci každý den.",
        "ua": "Ми використовуємо застосунок щодня."
      }
    ]
  },
  {
    "id": 64,
    "infinitive": "myslet",
    "translation": "думати",
    "level": "A1",
    "conjugation": {
      "ja": "myslím",
      "ty": "myslíš",
      "on": "myslí",
      "my": "myslíme",
      "vy": "myslíte",
      "oni": "myslí"
    },
    "examples": [
      {
        "cz": "Já myslím na rodinu.",
        "ua": "Я думаю про родину."
      },
      {
        "cz": "Ty myslíš na práci.",
        "ua": "Ти думаєш про роботу."
      },
      {
        "cz": "My myslíme pozitivně.",
        "ua": "Ми думаємо позитивно."
      }
    ]
  },
  {
    "id": 65,
    "infinitive": "pamatovat si",
    "translation": "пам'ятати",
    "level": "A2",
    "conjugation": {
      "ja": "pamatuju si",
      "ty": "pamatuješ si",
      "on": "pamatuje si",
      "my": "pamatujeme si",
      "vy": "pamatujete si",
      "oni": "pamatují si"
    },
    "examples": [
      {
        "cz": "Já si pamatuju tvoje jméno.",
        "ua": "Я пам'ятаю твоє ім'я."
      },
      {
        "cz": "Ty si pamatuješ adresu.",
        "ua": "Ти пам'ятаєш адресу."
      },
      {
        "cz": "My si pamatujeme nová slova.",
        "ua": "Ми пам'ятаємо нові слова."
      }
    ]
  },
  {
    "id": 66,
    "infinitive": "zapomenout",
    "translation": "забути",
    "level": "A2",
    "conjugation": {
      "ja": "zapomenu",
      "ty": "zapomeneš",
      "on": "zapomene",
      "my": "zapomeneme",
      "vy": "zapomenete",
      "oni": "zapomenou"
    },
    "examples": [
      {
        "cz": "Já zapomenu heslo.",
        "ua": "Я забуду пароль."
      },
      {
        "cz": "Ty zapomeneš klíče.",
        "ua": "Ти забудеш ключі."
      },
      {
        "cz": "My zapomeneme starou chybu.",
        "ua": "Ми забудемо стару помилку."
      }
    ]
  },
  {
    "id": 67,
    "infinitive": "bát se",
    "translation": "боятися",
    "level": "A2",
    "conjugation": {
      "ja": "bojím se",
      "ty": "bojíš se",
      "on": "bojí se",
      "my": "bojíme se",
      "vy": "bojíte se",
      "oni": "bojí se"
    },
    "examples": [
      {
        "cz": "Já se bojím tmy.",
        "ua": "Я боюся темряви."
      },
      {
        "cz": "Ty se bojíš zkoušky.",
        "ua": "Ти боїшся іспиту."
      },
      {
        "cz": "My se bojíme bouřky.",
        "ua": "Ми боїмося грози."
      }
    ]
  },
  {
    "id": 68,
    "infinitive": "smát se",
    "translation": "сміятися",
    "level": "A1",
    "conjugation": {
      "ja": "směju se",
      "ty": "směješ se",
      "on": "směje se",
      "my": "smějeme se",
      "vy": "smějete se",
      "oni": "smějí se"
    },
    "examples": [
      {
        "cz": "Já se směju vtipu.",
        "ua": "Я сміюся з жарту."
      },
      {
        "cz": "Ty se směješ nahlas.",
        "ua": "Ти смієшся голосно."
      },
      {
        "cz": "My se smějeme spolu.",
        "ua": "Ми сміємося разом."
      }
    ]
  },
  {
    "id": 69,
    "infinitive": "líbit se",
    "translation": "подобатися",
    "level": "A1",
    "conjugation": {
      "ja": "líbím se",
      "ty": "líbíš se",
      "on": "líbí se",
      "my": "líbíme se",
      "vy": "líbíte se",
      "oni": "líbí se"
    },
    "examples": [
      {
        "cz": "Praha se mi líbí.",
        "ua": "Прага мені подобається."
      },
      {
        "cz": "Ten film se ti líbí.",
        "ua": "Той фільм тобі подобається."
      },
      {
        "cz": "Česká hudba se nám líbí.",
        "ua": "Чеська музика нам подобається."
      }
    ]
  },
  {
    "id": 70,
    "infinitive": "milovat",
    "translation": "любити",
    "level": "A1",
    "conjugation": {
      "ja": "miluju",
      "ty": "miluješ",
      "on": "miluje",
      "my": "milujeme",
      "vy": "milujete",
      "oni": "milují"
    },
    "examples": [
      {
        "cz": "Já miluju čokoládu.",
        "ua": "Я люблю шоколад."
      },
      {
        "cz": "Ty miluješ hudbu.",
        "ua": "Ти любиш музику."
      },
      {
        "cz": "My milujeme cestování.",
        "ua": "Ми любимо подорожі."
      }
    ]
  },
  {
    "id": 71,
    "infinitive": "mít rád",
    "translation": "любити, подобатися",
    "level": "A1",
    "conjugation": {
      "ja": "mám rád",
      "ty": "máš rád",
      "on": "má rád",
      "my": "máme rádi",
      "vy": "máte rádi",
      "oni": "mají rádi"
    },
    "examples": [
      {
        "cz": "Já mám rád české jídlo.",
        "ua": "Я люблю чеську їжу."
      },
      {
        "cz": "Ty máš rád sport.",
        "ua": "Ти любиш спорт."
      },
      {
        "cz": "My máme rádi Prahu.",
        "ua": "Ми любимо Прагу."
      }
    ]
  },
  {
    "id": 72,
    "infinitive": "cestovat",
    "translation": "подорожувати",
    "level": "A1",
    "conjugation": {
      "ja": "cestuju",
      "ty": "cestuješ",
      "on": "cestuje",
      "my": "cestujeme",
      "vy": "cestujete",
      "oni": "cestují"
    },
    "examples": [
      {
        "cz": "Já cestuju vlakem.",
        "ua": "Я подорожую потягом."
      },
      {
        "cz": "Ty cestuješ po Evropě.",
        "ua": "Ти подорожуєш Європою."
      },
      {
        "cz": "My cestujeme v létě.",
        "ua": "Ми подорожуємо влітку."
      }
    ]
  },
  {
    "id": 73,
    "infinitive": "sportovat",
    "translation": "займатися спортом",
    "level": "A1",
    "conjugation": {
      "ja": "sportuju",
      "ty": "sportuješ",
      "on": "sportuje",
      "my": "sportujeme",
      "vy": "sportujete",
      "oni": "sportují"
    },
    "examples": [
      {
        "cz": "Já sportuju ráno.",
        "ua": "Я займаюся спортом вранці."
      },
      {
        "cz": "Ty sportuješ po práci.",
        "ua": "Ти займаєшся спортом після роботи."
      },
      {
        "cz": "My sportujeme v parku.",
        "ua": "Ми займаємося спортом у парку."
      }
    ]
  },
  {
    "id": 74,
    "infinitive": "hrát",
    "translation": "грати",
    "level": "A1",
    "conjugation": {
      "ja": "hraju",
      "ty": "hraješ",
      "on": "hraje",
      "my": "hrajeme",
      "vy": "hrajete",
      "oni": "hrají"
    },
    "examples": [
      {
        "cz": "Já hraju fotbal.",
        "ua": "Я граю у футбол."
      },
      {
        "cz": "Ty hraješ na kytaru.",
        "ua": "Ти граєш на гітарі."
      },
      {
        "cz": "My hrajeme karty.",
        "ua": "Ми граємо в карти."
      }
    ]
  },
  {
    "id": 75,
    "infinitive": "telefonovat",
    "translation": "телефонувати",
    "level": "A1",
    "conjugation": {
      "ja": "telefonuju",
      "ty": "telefonuješ",
      "on": "telefonuje",
      "my": "telefonujeme",
      "vy": "telefonujete",
      "oni": "telefonují"
    },
    "examples": [
      {
        "cz": "Já telefonuju babičce.",
        "ua": "Я телефоную бабусі."
      },
      {
        "cz": "Ty telefonuješ kamarádovi.",
        "ua": "Ти телефонуєш другові."
      },
      {
        "cz": "My telefonujeme domů.",
        "ua": "Ми телефонуємо додому."
      }
    ]
  },
  {
    "id": 76,
    "infinitive": "poslat",
    "translation": "надіслати",
    "level": "A1",
    "conjugation": {
      "ja": "pošlu",
      "ty": "pošleš",
      "on": "pošle",
      "my": "pošleme",
      "vy": "pošlete",
      "oni": "pošlou"
    },
    "examples": [
      {
        "cz": "Já pošlu zprávu.",
        "ua": "Я надішлю повідомлення."
      },
      {
        "cz": "Ty pošleš e-mail.",
        "ua": "Ти надішлеш електронного листа."
      },
      {
        "cz": "My pošleme balík.",
        "ua": "Ми надішлемо посилку."
      }
    ]
  },
  {
    "id": 77,
    "infinitive": "dostat",
    "translation": "отримати",
    "level": "A1",
    "conjugation": {
      "ja": "dostanu",
      "ty": "dostaneš",
      "on": "dostane",
      "my": "dostaneme",
      "vy": "dostanete",
      "oni": "dostanou"
    },
    "examples": [
      {
        "cz": "Já dostanu dopis.",
        "ua": "Я отримаю лист."
      },
      {
        "cz": "Ty dostaneš dárek.",
        "ua": "Ти отримаєш подарунок."
      },
      {
        "cz": "My dostaneme odpověď.",
        "ua": "Ми отримаємо відповідь."
      }
    ]
  },
  {
    "id": 78,
    "infinitive": "dávat",
    "translation": "давати",
    "level": "A1",
    "conjugation": {
      "ja": "dávám",
      "ty": "dáváš",
      "on": "dává",
      "my": "dáváme",
      "vy": "dáváte",
      "oni": "dávají"
    },
    "examples": [
      {
        "cz": "Já dávám dítěti vodu.",
        "ua": "Я даю дитині воду."
      },
      {
        "cz": "Ty dáváš otázku.",
        "ua": "Ти ставиш запитання."
      },
      {
        "cz": "My dáváme pozor.",
        "ua": "Ми уважні."
      }
    ]
  },
  {
    "id": 79,
    "infinitive": "ptát se",
    "translation": "питати",
    "level": "A1",
    "conjugation": {
      "ja": "ptám se",
      "ty": "ptáš se",
      "on": "ptá se",
      "my": "ptáme se",
      "vy": "ptáte se",
      "oni": "ptají se"
    },
    "examples": [
      {
        "cz": "Já se ptám učitele.",
        "ua": "Я питаю вчителя."
      },
      {
        "cz": "Ty se ptáš na cestu.",
        "ua": "Ти питаєш дорогу."
      },
      {
        "cz": "My se ptáme na cenu.",
        "ua": "Ми питаємо про ціну."
      }
    ]
  },
  {
    "id": 80,
    "infinitive": "odpovědět",
    "translation": "відповісти",
    "level": "A1",
    "conjugation": {
      "ja": "odpovím",
      "ty": "odpovíš",
      "on": "odpoví",
      "my": "odpovíme",
      "vy": "odpovíte",
      "oni": "odpoví"
    },
    "examples": [
      {
        "cz": "Já odpovím na otázku.",
        "ua": "Я відповім на запитання."
      },
      {
        "cz": "Ty odpovíš učiteli.",
        "ua": "Ти відповіси вчителю."
      },
      {
        "cz": "My odpovíme e-mailem.",
        "ua": "Ми відповімо електронним листом."
      }
    ]
  },
  {
    "id": 81,
    "infinitive": "ukázat",
    "translation": "показати",
    "level": "A1",
    "conjugation": {
      "ja": "ukážu",
      "ty": "ukážeš",
      "on": "ukáže",
      "my": "ukážeme",
      "vy": "ukážete",
      "oni": "ukážou"
    },
    "examples": [
      {
        "cz": "Já ukážu pas.",
        "ua": "Я покажу паспорт."
      },
      {
        "cz": "Ty ukážeš fotku.",
        "ua": "Ти покажеш фото."
      },
      {
        "cz": "My ukážeme cestu na mapě.",
        "ua": "Ми покажемо дорогу на мапі."
      }
    ]
  },
  {
    "id": 82,
    "infinitive": "vysvětlit",
    "translation": "пояснити",
    "level": "A2",
    "conjugation": {
      "ja": "vysvětlím",
      "ty": "vysvětlíš",
      "on": "vysvětlí",
      "my": "vysvětlíme",
      "vy": "vysvětlíte",
      "oni": "vysvětlí"
    },
    "examples": [
      {
        "cz": "Já vysvětlím pravidlo.",
        "ua": "Я поясню правило."
      },
      {
        "cz": "Ty vysvětlíš úkol.",
        "ua": "Ти поясниш завдання."
      },
      {
        "cz": "My vysvětlíme nový postup.",
        "ua": "Ми пояснимо новий порядок."
      }
    ]
  },
  {
    "id": 83,
    "infinitive": "opakovat",
    "translation": "повторювати",
    "level": "A1",
    "conjugation": {
      "ja": "opakuju",
      "ty": "opakuješ",
      "on": "opakuje",
      "my": "opakujeme",
      "vy": "opakujete",
      "oni": "opakují"
    },
    "examples": [
      {
        "cz": "Já opakuju slovíčka.",
        "ua": "Я повторюю слова."
      },
      {
        "cz": "Ty opakuješ větu.",
        "ua": "Ти повторюєш речення."
      },
      {
        "cz": "My opakujeme gramatiku.",
        "ua": "Ми повторюємо граматику."
      }
    ]
  },
  {
    "id": 84,
    "infinitive": "připravit",
    "translation": "підготувати",
    "level": "A2",
    "conjugation": {
      "ja": "připravím",
      "ty": "připravíš",
      "on": "připraví",
      "my": "připravíme",
      "vy": "připravíte",
      "oni": "připraví"
    },
    "examples": [
      {
        "cz": "Já připravím snídani.",
        "ua": "Я підготую сніданок."
      },
      {
        "cz": "Ty připravíš dokumenty.",
        "ua": "Ти підготуєш документи."
      },
      {
        "cz": "My připravíme pokoj pro hosta.",
        "ua": "Ми підготуємо кімнату для гостя."
      }
    ]
  },
  {
    "id": 85,
    "infinitive": "změnit",
    "translation": "змінити",
    "level": "A2",
    "conjugation": {
      "ja": "změním",
      "ty": "změníš",
      "on": "změní",
      "my": "změníme",
      "vy": "změníte",
      "oni": "změní"
    },
    "examples": [
      {
        "cz": "Já změním plán.",
        "ua": "Я зміню план."
      },
      {
        "cz": "Ty změníš heslo.",
        "ua": "Ти зміниш пароль."
      },
      {
        "cz": "My změníme čas schůzky.",
        "ua": "Ми змінимо час зустрічі."
      }
    ]
  },
  {
    "id": 86,
    "infinitive": "stát se",
    "translation": "статися",
    "level": "A2",
    "conjugation": {
      "ja": "stanu se",
      "ty": "staneš se",
      "on": "stane se",
      "my": "staneme se",
      "vy": "stanete se",
      "oni": "stanou se"
    },
    "examples": [
      {
        "cz": "Já se stanu učitelem.",
        "ua": "Я стану вчителем."
      },
      {
        "cz": "Ty se staneš členem týmu.",
        "ua": "Ти станеш членом команди."
      },
      {
        "cz": "My se staneme přáteli.",
        "ua": "Ми станемо друзями."
      }
    ]
  },
  {
    "id": 87,
    "infinitive": "trvat",
    "translation": "тривати",
    "level": "A2",
    "conjugation": {
      "ja": "trvám",
      "ty": "trváš",
      "on": "trvá",
      "my": "trváme",
      "vy": "trváte",
      "oni": "trvají"
    },
    "examples": [
      {
        "cz": "Já trvám na svém rozhodnutí.",
        "ua": "Я наполягаю на своєму рішенні."
      },
      {
        "cz": "Ty trváš na odpovědi.",
        "ua": "Ти наполягаєш на відповіді."
      },
      {
        "cz": "Cesta trvá dvacet minut.",
        "ua": "Дорога триває двадцять хвилин."
      }
    ]
  },
  {
    "id": 88,
    "infinitive": "znamenat",
    "translation": "означати",
    "level": "A2",
    "conjugation": {
      "ja": "znamenám",
      "ty": "znamenáš",
      "on": "znamená",
      "my": "znamenáme",
      "vy": "znamenáte",
      "oni": "znamenají"
    },
    "examples": [
      {
        "cz": "To slovo znamená domov.",
        "ua": "Це слово означає дім."
      },
      {
        "cz": "Ten znak znamená zákaz.",
        "ua": "Цей знак означає заборону."
      },
      {
        "cz": "Ty pro mě znamenáš hodně.",
        "ua": "Ти багато для мене означаєш."
      }
    ]
  },
  {
    "id": 89,
    "infinitive": "vypadat",
    "translation": "виглядати",
    "level": "A1",
    "conjugation": {
      "ja": "vypadám",
      "ty": "vypadáš",
      "on": "vypadá",
      "my": "vypadáme",
      "vy": "vypadáte",
      "oni": "vypadají"
    },
    "examples": [
      {
        "cz": "Já vypadám unaveně.",
        "ua": "Я виглядаю втомлено."
      },
      {
        "cz": "Ty vypadáš spokojeně.",
        "ua": "Ти виглядаєш задоволено."
      },
      {
        "cz": "My vypadáme dobře.",
        "ua": "Ми виглядаємо добре."
      }
    ]
  },
  {
    "id": 90,
    "infinitive": "potkat",
    "translation": "зустріти",
    "level": "A1",
    "conjugation": {
      "ja": "potkám",
      "ty": "potkáš",
      "on": "potká",
      "my": "potkáme",
      "vy": "potkáte",
      "oni": "potkají"
    },
    "examples": [
      {
        "cz": "Já potkám kamaráda.",
        "ua": "Я зустріну друга."
      },
      {
        "cz": "Ty potkáš sousedku.",
        "ua": "Ти зустрінеш сусідку."
      },
      {
        "cz": "My potkáme učitele ve městě.",
        "ua": "Ми зустрінемо вчителя в місті."
      }
    ]
  },
  {
    "id": 91,
    "infinitive": "navštívit",
    "translation": "відвідати",
    "level": "A2",
    "conjugation": {
      "ja": "navštívím",
      "ty": "navštívíš",
      "on": "navštíví",
      "my": "navštívíme",
      "vy": "navštívíte",
      "oni": "navštíví"
    },
    "examples": [
      {
        "cz": "Já navštívím muzeum.",
        "ua": "Я відвідаю музей."
      },
      {
        "cz": "Ty navštívíš babičku.",
        "ua": "Ти відвідаєш бабусю."
      },
      {
        "cz": "My navštívíme české město.",
        "ua": "Ми відвідаємо чеське місто."
      }
    ]
  },
  {
    "id": 92,
    "infinitive": "vybrat",
    "translation": "вибрати",
    "level": "A1",
    "conjugation": {
      "ja": "vyberu",
      "ty": "vybereš",
      "on": "vybere",
      "my": "vybereme",
      "vy": "vyberete",
      "oni": "vyberou"
    },
    "examples": [
      {
        "cz": "Já vyberu správnou odpověď.",
        "ua": "Я виберу правильну відповідь."
      },
      {
        "cz": "Ty vybereš nový kurz.",
        "ua": "Ти вибереш новий курс."
      },
      {
        "cz": "My vybereme levný hotel.",
        "ua": "Ми виберемо недорогий готель."
      }
    ]
  },
  {
    "id": 93,
    "infinitive": "zapnout",
    "translation": "увімкнути",
    "level": "A2",
    "conjugation": {
      "ja": "zapnu",
      "ty": "zapneš",
      "on": "zapne",
      "my": "zapneme",
      "vy": "zapnete",
      "oni": "zapnou"
    },
    "examples": [
      {
        "cz": "Já zapnu počítač.",
        "ua": "Я увімкну комп'ютер."
      },
      {
        "cz": "Ty zapneš světlo.",
        "ua": "Ти увімкнеш світло."
      },
      {
        "cz": "My zapneme topení.",
        "ua": "Ми увімкнемо опалення."
      }
    ]
  },
  {
    "id": 94,
    "infinitive": "vypnout",
    "translation": "вимкнути",
    "level": "A2",
    "conjugation": {
      "ja": "vypnu",
      "ty": "vypneš",
      "on": "vypne",
      "my": "vypneme",
      "vy": "vypnete",
      "oni": "vypnou"
    },
    "examples": [
      {
        "cz": "Já vypnu telefon.",
        "ua": "Я вимкну телефон."
      },
      {
        "cz": "Ty vypneš počítač.",
        "ua": "Ти вимкнеш комп'ютер."
      },
      {
        "cz": "My vypneme světlo.",
        "ua": "Ми вимкнемо світло."
      }
    ]
  },
  {
    "id": 95,
    "infinitive": "opravit",
    "translation": "полагодити, виправити",
    "level": "A2",
    "conjugation": {
      "ja": "opravím",
      "ty": "opravíš",
      "on": "opraví",
      "my": "opravíme",
      "vy": "opravíte",
      "oni": "opraví"
    },
    "examples": [
      {
        "cz": "Já opravím kolo.",
        "ua": "Я полагоджу велосипед."
      },
      {
        "cz": "Ty opravíš chybu.",
        "ua": "Ти виправиш помилку."
      },
      {
        "cz": "My opravíme starý stůl.",
        "ua": "Ми полагодимо старий стіл."
      }
    ]
  },
  {
    "id": 96,
    "infinitive": "čistit",
    "translation": "чистити",
    "level": "A2",
    "conjugation": {
      "ja": "čistím",
      "ty": "čistíš",
      "on": "čistí",
      "my": "čistíme",
      "vy": "čistíte",
      "oni": "čistí"
    },
    "examples": [
      {
        "cz": "Já čistím zuby.",
        "ua": "Я чищу зуби."
      },
      {
        "cz": "Ty čistíš okno.",
        "ua": "Ти чистиш вікно."
      },
      {
        "cz": "My čistíme kuchyň.",
        "ua": "Ми чистимо кухню."
      }
    ]
  },
  {
    "id": 97,
    "infinitive": "zkusit",
    "translation": "спробувати",
    "level": "A1",
    "conjugation": {
      "ja": "zkusím",
      "ty": "zkusíš",
      "on": "zkusí",
      "my": "zkusíme",
      "vy": "zkusíte",
      "oni": "zkusí"
    },
    "examples": [
      {
        "cz": "Já zkusím nové jídlo.",
        "ua": "Я спробую нову страву."
      },
      {
        "cz": "Ty zkusíš mluvit česky.",
        "ua": "Ти спробуєш говорити чеською."
      },
      {
        "cz": "My zkusíme další cvičení.",
        "ua": "Ми спробуємо наступну вправу."
      }
    ]
  },
  {
    "id": 98,
    "infinitive": "narodit se",
    "translation": "народитися",
    "level": "A2",
    "conjugation": {
      "ja": "narodím se",
      "ty": "narodíš se",
      "on": "narodí se",
      "my": "narodíme se",
      "vy": "narodíte se",
      "oni": "narodí se"
    },
    "examples": [
      {
        "cz": "Já se narodím v malém městě.",
        "ua": "Я народжуся в маленькому місті."
      },
      {
        "cz": "Dítě se narodí v létě.",
        "ua": "Дитина народиться влітку."
      },
      {
        "cz": "Dvojčata se narodí v nemocnici.",
        "ua": "Близнюки народяться у лікарні."
      }
    ]
  },
  {
    "id": 99,
    "infinitive": "umřít",
    "translation": "померти",
    "level": "A2",
    "conjugation": {
      "ja": "umřu",
      "ty": "umřeš",
      "on": "umře",
      "my": "umřeme",
      "vy": "umřete",
      "oni": "umřou"
    },
    "examples": [
      {
        "cz": "Starý strom umře bez vody.",
        "ua": "Старе дерево помре без води."
      },
      {
        "cz": "Rostlina umře v mrazu.",
        "ua": "Рослина помре на морозі."
      },
      {
        "cz": "Ryba umře bez vody.",
        "ua": "Риба помре без води."
      }
    ]
  },
  {
    "id": 100,
    "infinitive": "jet",
    "translation": "їхати транспортом",
    "level": "A2",
    "conjugation": {
      "ja": "jedu",
      "ty": "jedeš",
      "on": "jede",
      "my": "jedeme",
      "vy": "jedete",
      "oni": "jedou"
    },
    "examples": [
      {
        "cz": "Já jedu metrem do centra.",
        "ua": "Я їду метро до центру."
      },
      {
        "cz": "Ty jedeš autem na nákup.",
        "ua": "Ти їдеш автомобілем за покупками."
      },
      {
        "cz": "My jedeme tramvají na náměstí.",
        "ua": "Ми їдемо трамваєм на площу."
      }
    ]
  }
] satisfies Array<Omit<Verb, "exercises">>;

const verbsWithExamples: VerbSeed[] = verbBase.map((verb) => ({
  ...verb,
  examples: buildExamples(verb),
}));

export const verbs: Verb[] = verbsWithExamples.map((verb) => ({
  ...verb,
  exercises: buildExercises(verb, verbBase),
}));
