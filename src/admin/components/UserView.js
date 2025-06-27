import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useSettings } from '../../context/SettingsContext';

const UserView = ({ user, onClose, refetch }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [editable, setEditable] = useState(false);
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

useEffect(() => {
  fetch(`${settings.api_url}/api/v1/warehouses/display-all.php`, {
    credentials: 'include' // Include session/cookies
  })
    .then(res => res.json())
    .then(data => setWarehouses(data))
    .catch(err => console.error('Error fetching warehouses:', err));
}, []);


  useEffect(() => {
    if (user) {
      setLoadingDetails(true);

 fetch(`${settings.api_url}/api/v1/users/details.php?id=${user.UserID}`, {
  credentials: 'include' // Include session/cookies
})
  .then(res => res.json())
  .then(data => setFormData(data))
  .catch(err => console.error('Error fetching user details:', err))
  .finally(() => setLoadingDetails(false));

    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditable(true);

  const handleSave = () => {
fetch(`${settings.api_url}/api/v1/users/edit.php`, {
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
    if (window.confirm('Are you sure you want to delete this user?')) {
fetch(`${settings.api_url}/api/v1/users/delete.php`, {
  method: 'POST', // Use POST method for deletion
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    action: 'delete',  // This parameter indicates the delete action
    id: formData.UserID // Send the user ID to be deleted
  }),
  credentials: 'include' // Include session/cookies
})
      .then(res => res.json())
      .then(data => {
        onClose(); // Close the modal after deletion
        refetch(); // Refresh the users list after deleting
      })
      .catch(err => console.error('Error deleting user:', err));
    }
  };


const WarehousesData = warehouses.map(opt => ({
  value: parseInt(opt.WarehouseID, 10),
  label: opt.WarehouseName,
}));



  if (!user) return null;

  return (
<div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
  <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">User: {formData.UserName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loadingDetails ? (
              <div className="text-center py-3">Loading user details...</div>
            ) : (
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">User Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="UserName"
                      value={formData.UserName || ''}
                      disabled={!editable}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="Email"
                      value={formData.Email || ''}
                      disabled={!editable}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  


                <div className="col-md-6">
                  <label className="form-label">Warehouse</label>
<Select
  name="WarehouseID"
  options={WarehousesData}
  isDisabled={!editable}
  value={WarehousesData.find(opt => opt.value === formData.WarehouseID)}
  onChange={(selected) =>
    setFormData((prev) => ({ ...prev, WarehouseID: selected.value }))
  }
  placeholder="Select Warehouse"
  theme={selectTheme}
  styles={selectStyles}
  className=" mb-3"
/>



                </div>


                  <div className="col-md-6">
                    <label className="form-label">Location Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="LocationAddress"
                      value={formData.LocationAddress || ''}
                      disabled
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Role"
                      value={formData.Role || ''}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Created Date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="CreatedDate"
                      value={formData.CreatedDate || ''}
                      disabled
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger me-3" onClick={handleDelete}>
              Delete User
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

export default UserView;
