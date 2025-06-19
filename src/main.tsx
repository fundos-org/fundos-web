// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import AppRoutes from './AppRoutes.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './app/store.ts';
import { Toaster } from 'react-hot-toast';
import { StrictMode } from 'react';
import { LoadingProvider } from './LoadingProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LoadingProvider>
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
      </LoadingProvider>
    </Provider>
  </StrictMode>
);
