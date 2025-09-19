import { createRoot } from 'react-dom/client';
import AppRoutes from './AppRoutes.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { StrictMode } from 'react';
import { LoadingProvider } from './LoadingProvider.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NotificationProvider } from './components/custom/NotificationProvider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider position="top-right">
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
        </NotificationProvider>
      </QueryClientProvider>
    </LoadingProvider>
  </StrictMode>
);
