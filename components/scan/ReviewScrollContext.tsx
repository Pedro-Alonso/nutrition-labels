import { createContext, useContext } from 'react';
import type { TextInput } from 'react-native';

export type ScrollToInput = (inputRef: React.RefObject<TextInput | null>) => void;

const ReviewScrollContext = createContext<ScrollToInput | null>(null);

export const ReviewScrollProvider = ReviewScrollContext.Provider;

/** Permite que um campo dentro de uma tela de revisão peça scroll até si mesmo ao ganhar foco. */
export function useReviewScroll(): ScrollToInput | null {
  return useContext(ReviewScrollContext);
}
