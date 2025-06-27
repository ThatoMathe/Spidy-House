import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const AddCourier = ({ onClose, refetch }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    CourierName: '',
    ContactNumber: '',
    Address: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = () => {
fetch(`${settings.api_url}/api/v1/couriers/new-courier.php`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
  credentials: 'include' // Include session/cookies
})
    .then(res => res.json())
    .then(() => {
      refetch();
      setFormData({
        CourierName: '',
        ContactNumber: '',
        Address: ''
      });
      onClose();
    })
    .catch(err => console.error('Add courier error:', err));
};


  return (
    <>

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Courier</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
            
              <input
                className="form-control mb-2"
                name="CourierName"
                type="text"
                placeholder="Courier Name"
                value={formData.CourierName}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                name="ContactNumber"
                type="text"
                placeholder="Contact Number"
                onChange={handleChange}
              />
              <input
                className="form-control mb-2"
                name="Address"
                type="text"
                placeholder="Address"
                onChange={handleChange}
              />
              
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCourier;
