import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchNotifications = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/notification/display-all.php`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json(); // { success, overall_total, data }
  };

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 1000 * 30,
  });

  const notifications = data?.data || [];
  const overallTotal = data?.overall_total || 0;
  const role = user?.Role || '';

  // Page-level counts
  const pageCounts = {};
  notifications.forEach((n) => {
    if (n.total > 0) {
      pageCounts[n.title] = { count: n.total };
    }
  });

  // Backend + cache removal
  const removeNotificationByTitle = async (titleToRemove) => {
    try {
      const res = await fetch(`${settings.api_url}/api/v1/notification/delete.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleToRemove }),
      });

      const result = await res.json();

      if (result.success) {
        // Update cache
        queryClient.setQueryData(['notifications'], (oldData) => {
          if (!oldData || !Array.isArray(oldData.data)) return oldData;

          const filteredData = oldData.data.filter((n) => n.title !== titleToRemove);
          const newOverallTotal = filteredData.reduce((sum, n) => sum + (n.total || 0), 0);

          return {
            ...oldData,
            data: filteredData,
            overall_total: newOverallTotal,
          };
        });
      } else {
        console.error('Delete failed:', result.message);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return {
    notifications,
    isLoading,
    error,
    refetch,
    overallTotal,
    pageCounts,
    role,
    removeNotificationByTitle,
    queryClient,
  };
};
