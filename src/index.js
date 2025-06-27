// Import React and other modules
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ScrollToTop from './frontend/components/ScrollToTop';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import FrontEnd from './frontend/index'; // frontend routes
import Admin from './admin/index';   // Admin routes
import Account from './account/index';   // Account routes

import { SettingsProvider } from './context/SettingsContext';

// Create a new QueryClient instance
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/*" element={<FrontEnd />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/account/*" element={<Account />} />
              
            </Routes>
          </SettingsProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

root.render(<App />);

// Register service worker (PWA)
serviceWorkerRegistration.register();
