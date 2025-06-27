import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const AddStore = ({ onClose, refetch }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    StoreName: '',
    StoreLocation: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
fetch(`${settings.api_url}/api/v1/stores/create.php`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
  credentials: 'include' // Include session/cookies
})
      .then(res => res.json())
      .then(data => {
        //.log('Store added:', data);
        refetch();
        setFormData({
          StoreName: '',
          StoreLocation: ''
        });
        onClose();
      })
      .catch(err => console.error('Add Store error:', err));
  };

  return (
    <>
      <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Store</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Store Name</label>
                <input
                  className="form-control"
                  name="StoreName"
                  type="text"
                  placeholder="Enter store name"
                  value={formData.StoreName}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Store Location</label>
                <input
                  className="form-control"
                  name="StoreLocation"
                  type="text"
                  placeholder="Enter store location"
                  value={formData.StoreLocation}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Add Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStore;
