import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { Provider } from 'react-redux';
import store from "./store/store";
import { QueryProvider } from '@/components/providers/query-provider';
import './index.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <BrowserRouter>
          <NuqsAdapter>
            <App />
          </NuqsAdapter>
        </BrowserRouter>
      </QueryProvider>
    </Provider>
  </StrictMode>
);
