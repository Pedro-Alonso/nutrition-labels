import { useCallback, useRef } from 'react';
import { ScrollView } from 'react-native';
import type { ScrollToInput } from '@/components/scan/ReviewScrollContext';

const FOCUS_OFFSET = 24;
const SCROLL_DELAY_MS = 100;

/** Rola a ScrollView de uma tela de revisão para deixar o campo focado visível acima do teclado. */
export function useReviewAutoScroll() {
  const scrollRef = useRef<ScrollView>(null);

  const scrollToInput = useCallback<ScrollToInput>((inputRef) => {
    // Aguarda a abertura do teclado (e o ajuste do KeyboardAvoidingView) antes de medir.
    setTimeout(() => {
      const input = inputRef.current;
      const scrollView = scrollRef.current;
      const target = scrollView?.getNativeScrollRef();
      if (!input || !scrollView || !target) return;

      input.measureLayout(
        target,
        (_x, y) => scrollView.scrollTo({ y: Math.max(0, y - FOCUS_OFFSET), animated: true }),
        () => {},
      );
    }, SCROLL_DELAY_MS);
  }, []);

  return { scrollRef, scrollToInput };
}
