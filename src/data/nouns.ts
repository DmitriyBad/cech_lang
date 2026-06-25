import type { Exercise } from "../types/Verb";
import type { CzechCaseKey, Noun, NounCaseForms } from "../types/Noun";

type NounSeed = {
  noun: string;
  translation: string;
  gender: Noun["gender"];
  paradigm: "animateHard" | "animateSoft" | "animateA" | "inanimateHard" | "inanimateSoft" | "feminineA" | "feminineE" | "neuterO" | "neuterI" | "neuterE" | "neuterUm";
  stem: string;
  locativeSingular: string;
  nominativePlural: string;
  level: "A1" | "A2";
};

export const caseInfo: Array<{ key: CzechCaseKey; title: string; question: string; hint: string }> = [
  { key: "nominative", title: "1. nominativ", question: "UA: хто? що? · CZ: kdo? co?", hint: "основна форма: To je..." },
  { key: "genitive", title: "2. genitiv", question: "UA: кого? чого? · CZ: koho? čeho?", hint: "bez, do, od" },
  { key: "dative", title: "3. dativ", question: "UA: кому? чому? · CZ: komu? čemu?", hint: "k, díky" },
  { key: "accusative", title: "4. akuzativ", question: "UA: кого? що? · CZ: koho? co?", hint: "бачу, маю, напрям" },
  { key: "vocative", title: "5. vokativ", question: "UA: звертання · CZ: oslovení", hint: "Ahoj..." },
  { key: "locative", title: "6. lokál", question: "UA: де? про кого? · CZ: kde? o kom? o čem?", hint: "v, na, o" },
  { key: "instrumental", title: "7. instrumentál", question: "UA: ким? чим? · CZ: kým? čím?", hint: "s, před, za" },
];

