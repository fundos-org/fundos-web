import { createContext } from 'react';

type LoadingContextType = {
  showLoader: () => void;
  hideLoader: () => void;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);
