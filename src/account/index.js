import '../admin/styles.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../context/ProtectedRoute';
import { ToastContainer } from 'react-toastify';

import MainLayout from '../admin/components/main';
import ChatWidget from '../admin/components/BotmanWidget';
import SyncStatus from '../admin/components/SyncStatus';
import OfflineNotice from '../admin/components/OfflineNotice';

import Profile from './profile';
import Settings from './settings';
import NotFound from '../admin/404';

const queryClient = new QueryClient();

export default function account() {
  // Apply dark theme once at startup
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  return (
    <QueryClientProvider client={queryClient}>
          <OfflineNotice />
          <Routes>

            <Route path="/" element={
              <AuthProvider>
                <MainLayout />
                {/* Global Components */}
                <ChatWidget />
                <SyncStatus />
              </AuthProvider>}>
              {/* Protected Routes inside Main Layout */}
              <Route index element={<ProtectedRoute allowedRoles="admin, manager, staff"><Profile /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute allowedRoles="admin, manager, staff"><Profile /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute allowedRoles="admin, manager, staff"><Settings /></ProtectedRoute>} />
              
              <Route path="404" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="../admin/404" />} />
            </Route>
          </Routes>

          <ToastContainer position="bottom-left" />
       
    </QueryClientProvider>
  );
}
