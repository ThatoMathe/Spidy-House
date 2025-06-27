import { useState, useEffect } from 'react';
import Header from './components/header';
import DeliveryView from './components/deliveryView';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';

const Deliveries = () => {
  const { settings } = useSettings();
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchDeliveries = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/deliveries/display-all.php`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  };

  const {
    data: deliveries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['deliveries'],
    queryFn: fetchDeliveries,
    refetchInterval: settings.refresh_frequency, // refresh every 60 seconds (optional)
    staleTime: 30000, // data considered fresh for 30 seconds
  });


  const filteredDeliveries = deliveries.filter((delivery) =>
  (delivery.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.CourierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.CustomerID?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="Custheader">
          <Header title="Deliveries" />
        </div>

        <div className="Custbody">
          {isLoading && <div className="alert alert-info">Loading deliveries...</div>}
          {isError && <div className="alert alert-danger">{error.message}</div>}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="input-group w-50">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Delivery, barcode or category"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <div className="d-flex align-items-center">
              <CSVLink
                data={filteredDeliveries}
                headers={[
                  { label: 'Delivery ID', key: 'DeliveryID' },
                  { label: 'Customer ID', key: 'CustomerID' },
                  { label: 'Customer Name', key: 'CustomerName' },
                  { label: 'Customer Address', key: 'CustomerAddress' },
                  { label: 'Delivery Address', key: 'DeliveryAddress' },
                  { label: 'Courier Name', key: 'CourierName' },
                  { label: 'Status', key: 'Status' }
                ]}
                filename="deliveries_export.csv"
                className="btn btn-outline-success d-flex align-items-center me-2"
              >
                <i className="fas fa-file-csv me-1"></i> CSV
              </CSVLink>
            </div>

          </div>

          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-light text-nowrap">
                <tr>
                  <th>ID</th>
                  <th>Customer Name | <span className="text-muted">Address</span></th>
                  <th>Address</th>
                  <th>Courier Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.DeliveryID} className="text-nowrap">
                    <td>{delivery.CustomerID}</td>
                    <td>
                      <strong>{delivery.CustomerName}</strong>
                      <hr className="m-0 p-0" />
                      <small className="text-muted">{delivery.CustomerAddress}</small>
                    </td>
                    <td>{delivery.DeliveryAddress}</td>
                    <td>{delivery.CourierName}</td>
                    <td>{delivery.Status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => setSelectedDelivery(delivery)}
                      >
                        More info
                      </button>
                      {/* <button className="btn btn-sm btn-warning me-2">Select</button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
     

      {selectedDelivery && (
        <>
          <DeliveryView
            delivery={selectedDelivery}
            onClose={() => setSelectedDelivery(null)}
          />
        </>
      )}

    </>
  );
};

export default Deliveries;
