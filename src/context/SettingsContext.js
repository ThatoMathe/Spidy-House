import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);
const apiUrl = 'http://localhost:8000';
// API calls
// Fetch general settings from the API
const fetchSettings = async () => {
  const res = await fetch(`${apiUrl}/api/v1/settings/general.php`);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to load settings: ${error}`);
  }

  return res.json();
};

// Update general settings via the API
const updateSettings = async (newSettings) => {
  const res = await fetch(`${apiUrl}/api/v1/settings/general.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSettings),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.message || 'Update failed');
  }

  return result;
};


export const SettingsProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: settings, isPending, error } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  const { mutate: saveSettings, isPending: isSaving } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] }); // refetch updated settings
    },
  });

  return (
    <SettingsContext.Provider value={{ settings, isLoading: isPending, saveSettings, isSaving, error }}>
      {!isPending && children}
    </SettingsContext.Provider>
  );
};

export const AppWrapper = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>{children}</SettingsProvider>
    </QueryClientProvider>
  );
};
