import { ReactNode, useState } from 'react';
import { LoadingOverlay } from '@achmadk/react-loading-overlay';
import { LoadingContext } from './LoadingContext';
import { MutatingDots } from 'react-loader-spinner';

// Loading Provider to manage global loading state
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader }}>
      <LoadingOverlay
        active={isLoading}
        spinner={<MutatingDots color="#fff" secondaryColor="#fff" />}
        text="Please wait..."
      >
        {children}
      </LoadingOverlay>
    </LoadingContext.Provider>
  );
}
export { LoadingContext };
