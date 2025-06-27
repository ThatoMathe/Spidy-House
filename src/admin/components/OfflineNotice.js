import React, { useEffect, useState } from 'react';
import { Offline } from 'react-detect-offline';

const OfflineNotice = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || navigator.onLine) return null;

  return (
    <Offline>
      <div
        className="text-white text-center position-fixed bottom-0 w-100 py-2"
        style={{ backgroundColor: '#dc3545', zIndex: 1050 }}
      >
        You are offline
      </div>
    </Offline>
  );
};

export default OfflineNotice;
