import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import Header from './components/header';
import { useNotifications } from '../hook/Notification';

const Dashboard = () => {
  const { settings } = useSettings();
  const { overallTotal } = useNotifications();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cards = [
    { key: 'users', label: 'Users', valueKey: 'users', icon: 'fas fa-users' },
    { key: 'products', label: 'Products', valueKey: 'products', icon: 'fas fa-cube' },
    { key: 'categories', label: 'Categories', valueKey: 'categories', icon: 'fas fa-layer-group' },
    { key: 'stores', label: 'Stores', valueKey: 'stores', icon: 'fas fa-store' },
    { key: 'deliveries', label: 'Deliveries', valueKey: 'deliveries', icon: 'fas fa-shipping-fast' },
    { key: 'stock', label: 'Stock', valueKey: 'stock', icon: 'fas fa-warehouse' },
    { key: 'transfers', label: 'Transfers', valueKey: 'transfers', icon: 'fas fa-exchange-alt' },
    { key: 'suppliers', label: 'Suppliers', valueKey: 'suppliers', icon: 'fas fa-truck-loading' },
    { key: 'customers', label: 'Customers', valueKey: 'customers', icon: 'fas fa-user-friends' },
    { key: 'Orders', label: 'Orders', valueKey: 'purchasingorders', icon: 'fas fa-inbox' },
    { key: 'returns', label: 'Returns', valueKey: 'stockreturns', icon: 'fas fa-undo-alt' },
    { key: 'reports', label: 'Reports', valueKey: 'useractivity', icon: 'fas fa-chart-line' },
  ];

  const { data = {} } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch(`${settings.api_url}/api/v1/dashboard/display-all.php`, {
        credentials: 'include',
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return res.json();
    },
    refetchInterval: Number(settings.refresh_frequency) || 10000,
    staleTime: 30000,
  });

  const isDarkMode = document.body.classList.contains('dark-mode');

  const renderCard = (card) => (
    <div key={card.key} data-id={card.key} className="col-6 col-md-3">
      <div
        className="card p-3 position-relative overflow-hidden"
        style={{
          aspectRatio: isDesktop ? '1 / 0.5' : 'auto',
        }}
      >
        <i className={`${card.icon} position-absolute dashboard-icons`}></i>
        <div className="d-flex flex-column justify-content-between h-100 position-relative" style={{ zIndex: 1 }}>
          <div className="text-start">
            <div className={`fs-3 fw-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {card.valueKey ? data[card.valueKey] ?? '-' : '-'}
            </div>
            <div className={`text-muted ${isDarkMode ? 'text-light' : ''}`}>{card.label}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="Custheader">
        <Header title="Dashboard" />
      </div>

      <div className="Custbody">
        <div className="row g-2 mb-3">
          <div className="col-6 col-md-3">
            <div className="info-card text-center p-3 border rounded shadow-sm">
              <h5 className="fw-bold mb-2">{data.warehouse_name}</h5>
              <div className="mx-auto mb-2" style={{ width: '30px', height: '2px', backgroundColor: '#ccc', borderRadius: '2px' }}></div>
              <small className="text-muted"> Assigned </small>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="info-card text-warning border-warning text-center p-3 border rounded shadow-sm">
              <h5 className="fw-bold mb-2">{data.stock_alert}</h5>
              <div className="mx-auto mb-2" style={{ width: '30px', height: '2px', backgroundColor: '#ccc', borderRadius: '2px' }}></div>
              <small className="text-muted">Stock Alert</small>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="info-card text-danger border-danger text-center p-3 border rounded shadow-sm">
              <h5 className="fw-bold mb-2">{data.out_of_stock}</h5>
              <div className="mx-auto mb-2" style={{ width: '30px', height: '2px', backgroundColor: '#ccc', borderRadius: '2px' }}></div>
              <small className="text-muted">Out Of Stock</small>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="info-card text-success border-success text-center p-3 border rounded shadow-sm">
              <h5 className="fw-bold mb-2">{overallTotal || 0}</h5>
              <div className="mx-auto mb-2" style={{ width: '30px', height: '2px', backgroundColor: '#ccc', borderRadius: '2px' }}></div>
              <small className="text-muted">Notifications</small>
            </div>
          </div>
        </div>

        <hr className="my-3" style={{ height: '5px', backgroundColor: 'gray', border: 'none' }} />

        <div className="row g-2">
          {cards.map(renderCard)}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
