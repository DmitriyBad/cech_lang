import type { CzechCaseKey, NounCaseForms } from "../types/Noun";

export const caseOrder: CzechCaseKey[] = ["nominative", "genitive", "dative", "accusative", "vocative", "locative", "instrumental"];

export interface CaseExplanation {
  key: CzechCaseKey;
  /** Назва чеською та номер. */
  title: string;
  /** Відповідний український відмінок. */
  ukrainian: string;
  question: string;
  usage: string;
  example: { cz: string; ua: string };
}

export const caseExplanations: CaseExplanation[] = [
  {
    key: "nominative",
    title: "1. nominativ",
    ukrainian: "називний",
    question: "kdo? co? (хто? що?)",
    usage: "Підмет і слово, яке називаємо: «To je …». Це форма зі словника.",
    example: { cz: "To je kavárna.", ua: "Це кав'ярня." },
  },
  {
    key: "genitive",
    title: "2. genitiv",
    ukrainian: "родовий",
    question: "koho? čeho? (кого? чого?)",
    usage: "Після прийменників bez, do, od, z, u, vedle; належність; після кількості («hodně času», «trochu kávy», «kilo cukru»).",
    example: { cz: "Jdu do obchodu.", ua: "Іду до магазину." },
  },
  {
    key: "dative",
    title: "3. dativ",
    ukrainian: "давальний",
    question: "komu? čemu? (кому? чому?)",
    usage: "Кому щось даємо чи допомагаємо; після прийменників k, díky, proti.",
    example: { cz: "Pomáhám kamarádovi.", ua: "Допомагаю другові." },
  },
  {
    key: "accusative",
    title: "4. akuzativ",
    ukrainian: "знахідний",
    question: "koho? co? (кого? що?)",
    usage: "Прямий додаток («бачу що?»); після прийменників pro, přes; напрям («куди?») після na, za, před, pod, nad, mezi.",
    example: { cz: "Vidím kamaráda.", ua: "Бачу друга." },
  },
  {
    key: "vocative",
    title: "5. vokativ",
    ukrainian: "кличний",
    question: "звертання",
    usage: "Коли звертаємося до людини. У неживих іменників майже не вживається.",
    example: { cz: "Ahoj, kamaráde!", ua: "Привіт, друже!" },
  },
  {
    key: "locative",
    title: "6. lokál",
    ukrainian: "місцевий",
    question: "o kom? o čem? (про кого? про що?), kde? (де?)",
    usage: "Завжди з прийменником: v, na («де?»), o («про»), po, při.",
    example: { cz: "Bydlím v Praze.", ua: "Живу в Празі." },
  },
  {
    key: "instrumental",
    title: "7. instrumentál",
    ukrainian: "орудний",
    question: "kým? čím? (ким? чим?)",
    usage: "Засіб («їду автобусом»); після s («з»); місце після před, za, nad, pod, mezi («де?»).",
    example: { cz: "Jedu autobusem.", ua: "Їду автобусом." },
  },
];

export const prepositionGroups: Array<{ caseTitle: string; prepositions: string; note: string }> = [
  { caseTitle: "2. genitiv", prepositions: "bez, do, od, z/ze, u, vedle, kolem, během, podle", note: "do obchodu, od kamaráda, bez cukru" },
  { caseTitle: "3. dativ", prepositions: "k/ke, díky, proti, naproti", note: "k lékaři, díky učiteli" },
  { caseTitle: "4. akuzativ", prepositions: "pro, přes; na, za, před, pod, nad, mezi (на питання «куди?»)", note: "pro kamaráda, přes ulici" },
  { caseTitle: "6. lokál", prepositions: "v/ve, na («де?»), o («про»), po, při", note: "v obchodě, o práci" },
  { caseTitle: "7. instrumentál", prepositions: "s/se; před, za, nad, pod, mezi (на питання «де?»)", note: "s kamarádem, před domem" },
];

