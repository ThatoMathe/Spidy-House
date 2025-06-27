import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const CourierView = ({ courier, onClose, refetch }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (courier) {
      setLoadingDetails(true);

fetch(`${settings.api_url}/api/v1/couriers/details.php?CourierID=${courier.CourierID}`, {
  credentials: 'include' // Include session/cookies
})
  .then(res => res.json())
  .then(data => setFormData(data))
  .catch(err => console.error('Error fetching courier details:', err))
  .finally(() => setLoadingDetails(false));

    }
  }, [courier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditable(true);

  const handleSave = () => {
fetch(`${settings.api_url}/api/v1/couriers/edit.php`, {
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
  if (window.confirm('Are you sure you want to delete this courier?')) {
fetch(`${settings.api_url}/api/v1/couriers/delete.php`, {
  method: 'POST', // Use POST method for deletion
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    action: 'delete',  // This parameter indicates the delete action
    id: formData.CourierID // Send the Courier ID to be deleted
  }),
  credentials: 'include' // Include session/cookies
})
    .then(res => res.json())
    .then(data => {
      onClose(); // Close the modal after deletion
      refetch(); // Refresh the users list after deleting
    })
    .catch(err => console.error('Error deleting courier:', err));
  }
};




  if (!courier) return null;

  return (
<div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
  <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Courier: {formData.CourierName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loadingDetails ? (
              <div className="text-center py-3">Loading courier details...</div>
            ) : (
              <form>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label">courier Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="CourierName"
                      value={formData.CourierName || ''}
                      disabled={!editable}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Address"
                      value={formData.Address || ''}
                      disabled={!editable}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ContactNumber"
                      value={formData.ContactNumber || ''}
                      disabled={!editable}
                      onChange={handleChange}
                    />
                  </div>
                </div>


                <div className="row mb-3">
                  
                  {/* <div className="col-md-6">
                    <label className="form-label">Created Date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="CreatedDate"
                      value={formData.CreatedDate || ''}
                      disabled
                    />
                  </div> */}
                </div>
              </form>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger me-3" onClick={handleDelete}>
              Delete courier
            </button>

            {!editable ? (
              <button className="btn btn-primary me-3" onClick={handleEdit}>
                Edit
              </button>
            ) : (
              <button className="btn btn-warning me-3" onClick={handleSave}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierView;
