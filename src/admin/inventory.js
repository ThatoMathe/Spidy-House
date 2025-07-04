import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from './components/header';
import ViewInventory from './components/view-inventory';
import NewInventory from './components/new-inventory';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';
import { useNotifications } from '../hook/Notification';


const Inventory = () => {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [showNewInventory, setShowNewInventory] = useState(false); // fixed default to false
  const queryClient = useQueryClient();
  const { removeNotificationByTitle } = useNotifications();

  removeNotificationByTitle("Inventory");

  const fetchInventory = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/inventory/display-all.php`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  };

  const {
    data: Inventory = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
    refetchInterval: Number(settings.refresh_frequency) || 10000,
    staleTime: 30000,
  });


  const handleNewInventorySuccess = () => {
    queryClient.invalidateQueries(['inventory']);
    setShowNewInventory(false);
    setSelectedInventory(null);
  };

  const filteredInventory = searchTerm.trim() === ''
    ? Inventory
    : Inventory.filter((item) =>
    (item.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ProductCode?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <>
      <div className="Custheader">
        <Header title="Inventory" />
      </div>

      <div className="Custbody">
        {isLoading && <div className="alert alert-info">Loading inventory...</div>}
        {isError && <div className="alert alert-danger">{error.message}</div>}

        {/* Search + Add */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, barcode or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="d-flex align-items-center">

            <CSVLink
              data={filteredInventory}
              headers={[
                { label: 'Inventory ID', key: 'InventoryID' },
                { label: 'Product Name', key: 'ProductName' },
                { label: 'Barcode', key: 'BarCode' },
                { label: 'Product Code', key: 'ProductCode' },
                { label: 'Category', key: 'CategoryName' },
                { label: 'Supplier', key: 'SupplierName' },
                { label: 'Warehouse', key: 'WarehouseName' },
                { label: 'Quantity', key: 'QuantityAvailable' },
                { label: 'Min Stock', key: 'MinimumStockLevel' },
                { label: 'Max Stock', key: 'MaximumStockLevel' },
                { label: 'Last Order Date', key: 'LastOrderDate' }
              ]}
              filename="inventory_export.csv"
              className="btn btn-outline-success d-flex align-items-center me-2"
            >
              <i className="fas fa-file-csv me-1"></i> CSV
            </CSVLink>

            <button className="btn btn-primary d-flex align-items-center"
              onClick={() => {
                setShowNewInventory(true);
                setSelectedInventory(null);
              }}
            >
              <i className="fas fa-plus me-1"></i> Add
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light text-nowrap">
              <tr>
                <th>Product Name | <span className="text-muted">Barcode</span></th>
                <th>Stock</th>
                <th>Supplier</th>
                <th>Warehouse</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan="5" className="text-muted text-center">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((product) => {
                  const stock = parseInt(product.QuantityAvailable ?? 0);
                  const min = parseInt(product.MinimumStockLevel ?? 0);
                  const max = parseInt(product.MaximumStockLevel ?? 999999);

                  let stockLabel = null;
                  if (stock === 0) stockLabel = <small style={{ color: "red" }}>Attention</small>;
                  else if (stock < min) stockLabel = <small style={{ color: "orange" }}>Low Stock</small>;
                  else if (stock > max) stockLabel = <small style={{ color: "blue" }}>Overload</small>;

                  return (
                    <tr key={product.InventoryID} className="text-nowrap">
                      <td>
                        {product.ProductName ? (
                          <>
                            <span>{product.ProductName}</span>
                            <hr className="m-0 p-0" />
                            <small className="text-muted">{product.BarCode ?? '-'}</small>
                          </>
                        ) : (
                          <span style={{ color: "red" }}>Not Captured</span>
                        )}
                      </td>
                      <td>
                        {stock}
                        {stockLabel && (
                          <>
                            <hr className="m-0 p-0" />
                            {stockLabel}
                          </>
                        )}
                      </td>
                      <td>{product.SupplierName || <span style={{ color: "red" }}>N/A</span>}</td>
                      <td>{product.WarehouseName || <span style={{ color: "red" }}>N/A</span>}</td>
                      <td>
                        {!product.ProductName ? (
                          <Link className="btn btn-sm btn-success" to={`/admin/products/processing?id=${product.InventoryID}`}>
                            Process
                          </Link>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => {
                              setSelectedInventory(product);
                              setShowNewInventory(false);
                            }}
                          >
                            More info
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

      </div>
      {/* Modals */}
      {selectedInventory && (
        <ViewInventory
          inventory={selectedInventory}
          onClose={() => setSelectedInventory(null)}
          onSuccess={handleNewInventorySuccess}
        />
      )}
      {showNewInventory && (
        <NewInventory
          onClose={() => setShowNewInventory(false)}
          onSuccess={handleNewInventorySuccess}
        />
      )}
    </>


  );
};

export default Inventory;
