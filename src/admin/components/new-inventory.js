import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useSettings } from '../../context/SettingsContext';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

const NewInventory = ({ onClose, onSuccess }) => {
  const { settings } = useSettings();
  const [productData, setProductData] = useState({
    supplierID: '',
    WarehouseID: '',
    minStock: 1,
    maxStock: 10,
  });

  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const isDarkMode = document.body.classList.contains("dark-mode");

  const selectTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      neutral0: isDarkMode ? "#2c2c2c" : "#ffffff",
      neutral80: isDarkMode ? "#f0f0f0" : "#333333",
      primary25: isDarkMode ? "#444" : "#f0f8ff",
      primary: isDarkMode ? "#5e81ac" : "#0d6efd",
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

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await fetch(`${settings.api_url}/api/v1/warehouses/display-all.php`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setWarehouses(data);
      } catch (err) {
        toast.error('Failed to load warehouses');
      }
    };

    const fetchSuppliers = async () => {
      try {
        const res = await fetch(`${settings.api_url}/api/v1/suppliers/display-all.php`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        toast.error('Failed to load suppliers');
      }
    };

    fetchWarehouses();
    fetchSuppliers();
  }, [settings.api_url]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.WarehouseID || !productData.supplierID) {
      toast.error('Please select both Warehouse and Supplier');
      return;
    }

    const newInventory = {
      ProductID: null,
      SupplierID: productData.supplierID,
      WarehouseID: productData.WarehouseID,
      QuantityAvailable: 0,
      MinimumStockLevel: productData.minStock,
      MaximumStockLevel: productData.maxStock,
      LastOrderDate: null,
    };

    try {
      const res = await fetch(`${settings.api_url}/api/v1/inventory/create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Include cookies/session
        body: JSON.stringify(newInventory),
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Inventory created successfully!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(result.message || 'Failed to save inventory.');
      }
    } catch (err) {
      toast.error('An error occurred while saving the inventory.');
    }

  };

  const supplierOptions = suppliers.map(s => ({ value: s.SupplierID, label: s.SupplierName }));
  const warehouseOptions = warehouses.map(w => ({ value: w.WarehouseID, label: w.WarehouseName }));

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow rounded">
          <div className="modal-header text-black">
            <h5 className="modal-title">New Inventory</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="container">
                <div className="mb-3">
                  <label className="form-label">Warehouse</label>
                  <Select
                    name="WarehouseID"
                    options={warehouseOptions}
                    value={warehouseOptions.find(opt => opt.value === productData.WarehouseID)}
                    onChange={(opt) => setProductData({ ...productData, WarehouseID: opt.value })}
                    placeholder="Select Warehouse"
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
                    onChange={(opt) => setProductData({ ...productData, supplierID: opt.value })}
                    placeholder="Select Supplier"
                    theme={selectTheme}
                    styles={selectStyles}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Minimum Stock</label>
                  <div className="input-group">
                    <button type="button" className="btn btn-outline-secondary" onClick={() =>
                      setProductData(prev => ({ ...prev, minStock: Math.max(1, prev.minStock - 1) }))
                    }>-</button>
                    <input
                      type="number"
                      name="minStock"
                      className="form-control text-center"
                      value={productData.minStock}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={() =>
                      setProductData(prev => ({ ...prev, minStock: prev.minStock + 1 }))
                    }>+</button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Maximum Stock</label>
                  <div className="input-group">
                    <button type="button" className="btn btn-outline-secondary" onClick={() =>
                      setProductData(prev => ({
                        ...prev,
                        maxStock: Math.max(prev.minStock + 1, prev.maxStock - 1)
                      }))
                    }>-</button>
                    <input
                      type="number"
                      name="maxStock"
                      className="form-control text-center"
                      value={productData.maxStock}
                      onChange={handleChange}
                      min={productData.minStock + 1}
                      required
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={() =>
                      setProductData(prev => ({ ...prev, maxStock: prev.maxStock + 1 }))
                    }>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewInventory;
