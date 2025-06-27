import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useSettings } from '../../context/SettingsContext';

const NewInventory = ({ onClose, onSuccess }) => {
const { settings } = useSettings();
  const [productData, setProductData] = useState({
    supplierID: '',
    WarehouseID: '',
    minStock: 1,
    maxStock: 10,
  });
    const isDarkMode = document.body.classList.contains("dark-mode");
  const selectTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      neutral0: isDarkMode ? "#2c2c2c" : "#ffffff",      // control background
      neutral80: isDarkMode ? "#f0f0f0" : "#333333",      // text
      primary25: isDarkMode ? "#444" : "#f0f8ff",         // option hover
      primary: isDarkMode ? "#5e81ac" : "#0d6efd",        // highlight
    },
  });

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "#2c2c2c" : "#fff",
      color: isDarkMode ? "#eee" : "#333",
      borderColor: isDarkMode ? "#555" : "#ccc",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? "#eee" : "#333",
    }),
    input: (base) => ({
      ...base,
      color: isDarkMode ? "#eee" : "#333",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "#2c2c2c" : "#fff",
      color: isDarkMode ? "#eee" : "#333",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? isDarkMode ? "#3a3a3a" : "#f2f2f2"
        : "transparent",
      color: isDarkMode ? "#eee" : "#333",
    }),
  };

  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');

useEffect(() => {
  fetch(`${settings.api_url}/api/v1/warehouses/display-all.php`, {
    credentials: 'include', // Include cookies/session
  })
    .then((res) => res.json())
    .then((data) => setWarehouses(data))
    .catch((err) => {
      console.error('Error fetching warehouses:', err);
      setError('Failed to load warehouses.');
    });

  fetch(`${settings.api_url}/api/v1/suppliers/display-all.php`, {
    credentials: 'include', // Include cookies/session
  })
    .then((res) => res.json())
    .then((data) => setSuppliers(data))
    .catch((err) => {
      console.error('Error fetching suppliers:', err);
      setError('Failed to load suppliers.');
    });
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newInventory = {
    ProductID: null, // Adjust if you are going to select a product
    SupplierID: productData.supplierID,
    WarehouseID: productData.WarehouseID,
    QuantityAvailable: 0,
    MinimumStockLevel: productData.minStock,
    MaximumStockLevel: productData.maxStock,
    LastOrderDate: null,
  };

  try {
    const response = await fetch(`${settings.api_url}/api/v1/inventory/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInventory),
    });

    const result = await response.json();

    if (result.success) {
      toast.success('Inventory created successfully!');
      if (typeof onSuccess === 'function') onSuccess(); // <-- trigger reload in parent
      onClose(); // Close the modal
    } else {
      toast.error(result.message || 'Failed to save inventory.');
    }
  } catch (error) {
    console.error('Submission error:', error);
     toast.error('An error occurred while saving the inventory.');
  }
};


  const supplierOptions = suppliers.map((sup) => ({
    value: sup.SupplierID,
    label: sup.SupplierName,
  }));

  const warehouseOptions = warehouses.map((wh) => ({
    value: wh.WarehouseID,
    label: wh.WarehouseName,
  }));


  return (
    <>
<div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
  <div className="modal-dialog modal-lg modal-dialog-centered" role="document">

        
        <div className="modal-content shadow rounded">
          <div className="modal-header text-black">
              <h5 className="modal-title">New Inventory</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="container">
                <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Warehouse</label>
                  <Select
                    name="WarehouseID"
                    options={warehouseOptions}
                    value={warehouseOptions.find(opt => opt.value === productData.WarehouseID)}
                    onChange={(selectedOption) =>
                      setProductData({ ...productData, WarehouseID: selectedOption.value })
                    }
                    placeholder="Select Warehouse"
                    isSearchable
                    theme={selectTheme}
                    styles={selectStyles}
                  />

                </div>

                <div className="mb-3">
                  <label className="form-label">Supplier</label>
                  <Select
                    name="supplierID"
                    options={supplierOptions}
                    value={supplierOptions.find(opt => opt.value === productData.supplierID)}
                    onChange={(selectedOption) =>
                      setProductData({ ...productData, supplierID: selectedOption.value })
                    }
                    placeholder="Select Supplier"
                    isSearchable
                    theme={selectTheme}
                    styles={selectStyles}
                  />
                </div>

                {/* Minimum Stock */}
                <div className="mb-3">
                  <label className="form-label">Minimum Stock</label>
                  <div className="input-group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setProductData((prev) => ({
                          ...prev,
                          minStock: Math.max(1, prev.minStock - 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="minStock"
                      className="form-control text-center"
                      value={productData.minStock}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setProductData((prev) => ({
                          ...prev,
                          minStock: prev.minStock + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Maximum Stock */}
                <div className="mb-3">
                  <label className="form-label">Maximum Stock</label>
                  <div className="input-group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setProductData((prev) => ({
                          ...prev,
                          maxStock: Math.max(prev.minStock + 1, prev.maxStock - 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="maxStock"
                      className="form-control text-center"
                      value={productData.maxStock}
                      onChange={handleChange}
                      min={productData.minStock + 1}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setProductData((prev) => ({
                          ...prev,
                          maxStock: prev.maxStock + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                </form>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
      </div>
    </div>
</>
  );
};

export default NewInventory;
