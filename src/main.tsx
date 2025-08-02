// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import AppRoutes from './AppRoutes.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { StrictMode } from 'react';
import { LoadingProvider } from './LoadingProvider.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: 0,
              },
            }}
            reverseOrder={false}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </LoadingProvider>
  </StrictMode>
);
