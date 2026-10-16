export interface Phrase {
  cz: string;
  ua: string;
}

export interface PhraseGroup {
  id: string;
  title: string;
  phrases: Phrase[];
}

export const phraseGroups: PhraseGroup[] = [
  {
    id: "greetings",
    title: "Вітання й прощання",
    phrases: [
      { cz: "Dobrý den.", ua: "Добрий день. (ввічливо, вдень)" },
      { cz: "Dobré ráno.", ua: "Доброго ранку." },
      { cz: "Dobrý večer.", ua: "Добрий вечір." },
      { cz: "Ahoj!", ua: "Привіт! / Бувай! (неформально, серед друзів)" },
      { cz: "Na shledanou.", ua: "До побачення. (ввічливо)" },
      { cz: "Dobrou noc.", ua: "На добраніч." },
    ],
  },
  {
    id: "polite",
    title: "Ввічливість",
    phrases: [
      { cz: "Děkuji.", ua: "Дякую." },
      { cz: "Prosím.", ua: "Будь ласка. (також «слухаю вас» чи «прошу», коли вас кличуть: «Prosím?»)" },
      { cz: "Není zač.", ua: "Нема за що." },
      { cz: "Promiňte.", ua: "Перепрошую. (щоб привернути увагу чи пройти)" },
      { cz: "Omlouvám se.", ua: "Прошу вибачення." },
    ],
  },
  {
    id: "understand",
    title: "Коли щось незрозуміло",
    phrases: [
      { cz: "Nerozumím.", ua: "Я не розумію." },
      { cz: "Mluvíte anglicky?", ua: "Ви говорите англійською?" },
      { cz: "Mluvíte ukrajinsky?", ua: "Ви говорите українською?" },
      { cz: "Můžete mluvit pomaleji?", ua: "Чи не могли б ви говорити повільніше?" },
      { cz: "Můžete to zopakovat?", ua: "Чи не могли б ви це повторити?" },
      { cz: "Co to znamená?", ua: "Що це означає?" },
      { cz: "Jak se to řekne česky?", ua: "Як це буде чеською?" },
    ],
  },
  {
    id: "meeting",
    title: "Знайомство",
    phrases: [
      { cz: "Jak se jmenujete?", ua: "Як вас звати?" },
      { cz: "Jmenuji se Olena.", ua: "Мене звати Олена." },
      { cz: "Těší mě.", ua: "Приємно познайомитися." },
      { cz: "Jsem z Ukrajiny.", ua: "Я з України." },
      { cz: "Jak se máte?", ua: "Як ви поживаєте?" },
      { cz: "Mám se dobře, děkuji.", ua: "У мене все добре, дякую." },
      { cz: "Učím se česky.", ua: "Я вчу чеську." },
    ],
  },
  {
    id: "shop",
    title: "Кафе й магазин",
    phrases: [
      { cz: "Dám si kávu.", ua: "Я візьму каву." },
      { cz: "Jedno pivo, prosím.", ua: "Одне пиво, будь ласка." },
      { cz: "Účet, prosím.", ua: "Рахунок, будь ласка." },
      { cz: "Kolik to stojí?", ua: "Скільки це коштує?" },
      { cz: "Platím kartou.", ua: "Я плачу карткою." },
      { cz: "Potřebujete tašku?", ua: "Вам потрібен пакет? (питає касир)" },
    ],
  },
  {
    id: "city",
    title: "У місті",
    phrases: [
      { cz: "Kde je toaleta?", ua: "Де туалет?" },
      { cz: "Kde je nádraží?", ua: "Де вокзал?" },
      { cz: "Jednu jízdenku, prosím.", ua: "Один квиток, будь ласка." },
      { cz: "Kdy jede další vlak?", ua: "Коли їде наступний потяг?" },
      { cz: "Jedu do Prahy.", ua: "Я їду до Праги." },
    ],
  },
  {
    id: "help",
    title: "Допомога",
    phrases: [
      { cz: "Potřebuji pomoc.", ua: "Мені потрібна допомога." },
      { cz: "Potřebuji lékaře.", ua: "Мені потрібен лікар." },
      { cz: "Bolí mě hlava.", ua: "У мене болить голова." },
      { cz: "Zavolejte záchranku!", ua: "Викличте швидку!" },
    ],
  },
];

export const emergencyNote = "Загальний номер екстрених служб у Чехії та всьому ЄС: 112. Також працюють 150 (пожежники), 155 (швидка), 158 (поліція).";
