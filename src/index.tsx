import React, { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next'; // Import I18nextProvider

import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary'; // Import ErrorBoundary
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import i18n from './i18n'; // Import i18n
import { initializeOpenTelemetry } from './observability/otel'; // Import initializeOpenTelemetry
import reportWebVitals from './reportWebVitals'; // Import reportWebVitals
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const GlobalErrorLogger = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global Error (onerror):', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString(),
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Global Error (unhandledrejection):', {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
  return null;
};

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <CssBaseline />
              <GlobalErrorLogger /> {/* Add global error logger */}
              <ErrorBoundary> {/* Wrap App with ErrorBoundary */}
                <I18nextProvider i18n={i18n}> {/* Wrap App with I18nextProvider */}
                  <App />
                </I18nextProvider>
              </ErrorBoundary>
              <Toaster position="top-right" />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
};

const enableMocking = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
};

// Initialize OpenTelemetry before rendering the app
initializeOpenTelemetry();

enableMocking()
  .catch((error) => {
    console.error('Failed to start the Mock Service Worker', error);
  })
  .finally(() => {
    renderApp();
    reportWebVitals(console.log); // Call reportWebVitals
  });
