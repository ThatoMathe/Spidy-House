import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { settings } = useSettings();
  const queryClient = useQueryClient();
  const location = useLocation();

  const excludedPaths = ['/admin/login', '/admin/verify'];
  const isExcluded = excludedPaths.includes(location.pathname);

  const fetchSession = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/auth/check-session.php`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!data.loggedIn) throw new Error('Not logged in');
    return data.user;
  };

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    enabled: !isExcluded,
    retry: false,
    cacheTime: 5 * 60 * 1000,        // Cache session for 5 mins
    staleTime: 2 * 60 * 1000,        // Avoid refetching too often
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const login = (userData) => {
    queryClient.setQueryData(['session'], userData);
  };

  const logout = async () => {
    await fetch(`${settings.api_url}/api/v1/auth/logout.php`, {
      method: 'POST',
      credentials: 'include',
    });
    queryClient.removeQueries(['session']);
  };

  // Avoid spinner on excluded pages
  if (!isExcluded && isLoading) return <LoadingSpinner />;

  return (
    <AuthContext.Provider value={{ user, login, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const LoadingSpinner = () => (
  <div className="loading-container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="ms-3">Loading session...</p>
  </div>
);
