import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';

import ProtectedRoute from '../context/ProtectedRoute';
import { ToastContainer } from 'react-toastify';

import MainLayout from './components/main';
import ChatWidget from './components/BotmanWidget';
import SyncStatus from './components/SyncStatus';
import OfflineNotice from './components/OfflineNotice';

// Pages
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import Settings from './settings';
import Users from './users';
import Warehouses from './warehouses';
import Reports from './reports';
import Deliveries from './deliveries';
import BarcodeScanner from './new-items';
import Assistance from './chatbot';
import Products from './products';
import PurchasedOrders from './purchased-orders';
import Inventory from './inventory';
import Suppliers from './suppliers';
import Couriers from './couriers';
import Stores from './stores';
import Categories from './categories';
import Transfers from './transfers';
import Returns from './returns';
import Verify from './2FAuth';
import NotFound from './404';

const queryClient = new QueryClient();

export default function Admin() {
  // Apply dark theme once at startup
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineNotice />
      <Routes>
        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="verify" element={<AuthProvider><Verify /></AuthProvider>} />
        <Route path="register" element={<AuthProvider><Register /></AuthProvider>} />

        {/* Protected Layout Route */}
        <Route path="/" element={
          <AuthProvider>
            {/* <NotificationProvider> */}

            <MainLayout />
            {/* </NotificationProvider> */}
            {/* Global Components */}
            <ChatWidget />
            <SyncStatus />
          </AuthProvider>}>
          {/* Protected Routes inside Main Layout */}
          <Route index element={<ProtectedRoute allowedRoles="admin, manager, staff"><Dashboard /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute allowedRoles="admin, manager, staff"><Dashboard /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute allowedRoles="admin, manager"><Settings /></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute allowedRoles="admin, manager"><Users /></ProtectedRoute>} />

          <Route path="warehouses" element={<ProtectedRoute allowedRoles="admin, manager"><Warehouses /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute allowedRoles="admin, manager"><Categories /></ProtectedRoute>} />
          <Route path="stores" element={<ProtectedRoute allowedRoles="admin, manager"><Stores /></ProtectedRoute>} />
          <Route path="inventory" element={<ProtectedRoute allowedRoles="admin, manager, staff"><Inventory /></ProtectedRoute>} />
          <Route path="assistance" element={<ProtectedRoute allowedRoles="admin, manager, staff"><Assistance /></ProtectedRoute>} />
          <Route path="suppliers" element={<ProtectedRoute allowedRoles="admin, manager"><Suppliers /></ProtectedRoute>} />
          <Route path="purchased-orders" element={<ProtectedRoute allowedRoles="admin, manager"><PurchasedOrders /></ProtectedRoute>} />
          <Route path="couriers" element={<ProtectedRoute allowedRoles="admin, manager"><Couriers /></ProtectedRoute>} />

          <Route path="transfers" element={<ProtectedRoute allowedRoles="admin, manager"><Transfers /></ProtectedRoute>} />
          <Route path="products" element={<ProtectedRoute allowedRoles="admin, manager, staff"><Products /></ProtectedRoute>} />
          <Route path="products/processing" element={<ProtectedRoute allowedRoles="admin, manager, staff"><BarcodeScanner /></ProtectedRoute>} />
          <Route path="deliveries" element={<ProtectedRoute allowedRoles="admin, manager"><Deliveries /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute allowedRoles="admin, manager, staff"><Reports /></ProtectedRoute>} />
          <Route path="returns" element={<ProtectedRoute allowedRoles="admin, manager"><Returns /></ProtectedRoute>} />
          <Route path="404" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/admin/404" />} />
        </Route>
      </Routes>

      <ToastContainer position="bottom-left" />

    </QueryClientProvider>
  );
}
