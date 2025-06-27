import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useSettings } from '../../context/SettingsContext';

const InventoryView = ({ inventory, onClose, onSuccess }) => {
  const { settings } = useSettings();
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
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


  useEffect(() => {
    if (inventory) {
      setFormData(inventory);
      setEditable(false);

    }
  }, [inventory]);

  useEffect(() => {
    fetch(`${settings.api_url}/api/v1/warehouses/display-all.php`, {
      credentials: 'include' // Include session/cookies
    })
      .then(res => res.json())
      .then(setWarehouses)
      .catch(err => {
        console.error('Error fetching warehouses:', err);
        setError('Failed to load warehouses.');
      });

    fetch(`${settings.api_url}/api/v1/suppliers/display-all.php`, {
      credentials: 'include' // Include session/cookies
    })
      .then(res => res.json())
      .then(setSuppliers)
      .catch(err => {
        console.error('Error fetching suppliers:', err);
        setError('Failed to load suppliers.');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData(prev => ({ ...prev, [actionMeta.name]: selectedOption.value }));
  };

  const handleEdit = () => setEditable(true);

  const handleSave = () => {
    fetch(`${settings.api_url}/api/v1/inventory/update.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include' // Include session/cookies
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEditable(false);
          onSuccess?.(); // refresh data
        } else {
          toast.error('Failed to update: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Update failed:', error);
        toast.error('An error occurred while updating the inventory.');
      });
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) return;

    fetch(`${settings.api_url}/api/v1/inventory/delete.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ InventoryID: formData.InventoryID }),
      credentials: 'include' // Include session/cookies
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success('Inventory item deleted.');
          onClose();
          onSuccess?.();
        } else {
          toast.error('Failed to delete: ' + data.message);
        }
      })
      .catch(err => {
        console.error('Delete failed:', err);
        toast.error('An error occurred while deleting the inventory item.');
      });
  };


  if (!inventory) return null;

  const supplierOptions = suppliers.map(sup => ({
    value: sup.SupplierID,
    label: sup.SupplierName,
  }));

  const warehouseOptions = warehouses.map(wh => ({
    value: wh.WarehouseID,
    label: wh.WarehouseName,
  }));

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow rounded">
          <div className="modal-header text-black">
            <h5 className="modal-title">{formData.ProductName || 'Not Captured'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-2 mb-3">
              <div className="col-6 col-md-3">
                <div className="info-card">
                  <h5>{formData.MinimumStockLevel}</h5>
                  <small>Minimum</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="info-card">
                  <h5>{formData.MaximumStockLevel}</h5>
                  <small>Maximum</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="info-card">
                  <h5>{formData.QuantityAvailable}</h5>
                  <small>Available Stock</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="info-card">
                  <h5>Warehouse</h5>
                  <small>{formData.WarehouseName?.trim() ? formData.WarehouseName : "-"}</small>
                </div>
              </div>
            </div>


            <form>
              <div className="row mb-3">

                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock</label>
                  <div className="input-group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={!editable}
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          QuantityAvailable: Math.max(1, Number(prev.QuantityAvailable) - 1),
                        }))
                      }
                    >-</button>
                    <input
                      type="number"
                      name="QuantityAvailable"
                      className="form-control text-center"
                      value={formData.QuantityAvailable || 0}
                      onChange={handleChange}
                      disabled={!editable}
                      min="1"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={!editable}
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          QuantityAvailable: Number(prev.QuantityAvailable) + 1,
                        }))
                      }
                    >+</button>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Minimum Stock</label>
                  <div className="input-group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={!editable}
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          MinimumStockLevel: Math.max(1, Number(prev.MinimumStockLevel) - 1),
                        }))
                      }
                    >-</button>
                    <input
                      type="number"
                      name="MinimumStockLevel"
                      className="form-control text-center"
                      value={formData.MinimumStockLevel || 0}
                      onChange={handleChange}
                      disabled={!editable}
                      min="1"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={!editable}
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          MinimumStockLevel: Number(prev.MinimumStockLevel) + 1,
                        }))
                      }
                    >+</button>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Maximum Stock</label>
                  <div className="input-group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={!editable}
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          MaximumStockLevel: Math.max(
                            Number(prev.MinimumStockLevel) + 1,
                            Number(prev.MaximumStockLevel) - 1
                          ),
                        }))
                      }
                    >-</button>
                    <input
                      type="number"
                      name="MaximumStockLevel"
                      className="form-control text-center"
                      value={formData.MaximumStockLevel || 0}
                      onChange={handleChange}
                      disabled={!editable}
                      min={Number(formData.MinimumStockLevel) + 1}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={!editable}
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          MaximumStockLevel: Number(prev.MaximumStockLevel) + 1,
                        }))
                      }
                    >+</button>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Supplier</label>
                  <Select
                    name="SupplierID"
                    options={supplierOptions}
                    isDisabled={!editable}
                    value={supplierOptions.find(opt => opt.value === formData.SupplierID)}
                    onChange={handleSelectChange}
                    placeholder="Select Supplier"
                    theme={selectTheme}
                    styles={selectStyles}
                  />

                </div>
                <div className="col-md-6">
                  <label className="form-label">Warehouse</label>
                  <Select
                    name="WarehouseID"
                    options={warehouseOptions}
                    isDisabled={!editable}
                    value={warehouseOptions.find(opt => opt.value === formData.WarehouseID)}
                    onChange={handleSelectChange}
                    placeholder="Select Warehouse"
                    theme={selectTheme}
                    styles={selectStyles}
                  />

                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            {!editable ? (
              <button className="btn btn-primary me-2" onClick={handleEdit}>Edit</button>
            ) : (
              <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
            )}
            <button className="btn btn-danger me-2" onClick={handleDelete}>Delete</button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
