import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const WarehouseView = ({ warehouse, onClose, refetch}) => {
  const { settings } = useSettings();
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [totals, setTotals] = useState(null);
  const [loadingTotals, setLoadingTotals] = useState(true);

  useEffect(() => {
    if (warehouse) {
      setFormData(warehouse);
      setEditable(false);
      fetchTotals(warehouse.WarehouseID);
    }
  }, [warehouse]);

  const fetchTotals = async (warehouseID) => {
    try {
const res = await fetch(`${settings.api_url}/api/v1/warehouses/details.php?WarehouseID=${warehouseID}`, {
  credentials: 'include' // Include session/cookies
});
const data = await res.json();

      setTotals(data);
    } catch (error) {
      console.error("Error fetching warehouse totals:", error);
      setTotals(null);
    } finally {
      setLoadingTotals(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = () => setEditable(true);
  const handleSave = () => {
fetch(`${settings.api_url}/api/v1/warehouses/edit.php`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
  credentials: 'include' // Include session/cookies
})
      .then(res => res.json())
      .then(data => {
        setEditable(false);
        refetch(); // Refresh the users list after saving
      })
      .catch(err => console.error('Error saving data:', err));
  };

    const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      fetch(`${settings.api_url}/api/v1/warehouses/delete.php`, {
        method: 'POST', // Use POST method for deletion
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'delete',  // This parameter indicates the delete action
          WarehouseID: formData.WarehouseID // Send the user ID to be deleted
        }),
        credentials: 'include' // Include session/cookies
      })
      .then(res => res.json())
      .then(data => {
        onClose(); // Close the modal after deletion
        refetch(); // Refresh the users list after deleting
      })
      .catch(err => console.error('Error deleting warehouse:', err));
    }
  };




  if (!warehouse) return null;

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
  <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Viewing Warehouse: {formData.WarehouseName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loadingTotals ? (
              <div>Loading stock info...</div>
            ) : totals ? (
              <div className="row g-2 mb-3">
                <div className="col-6 col-md-3">
                  <div className="info-card">
                    <h5>{totals.TotalUsers}</h5>
                    <small>Total Users</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="info-card">
                    <h5>{totals.TotalSuppliers}</h5>
                    <small>Total Suppliers</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="info-card">
                    <h5>{totals.TotalAvailableStock}</h5>
                    <small>Available Stock</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="info-card">
                    <h5>{totals.LastOrderDate ? new Date(totals.LastOrderDate).toLocaleDateString() : 'N/A'}</h5>
                    <small>Last Order</small>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">No stock data available.</div>
            )}

            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Warehouse ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="WarehouseID"
                    value={formData.WarehouseID || ''}
                    disabled="true"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Warehouse Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="WarehouseName"
                    value={formData.WarehouseName || ''}
                    disabled={!editable}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Warehouse Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="LocationAddress"
                    value={formData.LocationAddress || ''}
                    disabled={!editable}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="LocationName"
                    value={formData.LocationName || ''}
                    disabled={!editable}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger me-3" onClick={handleDelete}>Delete</button>
            {!editable ? (
              <button className="btn btn-primary me-3" onClick={handleEdit}>Edit</button>
            ) : (
              <button className="btn btn-warning me-3" onClick={handleSave}>Save</button>
            )}
            <Link className="btn btn-success me-3" to="../admin/new-stock">
              New
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseView;
