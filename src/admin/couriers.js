import { useState, useEffect } from 'react';
import Header from './components/header';
import CourierView from './components/courierView'; // Fix: capitalized component name
import { useQuery } from '@tanstack/react-query';
import AddCourier from './components/AddCourier';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';

const Couriers = () => {
  const { settings } = useSettings();
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showAddCourier, setShowAddCourier] = useState(false);

  const fetchCouriers = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/couriers/display-all.php`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch couriers");
    return res.json();
  };

  const {
    data: couriers = [], // Fix: lowercase for consistent usage
    isLoading,
    isError,
    error,
    refetch, // Add refetch here
  } = useQuery({
    queryKey: ['Couriers'],
    queryFn: fetchCouriers,
    refetchInterval: Number(settings.refresh_frequency) || 10000,
    staleTime: 30000,
  });


  const handleViewClick = (courier) => {
    setSelectedCourier(courier);
  };

  const handleCloseView = () => {
    setSelectedCourier(null);
    setShowAddCourier(false);
  }

  const handleNewClick = () => {
    setShowAddCourier(true);
  };


  return (
    <>
      <div className="Custheader">
        <Header title="Couriers" />
      </div>

      <div className="Custbody">
        {isLoading && <div className="alert alert-info">Loading all couriers...</div>}
        {isError && <div className="alert alert-danger">{error.message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email or courier code"
              aria-label="Search"
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="d-flex align-items-center">
            <CSVLink
              data={couriers}
              headers={[
                { label: 'Courier ID', key: 'CourierID' },
                { label: 'Courier Name', key: 'CourierName' },
                { label: 'Address', key: 'Address' },
                { label: 'Contact Number', key: 'ContactNumber' }
              ]}
              filename="couriers_export.csv"
              className="btn btn-outline-success d-flex align-items-center me-2"
            >
              <i className="fas fa-file-csv me-1"></i> CSV
            </CSVLink>
            <button
              className="btn btn-outline-primary btn-primary me-2"
              onClick={handleNewClick}
            >
              <i className="fas fa-plus me-1"></i> Add
            </button>
          </div>

        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light text-nowrap">
              <tr>
                <th>Courier ID</th>
                <th>Courier Name</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {couriers.map((courier) => (
                <tr key={courier.CourierID} className="text-nowrap">
                  <td>{courier.CourierID}</td>
                  <td>{courier.CourierName}</td>
                  <td>{courier.Address}</td>
                  <td>{courier.ContactNumber}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleViewClick(courier)}
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

      {selectedCourier && (
        <CourierView
          courier={selectedCourier}
          onClose={handleCloseView}
          refetch={refetch} // Pass refetch to UserView
        />
      )}
      {showAddCourier && (
        <AddCourier onClose={handleCloseView} refetch={refetch} />
      )}
    </>
  );
};

export default Couriers;
