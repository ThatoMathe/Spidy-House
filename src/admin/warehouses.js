import { useState, useEffect } from 'react';
import Header from './components/header';
import WarehouseView from './components/WarehouseView';
import AddWarehouse from './components/AddWarehouse';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';
import { useNotifications } from '../hook/Notification';

const Warehouses = () => {
  const { settings } = useSettings();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { removeNotificationByTitle } = useNotifications();

  removeNotificationByTitle("Warehouse");
  const fetchWarehouses = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/warehouses/display-all.php`, {
      credentials: 'include' // Include session/cookies
    });
    if (!res.ok) throw new Error("Failed to fetch warehouses");
    return res.json();
  };

  const {
    data: warehouses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['warehouses'],
    queryFn: fetchWarehouses,
    refetchInterval: settings.refresh_frequency,
    staleTime: 30000,
  });

  const filteredWarehouses = warehouses.filter(w =>
    w.WarehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.LocationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClick = (warehouse) => setSelectedWarehouse(warehouse);
  const handleCloseView = () => {
    setSelectedWarehouse(null);
    setShowAddWarehouse(false);
  };
  const handleNewClick = () => setShowAddWarehouse(true);

  return (
    <>
      <div className="Custheader">
        <Header title="Warehouses" />
      </div>

      <div className="Custbody">
        {isLoading && <div className="alert alert-info">Loading all warehouses...</div>}
        {isError && <div className="alert alert-danger">{error.message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or location"
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
              data={filteredWarehouses}
              headers={[
                { label: 'ID', key: 'WarehouseID' },
                { label: 'Name', key: 'WarehouseName' },
                { label: 'Location', key: 'LocationName' },
                { label: 'Address', key: 'LocationAddress' }
              ]}
              filename="warehouses_export.csv"
              className="btn btn-outline-success d-flex align-items-center me-2"
            >
              <i className="fas fa-file-csv me-1"></i> CSV
            </CSVLink>

            <button className="btn btn-outline-primary btn-primary me-2" onClick={handleNewClick}>
              <i className="fas fa-plus me-1"></i> Add
            </button>
          </div>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light text-nowrap">
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Location</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWarehouses.map((warehouse, index) => (
                <tr key={warehouse.WarehouseID} className="text-nowrap">
                  <td>{index + 1}</td>
                  <td>{warehouse.WarehouseName}</td>
                  <td>{warehouse.LocationName}</td>
                  <td>{warehouse.LocationAddress}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleViewClick(warehouse)}
                    >
                      More info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedWarehouse && (
        <WarehouseView
          warehouse={selectedWarehouse}
          onClose={handleCloseView}
          refetch={refetch}
        />
      )}

      {showAddWarehouse && (
        <AddWarehouse onClose={handleCloseView} refetch={refetch} />
      )}
    </>
  );
};

export default Warehouses;
