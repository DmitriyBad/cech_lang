// Тексти завдань записані в даних один раз («Оберіть…», «Доповніть…»), а режим відповіді
// користувач змінює. Тому дієслово в завданні підлаштовується під те, що треба робити: обрати чи написати.

/** Підлаштовує текст завдання під спосіб відповіді: вибір варіанта або введення з клавіатури. */
export const adaptQuestion = (question: string, typing: boolean): string => {
  const hasGap = question.includes("___");

  if (typing) {
    return question
      .replace(/Vyberte správné slovo/g, "Napište správné slovo")
      .replace(/Оберіть/g, hasGap ? "Впишіть" : "Напишіть")
      .replace(/Доповніть форму/g, "Впишіть форму")
      .replace(/Доповніть:/g, "Впишіть пропущене слово:");
  }

  return question.replace(/Доповніть форму/g, "Оберіть форму").replace(/Доповніть:/g, "Оберіть пропущене слово:");
};
