import { Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";

interface SpeakButtonProps {
  /** Чеський текст для озвучення. */
  text: string;
  className?: string;
}

export default function SpeakButton({ text, className = "" }: SpeakButtonProps) {
  const { speak, hasCzechVoice } = useSpeech();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Без чеського голосу кнопку ховаємо: інакше текст прочитає чужий голос і вимова буде хибною.
  if (!hasCzechVoice) {
    return null;
  }

  const handleClick = () => {
    setIsSpeaking(true);
    speak(text, {
      onEnd: () => {
        if (isMounted.current) {
          setIsSpeaking(false);
        }
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={"Прослухати: " + text}
      title="Прослухати"
      className={[
        "focus-ring inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md align-middle transition",
        isSpeaking ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100 hover:text-blue-600",
        className,
      ].join(" ")}
    >
      <Volume2 size={18} aria-hidden="true" />
    </button>
  );
}
