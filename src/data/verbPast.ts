// Форма минулого часу чоловічого роду однини (дієприкметник на -l) для кожного дієслова словника.
// Регулярні (інфінітив без -t + -l) і неправильні записані явно, щоб форми можна було перевірити тестом.
export const pastMasculine: Record<string, string> = {
  "být": "byl",
  "mít": "měl",
  "dělat": "dělal",
  "jít": "šel",
  "jet": "jel",
  "chtít": "chtěl",
  "moci": "mohl",
  "muset": "musel",
  "umět": "uměl",
  "vědět": "věděl",
  "říct": "řekl",
  "dát": "dal",
  "vidět": "viděl",
  "slyšet": "slyšel",
  "cítit": "cítil",
  "vzít": "vzal",
  "přijít": "přišel",
  "odejít": "odešel",
  "přijet": "přijel",
  "odjet": "odjel",
  "pracovat": "pracoval",
  "bydlet": "bydlel",
  "žít": "žil",
  "studovat": "studoval",
  "učit se": "učil",
  "učit": "učil",
  "mluvit": "mluvil",
  "říkat": "říkal",
  "rozumět": "rozuměl",
  "znát": "znal",
  "číst": "četl",
  "psát": "psal",
  "poslouchat": "poslouchal",
  "dívat se": "díval",
  "sledovat": "sledoval",
  "jíst": "jedl",
  "pít": "pil",
  "vařit": "vařil",
  "kupovat": "kupoval",
  "prodávat": "prodával",
  "platit": "platil",
  "objednat": "objednal",
  "rezervovat": "rezervoval",
  "hledat": "hledal",
  "najít": "našel",
  "čekat": "čekal",
  "začít": "začal",
  "skončit": "skončil",
  "otevřít": "otevřel",
  "zavřít": "zavřel",
  "sedět": "seděl",
  "stát": "stál",
  "ležet": "ležel",
  "běžet": "běžel",
  "chodit": "chodil",
  "nosit": "nosil",
  "přinést": "přinesl",
  "odnést": "odnesl",
  "vrátit se": "vrátil",
  "zůstat": "zůstal",
  "pomáhat": "pomáhal",
  "potřebovat": "potřeboval",
  "používat": "používal",
  "myslet": "myslel",
  "pamatovat si": "pamatoval",
  "zapomenout": "zapomněl",
  "bát se": "bál",
  "smát se": "smál",
  "líbit se": "líbil",
  "milovat": "miloval",
  "mít rád": "měl",
  "cestovat": "cestoval",
  "sportovat": "sportoval",
  "hrát": "hrál",
  "telefonovat": "telefonoval",
  "poslat": "poslal",
  "dostat": "dostal",
  "dávat": "dával",
  "ptát se": "ptal",
  "odpovědět": "odpověděl",
  "ukázat": "ukázal",
  "vysvětlit": "vysvětlil",
  "opakovat": "opakoval",
  "připravit": "připravil",
  "změnit": "změnil",
  "stát se": "stal",
  "trvat": "trval",
  "znamenat": "znamenal",
  "vypadat": "vypadal",
  "potkat": "potkal",
  "navštívit": "navštívil",
  "vybrat": "vybral",
  "zapnout": "zapnul",
  "vypnout": "vypnul",
  "opravit": "opravil",
  "čistit": "čistil",
  "zkusit": "zkusil",
  "narodit se": "narodil",
  "umřít": "umřel",
  "volat": "volal",
};

export interface PastRow {
  label: string;
  masculine: string;
  feminine: string;
  /** Лише для 3 особи: форма середнього роду. */
  neuter?: string;
}

const withGender = (masculine: string) => {
  // šel → šl-: у формах жіночого, середнього роду та множини «e» випадає (šla, šlo, šli, šly).
  const stem = /^(šel|přišel|odešel|našel)$/.test(masculine) ? masculine.slice(0, -2) + "l" : masculine;
  return {
    masculine,
    feminine: stem + "a",
    neuter: stem + "o",
    pluralMasculine: stem + "i",
    pluralFeminine: stem + "y",
  };
};

/** Текст для озвучення: у 3 особі частка se/si стоїть перед формою («on se učil»), а не після неї. */
export const speakablePast = (pronoun: string, text: string): string => {
  const match = /^(.*) (se|si)$/.exec(text);
  return match && !/^(jsem|jsi|jsme|jste|ses|sis)( |$)/.test(text) ? pronoun + " " + match[2] + " " + match[1] : pronoun + " " + text;
};

/** Таблиця минулого часу для дієслова. Повертає null, якщо форми немає у словнику. */
export const buildPastRows = (infinitive: string): PastRow[] | null => {
  const masculine = pastMasculine[infinitive];

  if (!masculine) {
    return null;
  }

  const forms = withGender(masculine);
  const particle = infinitive.endsWith(" se") ? "se" : infinitive.endsWith(" si") ? "si" : "";
  const complement = infinitive === "mít rád" ? { masculine: "rád", feminine: "ráda", neuter: "rádo", pluralMasculine: "rádi", pluralFeminine: "rády" } : null;
  const join = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(" ");
  const withParticle = (aux: string, form: string, complementForm: string | undefined) => {
    if (!particle) {
      return join(aux, form, complementForm);
    }
    // Рефлексивна частка стоїть після допоміжного: jsem se učil, але ty ses učil.
    if (aux === "jsi") {
      return join(particle === "se" ? "ses" : "sis", form, complementForm);
    }
    return join(aux, particle, form, complementForm);
  };
  // Частка se/si не може починати речення, тому в 3 особі вона стоїть після форми: díval se.
  const third = (form: string, complementForm: string | undefined) => join(form, particle, complementForm);

  return [
    {
      label: "já",
      masculine: withParticle("jsem", forms.masculine, complement?.masculine),
      feminine: withParticle("jsem", forms.feminine, complement?.feminine),
    },
    {
      label: "ty",
      masculine: withParticle("jsi", forms.masculine, complement?.masculine),
      feminine: withParticle("jsi", forms.feminine, complement?.feminine),
    },
    {
      label: "on / ona / ono",
      masculine: third(forms.masculine, complement?.masculine),
      feminine: third(forms.feminine, complement?.feminine),
      neuter: third(forms.neuter, complement?.neuter),
    },
    {
      label: "my",
      masculine: withParticle("jsme", forms.pluralMasculine, complement?.pluralMasculine),
      feminine: withParticle("jsme", forms.pluralFeminine, complement?.pluralFeminine),
    },
    {
      label: "vy",
      masculine: withParticle("jste", forms.pluralMasculine, complement?.pluralMasculine),
      feminine: withParticle("jste", forms.pluralFeminine, complement?.pluralFeminine),
    },
    {
      label: "oni / ony",
      masculine: third(forms.pluralMasculine, complement?.pluralMasculine),
      feminine: third(forms.pluralFeminine, complement?.pluralFeminine),
    },
  ];
};
