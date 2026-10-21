import { useCallback, useEffect, useRef, useState } from "react";

// Розпізнавання мови браузером (Web Speech API). Є в Chrome і Edge; у Firefox немає, у Safari працює нестабільно.
// У Chrome звук обробляється на серверах Google, тому користувача про це попереджаємо на сторінці вправи.

interface RecognitionAlternative {
  transcript: string;
}

interface RecognitionResult {
  length: number;
  [index: number]: RecognitionAlternative;
}

interface RecognitionEvent {
  results: { length: number; [index: number]: RecognitionResult };
}

interface RecognitionErrorEvent {
  error: string;
}

interface RecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type RecognitionConstructor = new () => RecognitionInstance;

const getConstructor = (): RecognitionConstructor | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const scope = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
};

export const isRecognitionSupported = () => getConstructor() !== null;

const errorMessages: Record<string, string> = {
  "not-allowed": "Немає доступу до мікрофона. Дозвольте його в налаштуваннях браузера й спробуйте ще раз.",
  "service-not-allowed": "Немає доступу до мікрофона. Дозвольте його в налаштуваннях браузера й спробуйте ще раз.",
  "no-speech": "Нічого не почув. Спробуйте ще раз, говоріть трохи гучніше.",
  "audio-capture": "Не знайдено мікрофон. Підключіть його й спробуйте ще раз.",
  network: "Для розпізнавання потрібен інтернет. Перевірте з'єднання.",
};

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const instance = useRef<RecognitionInstance | null>(null);

  useEffect(
    () => () => {
      instance.current?.abort();
    },
    [],
  );

  /** Починає слухати. `onResult` отримує кілька варіантів розпізнаного тексту. */
  const start = useCallback((onResult: (alternatives: string[]) => void) => {
    const Recognition = getConstructor();

    if (!Recognition) {
      setError("Цей браузер не підтримує розпізнавання мови. Відкрийте сайт у Chrome або Edge.");
      return;
    }

    instance.current?.abort();
    const recognition = new Recognition();
    recognition.lang = "cs-CZ";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    let gotResult = false;

    recognition.onresult = (event) => {
      const alternatives: string[] = [];
      const last = event.results[event.results.length - 1];

      for (let index = 0; index < last.length; index += 1) {
        alternatives.push(last[index].transcript);
      }

      gotResult = true;
      onResult(alternatives);
    };
    recognition.onerror = (event) => {
      setError(errorMessages[event.error] ?? "Не вдалося розпізнати мову (" + event.error + "). Спробуйте ще раз.");
    };
    recognition.onend = () => {
      setListening(false);

      if (!gotResult) {
        setError((current) => current || errorMessages["no-speech"]);
      }
    };

    setError("");
    setListening(true);
    instance.current = recognition;

    try {
      recognition.start();
    } catch {
      setListening(false);
      setError("Не вдалося почати запис. Спробуйте ще раз.");
    }
  }, []);

  const stop = useCallback(() => instance.current?.stop(), []);

  return { listening, error, start, stop, supported: isRecognitionSupported() };
}
