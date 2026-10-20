// Пошук не залежить від регістру й діакритики латиниці: «cest» знаходить «čest».
// Кирилицю не чіпаємо, щоб «й» не перетворювалось на «и».
export const normalizeSearch = (text: string) =>
  text
    .normalize("NFD")
    .replace(/([A-Za-z])[̀-ͯ]+/g, "$1")
    .normalize("NFC")
    .toLocaleLowerCase("uk-UA")
    .trim();

/** Чи підходить хоча б одне з полів під запит. Порожній запит підходить усім. */
export const matchesSearch = (query: string, ...fields: string[]) => {
  const normalizedQuery = normalizeSearch(query);

  return normalizedQuery.length === 0 || fields.some((field) => normalizeSearch(field).includes(normalizedQuery));
};
