import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const AddUser = ({ onClose, refetch }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    UserName: '',
    Email: '',
    Password: '',
    Role: '',
    WarehouseID: ''
  });

  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    fetch(`${settings.api_url}/api/v1/warehouses/display-all.php`, {
      credentials: 'include' // Include session/cookies
    })
      .then(res => res.json())
      .then(data => setWarehouses(data))
      .catch(err => console.error('Error fetching warehouses:', err));
  }, []);


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    fetch(`${settings.api_url}/api/v1/users/newuser.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // This includes session cookies
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        refetch();
        setFormData({
          UserName: '',
          Email: '',
          Password: '',
          Role: '',
          WarehouseID: ''
        });
        onClose();
      })
      .catch(err => console.error('Add user error:', err));
  };



  return (
    <>

      {/* Modal */}
      <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body px-4 py-3">
              <div className="mb-3">
                <label htmlFor="UserName" className="form-label">Username</label>
                <input
                  className="form-control"
                  id="UserName"
                  name="UserName"
                  placeholder="Enter username"
                  value={formData.UserName}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="Email" className="form-label">Email</label>
                <input
                  className="form-control"
                  id="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  placeholder="Enter email"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="Password" className="form-label">Password</label>
                <input
                  className="form-control"
                  id="Password"
                  name="Password"
                  type="password"
                  value={formData.Password}
                  placeholder="Enter password"
                  onChange={handleChange}
                />
              </div>

              <select
                className="form-select mb-3"
                id="Role"
                name="Role"
                value={formData.Role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>


              <div className="mb-3">
                <label htmlFor="WarehouseID" className="form-label">Warehouse</label>
                <select
                  className="form-select"
                  id="WarehouseID"
                  name="WarehouseID"
                  value={formData.WarehouseID}
                  onChange={handleChange}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => (
                    <option key={w.WarehouseID} value={w.WarehouseID}>
                      {w.WarehouseName}
                    </option>
                  ))}
                </select>
              </div>
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

export default AddUser;
