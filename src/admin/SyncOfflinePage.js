import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

const LOCAL_STORAGE_KEY = 'unsyncedProducts';

const SyncOfflinePage = () => {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [queue, setQueue] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
  );

  const handleSync = async () => {
    setSyncing(true);
    setMessage('Syncing in progress...');

    const remaining = [];

    for (const item of queue) {
      const formData = new FormData();
      const { productData, inventory } = item;

      for (const [key, value] of Object.entries(productData)) {
        formData.append(key, value);
      }
      formData.append('supplierID', inventory.SupplierID);
      formData.append('inventoryID', inventory.InventoryID);
      formData.append('WarehouseID', inventory.WarehouseID);
      formData.append('LastOrderDate', new Date().toISOString().slice(0, 19).replace('T', ' '));

      try {
const res = await fetch(`${settings.api_url}/api/v1/products/process.php`, {
  method: 'POST',
  body: formData,
  credentials: 'include' // Include session/cookies
});


        const result = await res.json();
        if (!result.success) throw new Error(result.message);
      } catch (err) {
        console.error('Failed to sync:', err);
        remaining.push(item);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remaining));
    setQueue(remaining);
    setMessage(remaining.length === 0 ? 'All items synced successfully!' : `Some items failed to sync. (${remaining.length})`);
    setSyncing(false);
  };

  return (
    <div className="container mt-5">
      <h4>Offline Sync Queue</h4>
      <p>{queue.length} item(s) pending sync</p>
      <button className="btn btn-success mb-3" onClick={handleSync} disabled={syncing}>
        {syncing ? 'Syncing...' : 'Sync All Now'}
      </button>
      {message && <div className="alert alert-info">{message}</div>}
      <ul className="list-group">
        {queue.map((item, index) => (
          <li key={index} className="list-group-item">
            <strong>{item.productData.productName}</strong> — Qty: {item.productData.productQuantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SyncOfflinePage;
