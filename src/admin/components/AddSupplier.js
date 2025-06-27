import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const AddSupplier = ({ onClose, refetch }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    SupplierName: '',
    SupplierAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    fetch(`${settings.api_url}/api/v1/suppliers/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        refetch();
        setFormData({
          SupplierName: '',
          SupplierAddress: ''
        });
        onClose();
      })
      .catch(err => console.error('Add Supplier error:', err));
  };

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Supplier</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Supplier Name</label>
              <input
                className="form-control"
                name="SupplierName"
                type="text"
                placeholder="Enter supplier name"
                value={formData.SupplierName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Supplier Address</label>
              <input
                className="form-control"
                name="SupplierAddress"
                type="text"
                placeholder="Enter supplier address"
                value={formData.SupplierAddress}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Add Supplier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;