const nounSeeds: NounSeed[] = [
  {
    "noun": "student",
    "translation": "студент",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "student",
    "locativeSingular": "studentovi",
    "nominativePlural": "studenti",
    "level": "A1"
  },
  {
    "noun": "kamarád",
    "translation": "друг",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "kamarád",
    "locativeSingular": "kamarádovi",
    "nominativePlural": "kamarádi",
    "level": "A1"
  },
  {
    "noun": "soused",
    "translation": "сусід",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "soused",
    "locativeSingular": "sousedovi",
    "nominativePlural": "sousedé",
    "level": "A1"
  },
  {
    "noun": "doktor",
    "translation": "лікар",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "doktor",
    "locativeSingular": "doktorovi",
    "nominativePlural": "doktoři",
    "level": "A1"
  },
  {
    "noun": "bratr",
    "translation": "брат",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "bratr",
    "locativeSingular": "bratrovi",
    "nominativePlural": "bratři",
    "level": "A1"
  },
  {
    "noun": "syn",
    "translation": "син",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "syn",
    "locativeSingular": "synovi",
    "nominativePlural": "synové",
    "level": "A1"
  },
  {
    "noun": "kolega",
    "translation": "колега",
    "gender": "masculine",
    "paradigm": "animateA",
    "stem": "kolega",
    "locativeSingular": "kolegovi",
    "nominativePlural": "kolegové",
    "level": "A2"
  },
  {
    "noun": "turista",
    "translation": "турист",
    "gender": "masculine",
    "paradigm": "animateA",
    "stem": "turista",
    "locativeSingular": "turistovi",
    "nominativePlural": "turisté",
    "level": "A1"
  },
  {
    "noun": "řidič",
    "translation": "водій",
    "gender": "masculine",
    "paradigm": "animateSoft",
    "stem": "řidič",
    "locativeSingular": "řidiči",
    "nominativePlural": "řidiči",
    "level": "A1"
  },
  {
    "noun": "prodavač",
    "translation": "продавець",
    "gender": "masculine",
    "paradigm": "animateSoft",
    "stem": "prodavač",
    "locativeSingular": "prodavači",
    "nominativePlural": "prodavači",
    "level": "A1"
  },
  {
    "noun": "učitel",
    "translation": "вчитель",
    "gender": "masculine",
    "paradigm": "animateSoft",
    "stem": "učitel",
    "locativeSingular": "učiteli",
    "nominativePlural": "učitelé",
    "level": "A1"
  },
  {
    "noun": "číšník",
    "translation": "офіціант",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "číšník",
    "locativeSingular": "číšníkovi",
    "nominativePlural": "číšníci",
    "level": "A1"
  },
  {
    "noun": "programátor",
    "translation": "програміст",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "programátor",
    "locativeSingular": "programátorovi",
    "nominativePlural": "programátoři",
    "level": "A2"
  },
  {
    "noun": "pracovník",
    "translation": "працівник",
    "gender": "masculine",
    "paradigm": "animateHard",
    "stem": "pracovník",
    "locativeSingular": "pracovníkovi",
    "nominativePlural": "pracovníci",
    "level": "A2"
  },
  {
    "noun": "muž",
    "translation": "чоловік",
    "gender": "masculine",
    "paradigm": "animateSoft",
    "stem": "muž",
    "locativeSingular": "muži",
    "nominativePlural": "muži",
    "level": "A1"
  },
  {
    "noun": "obchod",
    "translation": "магазин",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "obchod",
    "locativeSingular": "obchodu",
    "nominativePlural": "obchody",
    "level": "A1"
  },
  {
    "noun": "park",
    "translation": "парк",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "park",
    "locativeSingular": "parku",
    "nominativePlural": "parky",
    "level": "A1"
  },
  {
    "noun": "autobus",
    "translation": "автобус",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "autobus",
    "locativeSingular": "autobusu",
    "nominativePlural": "autobusy",
    "level": "A1"
  },
  {
    "noun": "vlak",
    "translation": "потяг",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "vlak",
    "locativeSingular": "vlaku",
    "nominativePlural": "vlaky",
    "level": "A1"
  },
  {
    "noun": "telefon",
    "translation": "телефон",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "telefon",
    "locativeSingular": "telefonu",
    "nominativePlural": "telefony",
    "level": "A1"
  },
  {
    "noun": "počítač",
    "translation": "комп'ютер",
    "gender": "masculine",
    "paradigm": "inanimateSoft",
    "stem": "počítač",
    "locativeSingular": "počítači",
    "nominativePlural": "počítače",
    "level": "A1"
  },
  {
    "noun": "hotel",
    "translation": "готель",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "hotel",
    "locativeSingular": "hotelu",
    "nominativePlural": "hotely",
    "level": "A1"
  },
  {
    "noun": "pokoj",
    "translation": "кімната",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "pokoj",
    "locativeSingular": "pokoji",
    "nominativePlural": "pokoje",
    "level": "A1"
  },
  {
    "noun": "kurz",
    "translation": "курс",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "kurz",
    "locativeSingular": "kurzu",
    "nominativePlural": "kurzy",
    "level": "A1"
  },
  {
    "noun": "jazyk",
    "translation": "мова",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "jazyk",
    "locativeSingular": "jazyku",
    "nominativePlural": "jazyky",
    "level": "A1"
  },
  {
    "noun": "sešit",
    "translation": "зошит",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "sešit",
    "locativeSingular": "sešitu",
    "nominativePlural": "sešity",
    "level": "A1"
  },
  {
    "noun": "lístek",
    "translation": "квиток",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "lístk",
    "locativeSingular": "lístku",
    "nominativePlural": "lístky",
    "level": "A1"
  },
  {
    "noun": "klíč",
    "translation": "ключ",
    "gender": "masculine",
    "paradigm": "inanimateSoft",
    "stem": "klíč",
    "locativeSingular": "klíči",
    "nominativePlural": "klíče",
    "level": "A1"
  },
  {
    "noun": "batoh",
    "translation": "рюкзак",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "batoh",
    "locativeSingular": "batohu",
    "nominativePlural": "batohy",
    "level": "A1"
  },
  {
    "noun": "kufr",
    "translation": "валіза",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "kufr",
    "locativeSingular": "kufru",
    "nominativePlural": "kufry",
    "level": "A1"
  },
  {
    "noun": "film",
    "translation": "фільм",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "film",
    "locativeSingular": "filmu",
    "nominativePlural": "filmy",
    "level": "A1"
  },
  {
    "noun": "dopis",
    "translation": "лист",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "dopis",
    "locativeSingular": "dopisu",
    "nominativePlural": "dopisy",
    "level": "A1"
  },
  {
    "noun": "problém",
    "translation": "проблема",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "problém",
    "locativeSingular": "problému",
    "nominativePlural": "problémy",
    "level": "A1"
  },
  {
    "noun": "plán",
    "translation": "план",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "plán",
    "locativeSingular": "plánu",
    "nominativePlural": "plány",
    "level": "A1"
  },
  {
    "noun": "čas",
    "translation": "час",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "čas",
    "locativeSingular": "času",
    "nominativePlural": "časy",
    "level": "A1"
  },
  {
    "noun": "rok",
    "translation": "рік",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "rok",
    "locativeSingular": "roku",
    "nominativePlural": "roky",
    "level": "A1"
  },
  {
    "noun": "měsíc",
    "translation": "місяць",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "měsíc",
    "locativeSingular": "měsíci",
    "nominativePlural": "měsíce",
    "level": "A1"
  },
  {
    "noun": "obrázek",
    "translation": "картинка",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "obrázk",
    "locativeSingular": "obrázku",
    "nominativePlural": "obrázky",
    "level": "A1"
  },
  {
    "noun": "dárek",
    "translation": "подарунок",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "dárk",
    "locativeSingular": "dárku",
    "nominativePlural": "dárky",
    "level": "A1"
  },
  {
    "noun": "účet",
    "translation": "рахунок",
    "gender": "masculine",
    "paradigm": "inanimateHard",
    "stem": "účet",
    "locativeSingular": "účtu",
    "nominativePlural": "účty",
    "level": "A1"
  },
  {
    "noun": "škola",
    "translation": "школа",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "škol",
    "locativeSingular": "škole",
    "nominativePlural": "školy",
    "level": "A1"
  },
  {
    "noun": "rodina",
    "translation": "родина",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "rodin",
    "locativeSingular": "rodině",
    "nominativePlural": "rodiny",
    "level": "A1"
  },
  {
    "noun": "voda",
    "translation": "вода",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "vod",
    "locativeSingular": "vodě",
    "nominativePlural": "vody",
    "level": "A1"
  },
  {
    "noun": "káva",
    "translation": "кава",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "káv",
    "locativeSingular": "kávě",
    "nominativePlural": "kávy",
    "level": "A1"
  },
  {
    "noun": "kniha",
    "translation": "книжка",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "knih",
    "locativeSingular": "knize",
    "nominativePlural": "knihy",
    "level": "A1"
  },
  {
    "noun": "taška",
    "translation": "сумка",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "tašk",
    "locativeSingular": "tašce",
    "nominativePlural": "tašky",
    "level": "A1"
  },
  {
    "noun": "otázka",
    "translation": "запитання",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "otázk",
    "locativeSingular": "otázce",
    "nominativePlural": "otázky",
    "level": "A1"
  },
  {
    "noun": "žena",
    "translation": "жінка",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "žen",
    "locativeSingular": "ženě",
    "nominativePlural": "ženy",
    "level": "A1"
  },
  {
    "noun": "mapa",
    "translation": "мапа",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "map",
    "locativeSingular": "mapě",
    "nominativePlural": "mapy",
    "level": "A1"
  },
  {
    "noun": "kavárna",
    "translation": "кав'ярня",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "kavárn",
    "locativeSingular": "kavárně",
    "nominativePlural": "kavárny",
    "level": "A1"
  },
  {
    "noun": "zastávka",
    "translation": "зупинка",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "zastávk",
    "locativeSingular": "zastávce",
    "nominativePlural": "zastávky",
    "level": "A1"
  },
  {
    "noun": "banka",
    "translation": "банк",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "bank",
    "locativeSingular": "bance",
    "nominativePlural": "banky",
    "level": "A1"
  },
  {
    "noun": "pošta",
    "translation": "пошта",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "pošt",
    "locativeSingular": "poště",
    "nominativePlural": "pošty",
    "level": "A1"
  },
  {
    "noun": "lékárna",
    "translation": "аптека",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "lékárn",
    "locativeSingular": "lékárně",
    "nominativePlural": "lékárny",
    "level": "A1"
  },
  {
    "noun": "koupelna",
    "translation": "ванна кімната",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "koupeln",
    "locativeSingular": "koupelně",
    "nominativePlural": "koupelny",
    "level": "A1"
  },
  {
    "noun": "hodina",
    "translation": "година, урок",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "hodin",
    "locativeSingular": "hodině",
    "nominativePlural": "hodiny",
    "level": "A1"
  },
  {
    "noun": "minuta",
    "translation": "хвилина",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "minut",
    "locativeSingular": "minutě",
    "nominativePlural": "minuty",
    "level": "A1"
  },
  {
    "noun": "koruna",
    "translation": "крона",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "korun",
    "locativeSingular": "koruně",
    "nominativePlural": "koruny",
    "level": "A1"
  },
  {
    "noun": "karta",
    "translation": "картка",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "kart",
    "locativeSingular": "kartě",
    "nominativePlural": "karty",
    "level": "A1"
  },
  {
    "noun": "cena",
    "translation": "ціна",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "cen",
    "locativeSingular": "ceně",
    "nominativePlural": "ceny",
    "level": "A1"
  },
  {
    "noun": "cesta",
    "translation": "дорога, подорож",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "cest",
    "locativeSingular": "cestě",
    "nominativePlural": "cesty",
    "level": "A1"
  },
  {
    "noun": "chyba",
    "translation": "помилка",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "chyb",
    "locativeSingular": "chybě",
    "nominativePlural": "chyby",
    "level": "A1"
  },
  {
    "noun": "zpráva",
    "translation": "повідомлення",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "zpráv",
    "locativeSingular": "zprávě",
    "nominativePlural": "zprávy",
    "level": "A1"
  },
  {
    "noun": "adresa",
    "translation": "адреса",
    "gender": "feminine",
    "paradigm": "feminineA",
    "stem": "adres",
    "locativeSingular": "adrese",
    "nominativePlural": "adresy",
    "level": "A1"
  },
  {
    "noun": "práce",
    "translation": "робота",
    "gender": "feminine",
    "paradigm": "feminineE",
    "stem": "prác",
    "locativeSingular": "práci",
    "nominativePlural": "práce",
    "level": "A1"
  },
  {
    "noun": "ulice",
    "translation": "вулиця",
    "gender": "feminine",
    "paradigm": "feminineE",
    "stem": "ulic",
    "locativeSingular": "ulici",
    "nominativePlural": "ulice",
    "level": "A1"
  },
  {
    "noun": "restaurace",
    "translation": "ресторан",
    "gender": "feminine",
    "paradigm": "feminineE",
    "stem": "restaurac",
    "locativeSingular": "restauraci",
    "nominativePlural": "restaurace",
    "level": "A1"
  },
  {
    "noun": "lekce",
    "translation": "урок",
    "gender": "feminine",
    "paradigm": "feminineE",
    "stem": "lekc",
    "locativeSingular": "lekci",
    "nominativePlural": "lekce",
    "level": "A1"
  },
  {
    "noun": "nemocnice",
    "translation": "лікарня",
    "gender": "feminine",
    "paradigm": "feminineE",
    "stem": "nemocnic",
    "locativeSingular": "nemocnici",
    "nominativePlural": "nemocnice",
    "level": "A1"
  },
  {
    "noun": "kuchyně",
    "translation": "кухня",
    "gender": "feminine",
    "paradigm": "feminineE",
    "stem": "kuchyn",
    "locativeSingular": "kuchyni",
    "nominativePlural": "kuchyně",
    "level": "A1"
  },
  {
    "noun": "fotografie",
    "translation": "фотографія",
    "gender": "feminine",
    "paradigm": "feminineE",
    "stem": "fotografi",
    "locativeSingular": "fotografii",
    "nominativePlural": "fotografie",
    "level": "A2"
  },
  {
    "noun": "informace",
    "translation": "інформація",
    "gender": "feminine",
    "paradigm": "feminineE",
    "stem": "informac",
    "locativeSingular": "informaci",
    "nominativePlural": "informace",
    "level": "A2"
  },
  {
    "noun": "město",
    "translation": "місто",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "měst",
    "locativeSingular": "městě",
    "nominativePlural": "města",
    "level": "A1"
  },
  {
    "noun": "jídlo",
    "translation": "їжа, страва",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "jídl",
    "locativeSingular": "jídle",
    "nominativePlural": "jídla",
    "level": "A1"
  },
  {
    "noun": "auto",
    "translation": "авто",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "aut",
    "locativeSingular": "autě",
    "nominativePlural": "auta",
    "level": "A1"
  },
  {
    "noun": "slovo",
    "translation": "слово",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "slov",
    "locativeSingular": "slově",
    "nominativePlural": "slova",
    "level": "A1"
  },
  {
    "noun": "okno",
    "translation": "вікно",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "okn",
    "locativeSingular": "okně",
    "nominativePlural": "okna",
    "level": "A1"
  },
  {
    "noun": "ráno",
    "translation": "ранок",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "rán",
    "locativeSingular": "ránu",
    "nominativePlural": "rána",
    "level": "A1"
  },
  {
    "noun": "číslo",
    "translation": "число, номер",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "čísl",
    "locativeSingular": "čísle",
    "nominativePlural": "čísla",
    "level": "A1"
  },
  {
    "noun": "kolo",
    "translation": "велосипед, колесо",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "kol",
    "locativeSingular": "kole",
    "nominativePlural": "kola",
    "level": "A1"
  },
  {
    "noun": "místo",
    "translation": "місце",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "míst",
    "locativeSingular": "místě",
    "nominativePlural": "místa",
    "level": "A1"
  },
  {
    "noun": "letadlo",
    "translation": "літак",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "letadl",
    "locativeSingular": "letadle",
    "nominativePlural": "letadla",
    "level": "A1"
  },
  {
    "noun": "nádraží",
    "translation": "вокзал",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "nádraž",
    "locativeSingular": "nádraží",
    "nominativePlural": "nádraží",
    "level": "A1"
  },
  {
    "noun": "cvičení",
    "translation": "вправа",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "cvičen",
    "locativeSingular": "cvičení",
    "nominativePlural": "cvičení",
    "level": "A1"
  },
  {
    "noun": "učení",
    "translation": "навчання",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "učen",
    "locativeSingular": "učení",
    "nominativePlural": "učení",
    "level": "A1"
  },
  {
    "noun": "setkání",
    "translation": "зустріч",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "setkán",
    "locativeSingular": "setkání",
    "nominativePlural": "setkání",
    "level": "A2"
  },
  {
    "noun": "náměstí",
    "translation": "площа",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "náměst",
    "locativeSingular": "náměstí",
    "nominativePlural": "náměstí",
    "level": "A1"
  },
  {
    "noun": "zaměstnání",
    "translation": "робота, зайнятість",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "zaměstnán",
    "locativeSingular": "zaměstnání",
    "nominativePlural": "zaměstnání",
    "level": "A2"
  },
  {
    "noun": "bydlení",
    "translation": "житло, проживання",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "bydlen",
    "locativeSingular": "bydlení",
    "nominativePlural": "bydlení",
    "level": "A2"
  },
  {
    "noun": "parkoviště",
    "translation": "парковка",
    "gender": "neuter",
    "paradigm": "neuterE",
    "stem": "parkovišt",
    "locativeSingular": "parkovišti",
    "nominativePlural": "parkoviště",
    "level": "A2"
  },
  {
    "noun": "letiště",
    "translation": "аеропорт",
    "gender": "neuter",
    "paradigm": "neuterE",
    "stem": "letišt",
    "locativeSingular": "letišti",
    "nominativePlural": "letiště",
    "level": "A1"
  },
  {
    "noun": "moře",
    "translation": "море",
    "gender": "neuter",
    "paradigm": "neuterE",
    "stem": "moř",
    "locativeSingular": "moři",
    "nominativePlural": "moře",
    "level": "A2"
  },
  {
    "noun": "ovoce",
    "translation": "фрукти",
    "gender": "neuter",
    "paradigm": "neuterE",
    "stem": "ovoc",
    "locativeSingular": "ovoci",
    "nominativePlural": "ovoce",
    "level": "A1"
  },
  {
    "noun": "srdce",
    "translation": "серце",
    "gender": "neuter",
    "paradigm": "neuterE",
    "stem": "srdc",
    "locativeSingular": "srdci",
    "nominativePlural": "srdce",
    "level": "A2"
  },
  {
    "noun": "nádobí",
    "translation": "посуд",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "nádob",
    "locativeSingular": "nádobí",
    "nominativePlural": "nádobí",
    "level": "A2"
  },
  {
    "noun": "oblečení",
    "translation": "одяг",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "oblečen",
    "locativeSingular": "oblečení",
    "nominativePlural": "oblečení",
    "level": "A1"
  },
  {
    "noun": "zboží",
    "translation": "товар",
    "gender": "neuter",
    "paradigm": "neuterI",
    "stem": "zbož",
    "locativeSingular": "zboží",
    "nominativePlural": "zboží",
    "level": "A2"
  },
  {
    "noun": "divadlo",
    "translation": "театр",
    "gender": "neuter",
    "paradigm": "neuterO",
    "stem": "divadl",
    "locativeSingular": "divadle",
    "nominativePlural": "divadla",
    "level": "A1"
  },
  {
    "noun": "hřiště",
    "translation": "майданчик, поле",
    "gender": "neuter",
    "paradigm": "neuterE",
    "stem": "hřišt",
    "locativeSingular": "hřišti",
    "nominativePlural": "hřiště",
    "level": "A1"
  },
  {
    "noun": "centrum",
    "translation": "центр",
    "gender": "neuter",
    "paradigm": "neuterUm",
    "stem": "centr",
    "locativeSingular": "centru",
    "nominativePlural": "centra",
    "level": "A1"
  }
];