export const whereVsWhereTo = {
  where: { cz: "Kniha je na stole.", ua: "Книга лежить на столі. (де? → lokál)" },
  whereTo: { cz: "Položím knihu na stůl.", ua: "Покладу книгу на стіл. (куди? → akuzativ)" },
};

export interface DeclensionPattern {
  id: string;
  /** Слово-зразок. */
  example: string;
  translation: string;
  gender: "чоловічий" | "жіночий" | "середній";
  title: string;
  /** Які слова відмінюються за цим зразком. */
  covers: string;
  stem: string;
  /** Закінчення в порядку caseOrder; null = форма майже не вживається (збігається з називним). */
  singular: Array<string | null>;
  plural: Array<string | null>;
  note?: string;
}

export const declensionPatterns: DeclensionPattern[] = [
  {
    id: "student",
    example: "student",
    translation: "студент",
    gender: "чоловічий",
    title: "Чоловічий рід, істоти, твердий приголосний",
    covers: "student, kamarád, číšník, doktor, bratr, soused, syn (у деяких множина з чергуванням або виняток)",
    stem: "student",
    singular: ["", "a", "ovi", "a", "e", "ovi", "em"],
    plural: ["i", "ů", "ům", "y", "i", "ech", "y"],
    note: "Давальний і місцевий однини в живих іменників закінчуються на -ovi (або -u). Після k, h, ch, r перед -i приголосний чергується: kluk → kluci, číšník → číšníci, doktor → doktoři, bratr → bratři; в інших слів ні: studenti, kamarádi. Винятки: soused → sousedé, syn → synové. Кличний: -e (studente, kamaráde, doktore), але після k, h, ch, g це -u (kluku, číšníku, Čechu), а bratr → bratře.",
  },
  {
    id: "ucitel",
    example: "učitel",
    translation: "учитель",
    gender: "чоловічий",
    title: "Чоловічий рід, істоти, м'який приголосний",
    covers: "učitel, muž, řidič, prodavač…",
    stem: "učitel",
    singular: ["", "e", "i", "e", "i", "i", "em"],
    plural: ["é", "ů", "ům", "e", "é", "ích", "i"],
    note: "Слова на -tel мають у множині -é (učitelé). У більшості інших множина на -i: muži (або mužové), řidiči, prodavači.",
  },
  {
    id: "obchod",
    example: "obchod",
    translation: "магазин",
    gender: "чоловічий",
    title: "Чоловічий рід, неживе, твердий приголосний",
    covers: "obchod, park, vlak, telefon, hotel, kurz, jazyk…",
    stem: "obchod",
    singular: ["", "u", "u", "", null, "ě", "em"],
    plural: ["y", "ů", "ům", "y", null, "ech", "y"],
    note: "Знахідний збігається з називним. Родовий найчастіше на -u (obchodu, parku), але є слова на -a (jazyk → jazyka, les → lesa). Місцевий найчастіше закінчується на -u (v parku, v hotelu, v telefonu, na vlaku, v jazyku), але в частини слів на -ě або -e (v obchodě, ve světě, na stole). Це треба запам'ятати: точна форма вказана на сторінці слова. Після k, h, ch, g завжди -u.",
  },
  {
    id: "pokoj",
    example: "pokoj",
    translation: "кімната",
    gender: "чоловічий",
    title: "Чоловічий рід, неживе, м'який приголосний",
    covers: "pokoj, klíč, počítač, měsíc…",
    stem: "pokoj",
    singular: ["", "e", "i", "", null, "i", "em"],
    plural: ["e", "ů", "ům", "e", null, "ích", "i"],
  },
  {
    id: "skola",
    example: "škola",
    translation: "школа",
    gender: "жіночий",
    title: "Жіночий рід на -a",
    covers: "škola, žena, rodina, káva, kniha, cena, cesta…",
    stem: "škol",
    singular: ["a", "y", "e", "u", "o", "e", "ou"],
    plural: ["y", "", "ám", "y", "y", "ách", "ami"],
    note: "Родовий множини без закінчення (škol, žen); якщо в кінці збирається кілька приголосних, з'являється -e-: otázka → otázek, karta → karet. Давальний і місцевий однини збігаються (ve škole).",
  },
  {
    id: "ulice",
    example: "ulice",
    translation: "вулиця",
    gender: "жіночий",
    title: "Жіночий рід на -e",
    covers: "ulice, práce, lekce, restaurace, kuchyně, informace…",
    stem: "ulic",
    singular: ["e", "e", "i", "i", "e", "i", "í"],
    plural: ["e", "", "ím", "e", "e", "ích", "emi"],
    note: "Родовий множини різний, його треба запам'ятати: ulic, prací, lekcí, restaurací, kuchyní.",
  },
  {
    id: "mistnost",
    example: "místnost",
    translation: "приміщення",
    gender: "жіночий",
    title: "Жіночий рід на приголосний",
    covers: "místnost, věc, noc, příležitost…",
    stem: "místnost",
    singular: ["", "i", "i", "", "i", "i", "í"],
    plural: ["i", "í", "em", "i", "i", "ech", "mi"],
    note: "У словнику цього сайту таких іменників поки немає, але вони дуже поширені. Закінчення -i в однині майже скрізь.",
  },
  {
    id: "mesto",
    example: "město",
    translation: "місто",
    gender: "середній",
    title: "Середній рід на -o",
    covers: "město, okno, slovo, auto, jídlo, číslo…",
    stem: "měst",
    singular: ["o", "a", "u", "o", "o", "ě", "em"],
    plural: ["a", "", "ům", "a", "a", "ech", "y"],
    note: "Знахідний і кличний збігаються з називним. Родовий множини без закінчення; з'являється -e-, якщо збираються приголосні: okno → oken.",
  },
  {
    id: "more",
    example: "moře",
    translation: "море",
    gender: "середній",
    title: "Середній рід на -e / -ě",
    covers: "moře, ovoce, srdce, parkoviště, letiště, hřiště…",
    stem: "moř",
    singular: ["e", "e", "i", "e", "e", "i", "em"],
    plural: ["e", "í", "ím", "e", "e", "ích", "i"],
    note: "Слова на -iště мають особливості (parkoviště — parkovišť, parkovištěm), тому для них дивіться таблицю на сторінці слова.",
  },
  {
    id: "nadrazi",
    example: "nádraží",
    translation: "вокзал",
    gender: "середній",
    title: "Середній рід на -í",
    covers: "nádraží, cvičení, setkání, náměstí, zaměstnání…",
    stem: "nádraží",
    singular: ["", "", "", "", "", "", "m"],
    plural: ["", "", "m", "", "", "ch", "mi"],
    note: "Майже всі форми збігаються з називним: розрізняють лише орудний однини (-m) і форми множини з -m, -ch, -mi.",
  },
];

