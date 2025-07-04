import { useState, useEffect } from 'react';
import Header from './components/header';
import SupplierView from './components/SupplierView';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';
import AddSupplier from './components/AddSupplier';

const Suppliers = () => {
  const { settings } = useSettings();
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  const fetchSuppliers = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/suppliers/display-all.php`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch suppliers");
    return res.json();
  };

  const {
    data: suppliers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['Suppliers'],
    queryFn: fetchSuppliers,
    refetchInterval: Number(settings.refresh_frequency) || 10000,
    staleTime: 30000,
  });

  const handleViewClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleCloseView = () => {
    setSelectedSupplier(null);
    setShowAddSupplier(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNewClick = () => {
    setShowAddSupplier(true);
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const term = searchTerm.toLowerCase();
    return (
      supplier.SupplierName?.toLowerCase().includes(term) ||
      supplier.SupplierAddress?.toLowerCase().includes(term)
    );
  });

  return (
    <>
        <div className="Custheader">
          <Header title="Suppliers" />
        </div>

        <div className="Custbody">
          {isLoading && <div className="alert alert-info">Loading suppliers...</div>}
          {isError && <div className="alert alert-danger">{error.message}</div>}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="input-group w-50">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or address"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="fas fa-search"></i>
              </button>
            </div>

            <div className="d-flex align-items-center">
              <CSVLink
                data={suppliers}
                headers={[
                  { label: 'Supplier ID', key: 'SupplierID' },
                  { label: 'Supplier Name', key: 'SupplierName' },
                  { label: 'Supplier Address', key: 'SupplierAddress' },
                  { label: 'Created Date', key: 'CreatedDate' }
                ]}
                filename="suppliers_export.csv"
                className="btn btn-outline-success d-flex align-items-center me-2"
              >
                <i className="fas fa-file-csv me-1"></i> CSV
              </CSVLink>

              <button className="btn btn-primary me-2" onClick={handleNewClick}>
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
                  <th>Address</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier, index) => (
                    <tr key={supplier.SupplierID} className="text-nowrap">
                      <td>{index + 1}</td>
                      <td><strong>{supplier.SupplierName}</strong></td>
                      <td>{supplier.SupplierAddress}</td>
                      <td>{supplier.CreatedDate}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleViewClick(supplier)}
                        >
                          More info
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No suppliers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
 

      {selectedSupplier && (
        <SupplierView
          product={selectedSupplier}
          onClose={handleCloseView}
          refetch={refetch}
        />
      )}

      {showAddSupplier && (
        <AddSupplier
          onClose={handleCloseView}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Suppliers;