const withOptions = (correctAnswer: string, options: string[]) =>
  Array.from(new Set([correctAnswer, ...options.filter((option) => option !== correctAnswer)])).slice(0, 3);

const hardPluralGenitive = (seed: NounSeed) => seed.stem + "ů";

const decline = (seed: NounSeed): { singular: NounCaseForms; plural: NounCaseForms; animate?: boolean } => {
  switch (seed.paradigm) {
    case "animateHard":
      return {
        animate: true,
        singular: {
          nominative: seed.noun,
          genitive: seed.stem + "a",
          dative: seed.locativeSingular,
          accusative: seed.stem + "a",
          vocative: seed.stem + "e",
          locative: seed.locativeSingular,
          instrumental: seed.stem + "em",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: hardPluralGenitive(seed),
          dative: seed.stem + "ům",
          accusative: seed.stem + "y",
          vocative: seed.nominativePlural,
          locative: seed.stem + "ech",
          instrumental: seed.stem + "y",
        },
      };
    case "animateSoft":
      return {
        animate: true,
        singular: {
          nominative: seed.noun,
          genitive: seed.stem + "e",
          dative: seed.locativeSingular,
          accusative: seed.stem + "e",
          vocative: seed.locativeSingular,
          locative: seed.locativeSingular,
          instrumental: seed.stem + "em",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: hardPluralGenitive(seed),
          dative: seed.stem + "ům",
          accusative: seed.stem + "e",
          vocative: seed.nominativePlural,
          locative: seed.stem + "ích",
          instrumental: seed.stem + "i",
        },
      };
    case "animateA":
      return {
        animate: true,
        singular: {
          nominative: seed.noun,
          genitive: seed.stem + "y",
          dative: seed.locativeSingular,
          accusative: seed.stem + "u",
          vocative: seed.stem + "o",
          locative: seed.locativeSingular,
          instrumental: seed.stem + "ou",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: seed.stem + "ů",
          dative: seed.stem + "ům",
          accusative: seed.stem + "y",
          vocative: seed.nominativePlural,
          locative: seed.stem + "ech",
          instrumental: seed.stem + "y",
        },
      };
    case "inanimateSoft":
      return {
        singular: {
          nominative: seed.noun,
          genitive: seed.stem + "e",
          dative: seed.locativeSingular,
          accusative: seed.noun,
          vocative: seed.noun,
          locative: seed.locativeSingular,
          instrumental: seed.stem + "em",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: hardPluralGenitive(seed),
          dative: seed.stem + "ům",
          accusative: seed.nominativePlural,
          vocative: seed.nominativePlural,
          locative: seed.stem + "ích",
          instrumental: seed.stem + "i",
        },
      };
    case "feminineA":
      return {
        singular: {
          nominative: seed.noun,
          genitive: seed.stem + "y",
          dative: seed.locativeSingular,
          accusative: seed.stem + "u",
          vocative: seed.stem + "o",
          locative: seed.locativeSingular,
          instrumental: seed.stem + "ou",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: seed.stem,
          dative: seed.stem + "ám",
          accusative: seed.nominativePlural,
          vocative: seed.nominativePlural,
          locative: seed.stem + "ách",
          instrumental: seed.stem + "ami",
        },
      };
    case "feminineE":
      return {
        singular: {
          nominative: seed.noun,
          genitive: seed.noun,
          dative: seed.locativeSingular,
          accusative: seed.locativeSingular,
          vocative: seed.noun,
          locative: seed.locativeSingular,
          instrumental: seed.stem + "í",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: seed.stem,
          dative: seed.stem + "ím",
          accusative: seed.nominativePlural,
          vocative: seed.nominativePlural,
          locative: seed.stem + "ích",
          instrumental: seed.stem + "emi",
        },
      };
    case "neuterI":
      return {
        singular: {
          nominative: seed.noun,
          genitive: seed.noun,
          dative: seed.noun,
          accusative: seed.noun,
          vocative: seed.noun,
          locative: seed.locativeSingular,
          instrumental: seed.stem + "ím",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: seed.nominativePlural,
          dative: seed.stem + "ím",
          accusative: seed.nominativePlural,
          vocative: seed.nominativePlural,
          locative: seed.stem + "ích",
          instrumental: seed.stem + "ími",
        },
      };
    case "neuterE":
      return {
        singular: {
          nominative: seed.noun,
          genitive: seed.stem + "e",
          dative: seed.locativeSingular,
          accusative: seed.noun,
          vocative: seed.noun,
          locative: seed.locativeSingular,
          instrumental: seed.stem + "em",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: seed.stem + "í",
          dative: seed.stem + "ím",
          accusative: seed.nominativePlural,
          vocative: seed.nominativePlural,
          locative: seed.stem + "ích",
          instrumental: seed.stem + "i",
        },
      };
    case "neuterUm":
      return {
        singular: {
          nominative: seed.noun,
          genitive: seed.locativeSingular,
          dative: seed.locativeSingular,
          accusative: seed.noun,
          vocative: seed.noun,
          locative: seed.locativeSingular,
          instrumental: seed.stem + "em",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: seed.stem + "er",
          dative: seed.stem + "ům",
          accusative: seed.nominativePlural,
          vocative: seed.nominativePlural,
          locative: seed.stem + "ech",
          instrumental: seed.stem + "y",
        },
      };
    case "neuterO":
      return {
        singular: {
          nominative: seed.noun,
          genitive: seed.stem + "a",
          dative: seed.stem + "u",
          accusative: seed.noun,
          vocative: seed.noun,
          locative: seed.locativeSingular,
          instrumental: seed.stem + "em",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: seed.stem,
          dative: seed.stem + "ům",
          accusative: seed.nominativePlural,
          vocative: seed.nominativePlural,
          locative: seed.stem + "ech",
          instrumental: seed.stem + "y",
        },
      };
    default:
      return {
        singular: {
          nominative: seed.noun,
          genitive: seed.noun + "u",
          dative: seed.noun + "u",
          accusative: seed.noun,
          vocative: seed.noun,
          locative: seed.locativeSingular,
          instrumental: seed.noun + "em",
        },
        plural: {
          nominative: seed.nominativePlural,
          genitive: seed.noun + "ů",
          dative: seed.noun + "ům",
          accusative: seed.nominativePlural,
          vocative: seed.nominativePlural,
          locative: seed.noun + "ech",
          instrumental: seed.noun + "y",
        },
      };
  }
};