export const buildPatternForms = (pattern: DeclensionPattern): { singular: Array<string | null>; plural: Array<string | null> } => ({
  singular: pattern.singular.map((ending) => (ending === null ? null : pattern.stem + ending)),
  plural: pattern.plural.map((ending) => (ending === null ? null : pattern.stem + ending)),
});

export const patternToNounForms = (pattern: DeclensionPattern): { singular: Partial<NounCaseForms>; plural: Partial<NounCaseForms> } => {
  const forms = buildPatternForms(pattern);
  const toRecord = (values: Array<string | null>) =>
    Object.fromEntries(caseOrder.map((key, index) => [key, values[index]]).filter(([, value]) => value !== null)) as Partial<NounCaseForms>;
  return { singular: toRecord(forms.singular), plural: toRecord(forms.plural) };
};

export interface SoundChange {
  title: string;
  text: string;
  examples: Array<{ cz: string; ua: string }>;
}

export const soundChanges: SoundChange[] = [
  {
    title: "k, h, ch, r змінюються перед закінченням -i / -e",
    text: "k → c, h → z, ch → š, r → ř. Так у множині живих чоловічих слів і в давальному та місцевому жіночих слів на -a.",
    examples: [
      { cz: "kluk → kluci", ua: "хлопець → хлопці" },
      { cz: "Čech → Češi", ua: "чех → чехи" },
      { cz: "bratr → bratři", ua: "брат → брати" },
      { cz: "otázka → o otázce", ua: "питання → про питання" },
      { cz: "kniha → v knize", ua: "книга → у книзі" },
      { cz: "Praha → v Praze", ua: "Прага → у Празі" },
    ],
  },
  {
    title: "Закінчення -ě після d, t, n, b, p, m, v",
    text: "У давальному й місцевому однини жіночих слів на -a та місцевому середніх на -o: після d, t, n, b, p, m, v пишемо -ě (після d, t, n воно читається м'яко: «дє», «тє», «нє»), а після решти приголосних (l, s, z, k…) закінчення -e (k, h, ch, r ще й чергуються).",
    examples: [
      { cz: "voda → ve vodě", ua: "вода → у воді" },
      { cz: "cena → o ceně", ua: "ціна → про ціну" },
      { cz: "město → ve městě", ua: "місто → у місті" },
      { cz: "škola → ve škole", ua: "школа → у школі" },
      { cz: "adresa → na adrese", ua: "адреса → на адресі" },
    ],
  },
  {
    title: "Випадає -e- у закінченні слова",
    text: "У багатьох словах на -ek та -ec голосний -e- випадає, коли додаємо закінчення.",
    examples: [
      { cz: "lístek → lístku", ua: "квиток → квитка" },
      { cz: "obrázek → obrázku", ua: "картинка → картинки" },
      { cz: "dárek → dárku", ua: "подарунок → подарунка" },
      { cz: "chlapec → chlapce", ua: "хлопець → хлопця" },
    ],
  },
  {
    title: "ů → o у кількох поширених словах",
    text: "Лише в деяких словах довгий -ů- у відмінюванні стає «o»: dům → domu, stůl → stolu, kůň → koně, sůl → soli. В інших слів він лишається: důvod → důvodu.",
    examples: [
      { cz: "dům → domu", ua: "будинок → будинку" },
      { cz: "stůl → stolu", ua: "стіл → столу" },
    ],
  },
  {
    title: "Вставний -e- у родовому множини",
    text: "Якщо після відкидання закінчення в кінці зібралося кілька приголосних, між ними з'являється -e-.",
    examples: [
      { cz: "otázka → otázek", ua: "питання → питань" },
      { cz: "karta → karet", ua: "картка → карток" },
      { cz: "okno → oken", ua: "вікно → вікон" },
    ],
  },
];

export const rememberPoints: string[] = [
  "Знахідний однини збігається з називним у неживих чоловічих і середніх іменників (vidím obchod, vidím město). У живих чоловічих він такий самий, як родовий (vidím studenta), а в жіночих на -a закінчується на -u (vidím školu).",
  "Орудний однини: чоловічий і середній рід -em, жіночий на -a: -ou, жіночий на -e чи приголосний: -í (autobusem, městem, školou, ulicí).",
  "У жіночому роді давальний і місцевий однини однакові: ženě, škole, ulici, místnosti.",
  "Місцевий відмінок вживається лише з прийменником (v, na, o, po, při).",
  "Давальний множини: -ům (чоловічий і середній на -o), -ám (жіночий на -a), -ím (жіночий на -e, середній на -e або -í), -em (жіночий на приголосний).",
  "Місцевий множини: -ech (чоловічий твердий, середній на -o, жіночий на приголосний), -ích (чоловічий м'який, жіночий на -e, середній на -e або -í), -ách (жіночий на -a).",
];
