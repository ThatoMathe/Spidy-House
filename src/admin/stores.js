import { useState, useEffect } from 'react';
import Header from './components/header';
import StoreView from './components/StoreView';
import AddStore from './components/AddStore';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';
import { useNotifications } from '../hook/Notification';


const Stores = () => {
  const { settings } = useSettings();
  const [selectedStore, setSelectedStore] = useState(null);
  const [showAddStore, setShowAddStore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { removeNotificationByTitle } = useNotifications();

  removeNotificationByTitle("Stores");
  const fetchStores = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/stores/display-all.php`, {
      credentials: 'include' // Include session/cookies
    });
    if (!res.ok) throw new Error("Failed to fetch stores");
    return res.json();
  };


  const {
    data: stores = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
    refetchInterval: settings.refresh_frequency,
    staleTime: 30000,
  });

  const filteredStores = stores.filter(store =>
    store.StoreName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.StoreLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleViewClick = (store) => {
    setSelectedStore(store);
  };

  const handleCloseView = () => {
    setSelectedStore(null);
    setShowAddStore(false);
  };

  const handleNewClick = () => {
    setShowAddStore(true);
  };


  return (
    <>
        <div className="Custheader">
          <Header title="Stores" />
        </div>

        <div className="Custbody">
          {isLoading && <div className="alert alert-info">Loading all stores...</div>}
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
                data={filteredStores}
                headers={[
                  { label: 'Store ID', key: 'StoreID' },
                  { label: 'Store Name', key: 'StoreName' },
                  { label: 'Store Location', key: 'StoreLocation' },
                  { label: 'Manager Name', key: 'ManagerName' }
                ]}
                filename="stores_export.csv"
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
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light text-nowrap">
                <tr>
                  <th className="text-center">No.</th>
                  <th>Store Name</th>
                  <th>Store Location</th>
                  <th>Manager Name</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store, index) => (
                  <tr key={store.StoreID} className="text-nowrap">
                    <td className="text-center">{index + 1}</td>
                    <td>{store.StoreName}</td>
                    <td>{store.StoreLocation}</td>
                    <td className={store.ManagerName ? '' : 'text-danger'}>
                      {store.ManagerName || 'Unassigned'}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleViewClick(store)}
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
      

      {selectedStore && (
        <StoreView
          store={selectedStore}
          onClose={handleCloseView}
          refetch={refetch}
        />
      )}

      {showAddStore && (
        <AddStore onClose={handleCloseView} refetch={refetch} />
      )}
    </>
  );
};

export default Stores;
