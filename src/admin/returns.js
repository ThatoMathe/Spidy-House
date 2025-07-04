import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import Header from './components/header';
import Sidebar from './components/sidebar';
import { useNotifications } from '../hook/Notification';

const ReturnsReport = () => {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');

  const { removeNotificationByTitle } = useNotifications();

  removeNotificationByTitle("Returns");

  const fetchReturns = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/returns/display-all.php`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error("Failed to fetch returns");
    return res.json();
  };

  const {
    data: returns = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['returns'],
    queryFn: fetchReturns,
    refetchInterval: Number(settings.refresh_frequency) || 10000,
    staleTime: 30000,
  });

  const filteredReturns = returns.filter((item) =>
    item.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ReasonForReturn?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <div className="Custheader">
        <Header title="Returned Stock" />
      </div>

      <div className="Custbody">
        {isLoading && <div className="alert alert-info">Loading returned stock...</div>}
        {isError && <div className="alert alert-danger">{error.message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Search by product or reason"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <CSVLink
            data={filteredReturns}
            headers={[
              { label: 'Product Name', key: 'ProductName' },
              { label: 'Quantity', key: 'Quantity' },
              { label: 'Reason for Return', key: 'ReasonForReturn' },
              { label: 'Warehouse/Inventory ID', key: 'InventoryID' },
            ]}
            filename="returns_export.csv"
            className="btn btn-outline-success d-flex align-items-center me-2"
          >
            <i className="fas fa-file-csv me-1"></i> CSV
          </CSVLink>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light text-nowrap">
              <tr>
                <th>No.</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Reason for Return</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((item, index) => (
                <tr key={item.StockReturnID} className="text-nowrap">
                  <td>{index + 1}</td>
                  <td>{item.ProductName}</td>
                  <td>{item.Quantity}</td>
                  <td>{item.ReasonForReturn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReturnsReport;
