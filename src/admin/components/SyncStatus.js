import React, { useEffect, useState } from 'react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import { useSettings } from '../../context/SettingsContext';

const SyncStatus = () => {
  const { settings } = useSettings();
  const isFetching = useIsFetching();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isFetching > 0) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isFetching]);

  if (!visible) return null;

  return (
    <div style={styles.container}>
      <small style={styles.text}>Syncing{isFetching > 1 ? ` [${isFetching}]` : ''}...</small>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '16px',
    left: '16px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.70rem',
    zIndex: 9999,
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  }
};

export default SyncStatus;
