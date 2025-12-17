import { useState, useEffect, useRef } from "react";

interface UseTypingEffectOptions {
  /**
   * Speed of typing in milliseconds per character
   * @default 20
   */
  speed?: number;

  /**
   * Callback when typing is complete
   */
  onComplete?: () => void;
}

/**
 * Hook to create a typing effect for streaming text
 * Used for bot messages to display text character by character
 */
export const useTypingEffect = (
  fullText: string,
  options: UseTypingEffectOptions = {}
) => {
  const { speed = 20, onComplete } = options;

  const [displayedText, setDisplayedText] = useState("");
  const displayedLengthRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const fullTextRef = useRef(fullText);
  const onCompleteRef = useRef(onComplete);

  // Update refs when they change
  useEffect(() => {
    fullTextRef.current = fullText;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    // If fullText is empty, reset everything
    if (!fullText) {
      setDisplayedText("");
      displayedLengthRef.current = 0;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start or continue typing if there are characters left to type
    if (displayedLengthRef.current < fullText.length && timerRef.current === null) {
      const typeNextChar = () => {
        const currentFullText = fullTextRef.current;

        if (displayedLengthRef.current < currentFullText.length) {
          displayedLengthRef.current++;
          setDisplayedText(currentFullText.slice(0, displayedLengthRef.current));

          // Continue typing if there are more characters
          if (displayedLengthRef.current < currentFullText.length) {
            timerRef.current = window.setTimeout(typeNextChar, speed);
          } else {
            // Reached the end
            timerRef.current = null;
            onCompleteRef.current?.();
          }
        } else {
          // Reached the end
          timerRef.current = null;
          onCompleteRef.current?.();
        }
      };

      typeNextChar();
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fullText, speed]);

  /**
   * Skip to the end of typing animation
   */
  const skipTyping = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    displayedLengthRef.current = fullText.length;
    setDisplayedText(fullText);
    onComplete?.();
  };

  return {
    displayedText,
    isTyping: displayedLengthRef.current < fullText.length,
    skipTyping,
  };
};