const buildExamples = (noun: Pick<Noun, "noun" | "translation" | "singular" | "plural">) => [
  { cz: "To je " + noun.singular.nominative + ".", ua: "Це " + noun.translation + "." },
  { cz: "Nemám " + noun.singular.genitive + ".", ua: "У мене немає: " + noun.translation + "." },
  { cz: "Jdu k " + noun.singular.dative + ".", ua: "Я йду до/к: " + noun.translation + "." },
  { cz: "Vidím " + noun.singular.accusative + ".", ua: "Я бачу: " + noun.translation + "." },
  { cz: "Mluvím o " + noun.singular.locative + ".", ua: "Я говорю про: " + noun.translation + "." },
  { cz: "Jdu s " + noun.singular.instrumental + ".", ua: "Я йду з/із: " + noun.translation + "." },
  { cz: "Tady jsou " + noun.plural.nominative + ".", ua: "Тут є кілька: " + noun.translation + "." },
  { cz: "Bez " + noun.plural.genitive + " to nejde.", ua: "Без цих речей/людей це не виходить: " + noun.translation + "." },
  { cz: "Pomáhám " + noun.plural.dative + ".", ua: "Я допомагаю кільком: " + noun.translation + "." },
  { cz: "Potřebuju " + noun.plural.accusative + ".", ua: "Мені потрібні: " + noun.translation + "." },
  { cz: "Často mluvím o " + noun.plural.locative + ".", ua: "Я часто говорю про кілька: " + noun.translation + "." },
  { cz: "Pracuju s " + noun.plural.instrumental + ".", ua: "Я працюю з кількома: " + noun.translation + "." },
  { cz: "V sešitě mám větu se slovem “" + noun.noun + "”.", ua: "У зошиті маю речення зі словом “" + noun.translation + "”." },
  { cz: "Učitel píše na tabuli: “" + noun.singular.nominative + " — " + noun.plural.nominative + "”.", ua: "Учитель пише на дошці однину і множину." },
  { cz: "V dialogu používám tvar “" + noun.singular.locative + "”.", ua: "У діалозі я використовую місцевий відмінок." },
];

