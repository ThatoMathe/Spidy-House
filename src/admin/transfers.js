import { useState, useEffect } from 'react';
import Header from './components/header';
import TransferView from './components/TransferView';
import AddTransfer from './components/AddTransfer';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';

const Transfers = () => {
  const { settings } = useSettings();
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showAddTransfer, setShowAddTransfer] = useState(false);

  const fetchTransfers = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/transfers/display-all.php`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch transfers");
    return res.json();
  };

  const {
    data: transfers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['Transfer'],
    queryFn: fetchTransfers,
    refetchInterval: Number(settings.refresh_frequency) || 10000,
    staleTime: 30000,
  });

  const handleViewClick = (transfer) => {
    setSelectedTransfer(transfer);
  };

  const handleCloseView = () => {
    setSelectedTransfer(null);
    refetch();
    setShowAddTransfer(false);
  };

  return (
    <>
      <div className="Custheader">
        <Header title="Transfers" />
      </div>

      <div className="Custbody">
        {isLoading && <div className="alert alert-info">Loading all transfers...</div>}
        {isError && <div className="alert alert-danger">{error.message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email or transfer code"
              aria-label="Search"
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="d-flex align-items-center">
            <CSVLink
  data={transfers}
  headers={[
    { label: 'Transfer ID', key: 'TransferID' },
    { label: 'Product Name', key: 'ProductName' },
    { label: 'Warehouse Name', key: 'WarehouseName' },
    { label: 'Quantity', key: 'TransferQuantity' },
    { label: 'Received Date', key: 'ReceivedDate' },
    { label: 'To Warehouse', key: 'ToWarehouseName' },
    { label: 'To Store', key: 'StoreName' }
  ]}
  filename="transfers_report.csv"
  className="btn btn-outline-success d-flex align-items-center me-2"
>
  <i className="fas fa-file-csv me-1"></i>CSV
</CSVLink>

            <button className="btn btn-outline-primary btn-primary me-2" onClick={() => setShowAddTransfer(true)}>
              <i className="fas fa-plus me-1"></i> New
            </button>
          </div>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light text-nowrap">
              <tr>
                <th>No.</th>
                <th>Product</th>
                <th>Warehouse</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted text-center py-3">
                    No transfers found.
                  </td>
                </tr>
              ) : (
                transfers.map((transfer, index) => (
                  <tr key={transfer.TransferID} className="text-nowrap">
                    <td>{index + 1}</td>
                    <td>{transfer.ProductName}</td>
                    <td>{transfer.WarehouseName}</td>
                    <td>{transfer.TransferQuantity}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleViewClick(transfer)}
                      >
                        More info
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>


      {selectedTransfer && (
        <TransferView
          transfer={selectedTransfer}
          onClose={handleCloseView}
          refetch={refetch}
        />
      )}

      {showAddTransfer && (
        <AddTransfer onClose={handleCloseView} refetch={refetch} />
      )}
    </>
  );
};

export default Transfers;
