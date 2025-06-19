import { LoadingContext } from '@/LoadingProvider';
import { useContext } from 'react';

// Hook to access loader controls
export function useLoader() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoadingProvider');
  }
  return context;
}