const buildExercises = (noun: Pick<Noun, "noun" | "translation" | "singular" | "plural">): Exercise[] => [
  {
    question: "Оберіть genitiv однини для “" + noun.noun + "”",
    options: withOptions(noun.singular.genitive, [noun.singular.dative, noun.singular.accusative]),
    correctAnswer: noun.singular.genitive,
  },
  {
    question: "Оберіть dativ однини для “" + noun.noun + "”",
    options: withOptions(noun.singular.dative, [noun.singular.genitive, noun.singular.instrumental]),
    correctAnswer: noun.singular.dative,
  },
  {
    question: "Оберіть akuzativ однини для “" + noun.noun + "”",
    options: withOptions(noun.singular.accusative, [noun.singular.nominative, noun.singular.locative]),
    correctAnswer: noun.singular.accusative,
  },
  {
    question: "Оберіть locativ після “o”: mluvím o ___",
    options: withOptions(noun.singular.locative, [noun.singular.instrumental, noun.singular.genitive]),
    correctAnswer: noun.singular.locative,
  },
  {
    question: "Оберіть instrumentál після “s”: jdu s ___",
    options: withOptions(noun.singular.instrumental, [noun.singular.dative, noun.singular.accusative]),
    correctAnswer: noun.singular.instrumental,
  },
  {
    question: "Оберіть nominativ множини для “" + noun.noun + "”",
    options: withOptions(noun.plural.nominative, [noun.singular.nominative, noun.plural.genitive]),
    correctAnswer: noun.plural.nominative,
  },
  {
    question: "Оберіть genitiv множини для “" + noun.noun + "”",
    options: withOptions(noun.plural.genitive, [noun.plural.dative, noun.plural.instrumental]),
    correctAnswer: noun.plural.genitive,
  },
  {
    question: "Що означає “" + noun.noun + "”?",
    options: withOptions(noun.translation, ["дієслово", "прикметник"]),
    correctAnswer: noun.translation,
  },
  {
    question: "Доповніть: Nemám ___",
    options: withOptions(noun.singular.genitive, [noun.singular.nominative, noun.singular.instrumental]),
    correctAnswer: noun.singular.genitive,
  },
  {
    question: "Доповніть: Vidím ___",
    options: withOptions(noun.singular.accusative, [noun.singular.genitive, noun.singular.locative]),
    correctAnswer: noun.singular.accusative,
  },
  {
    question: "Доповніть: Tady jsou ___",
    options: withOptions(noun.plural.nominative, [noun.plural.genitive, noun.singular.nominative]),
    correctAnswer: noun.plural.nominative,
  },
  {
    question: "Доповніть: Pracuju s ___",
    options: withOptions(noun.plural.instrumental, [noun.plural.locative, noun.plural.dative]),
    correctAnswer: noun.plural.instrumental,
  },
  {
    question: "Який відмінок у фразі “do " + noun.singular.genitive + "”?",
    options: withOptions("genitiv", ["akuzativ", "lokál"]),
    correctAnswer: "genitiv",
  },
  {
    question: "Який відмінок у фразі “o " + noun.singular.locative + "”?",
    options: withOptions("lokál", ["dativ", "instrumentál"]),
    correctAnswer: "lokál",
  },
  {
    question: "Яка пара однина-множина правильна?",
    options: withOptions(noun.singular.nominative + " — " + noun.plural.nominative, [
      noun.singular.genitive + " — " + noun.plural.nominative,
      noun.singular.nominative + " — " + noun.plural.genitive,
    ]),
    correctAnswer: noun.singular.nominative + " — " + noun.plural.nominative,
  },
];

export const nouns: Noun[] = nounSeeds.map((seed, index) => {
  const forms = decline(seed);
  const baseNoun = {
    id: index + 1,
    noun: seed.noun,
    translation: seed.translation,
    gender: seed.gender,
    level: seed.level,
    animate: forms.animate,
    singular: forms.singular,
    plural: forms.plural,
  };

  return {
    ...baseNoun,
    examples: buildExamples(baseNoun),
    exercises: buildExercises(baseNoun),
  };
});
