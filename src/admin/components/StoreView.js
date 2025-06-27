import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useSettings } from '../../context/SettingsContext';

const StoreView = ({ store, onClose, refetch }) => {
  const { settings } = useSettings();
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loadingTotals, setLoadingTotals] = useState(true);

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
    control: (base, state) => ({
      ...base,
      backgroundColor: isDarkMode ? "#2c2c2c" : "#fff",
      color: isDarkMode ? "#eee" : "#333",
      borderColor: isDarkMode ? "#555" : "#ccc",
      opacity: state.isDisabled ? 0.5 : 1,
      pointerEvents: state.isDisabled ? "none" : "auto",
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
    if (store) {
      setFormData(store);
      setEditable(false);
      fetchStore(store.StoreID);
    }
  }, [store]);

  const fetchStore = async (storeID) => {
    try {
const res = await fetch(`${settings.api_url}/api/v1/stores/details.php`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ StoreID: storeID }),
  credentials: 'include' // Include session/cookies
});


      const data = await res.json();
      if (data.success === false || Object.keys(data).length === 0) {
        setTotals(null);
      } else {
        setTotals(data);
      }
    } catch (error) {
      console.error("Error fetching store totals:", error);
      setTotals(null);
    } finally {
      setLoadingTotals(false);
    }
  };

useEffect(() => {
  fetch(`${settings.api_url}/api/v1/users/display-all.php`, {
    credentials: 'include' // Include session/cookies
  })
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.error('Failed to load users:', err));
}, []);


  const userOptions = users.map((user) => ({
    value: user.UserID,
    label: `${user.UserName} (${user.Email})`,
  }));

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = () => setEditable(true);

  const handleSave = () => {
fetch(`${settings.api_url}/api/v1/stores/edit.php`, {
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
        refetch();
      })
      .catch(err => console.error('Error saving store:', err));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this store?')) {
fetch(`${settings.api_url}/api/v1/stores/delete.php`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ StoreID: formData.StoreID }),
  credentials: 'include' // Include session/cookies
})
        .then(res => res.json())
        .then(data => {
          onClose();
          refetch();
        })
        .catch(err => console.error('Error deleting store:', err));
    }
  };

  if (!store) return null;

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Viewing Store: {formData.StoreName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">

            {loadingTotals ? (
              <div>Loading stock info...</div>
            ) : totals ? (
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="info-card">
                    <h5>{totals.ProductName || 'N/A'}</h5>
                    <small>Product</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="info-card">
                    <h5>{totals.TransferQuantity ?? 0}</h5>
                    <small>Quantity Transferred</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="info-card">
                    <h5>{totals.WarehouseName || 'Unknown'}</h5>
                    <small>From Warehouse</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="info-card">
                    <h5>
                      {totals.ReceivedDate
                        ? new Date(totals.ReceivedDate).toLocaleDateString()
                        : 'N/A'}
                    </h5>
                    <small>Date Received</small>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">No transfer records available.</div>
            )}

            <form>
              <div className="row mb-3">
                <input type="hidden" name="StoreID" value={formData.StoreID || ''} />
                <div className="col-md-6">
                  <label className="form-label">Store Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="StoreName"
                    value={formData.StoreName || ''}
                    disabled={!editable}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Store Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="StoreLocation"
                    value={formData.StoreLocation || ''}
                    disabled={!editable}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Manager</label>
                  <Select
                    name="ManagerID"
                    options={userOptions}
                    value={userOptions.find(opt => opt.value === formData.ManagerID)}
                    onChange={(selectedOption) =>
                      setFormData({ ...formData, ManagerID: selectedOption.value })
                    }
                    placeholder="Select Manager"
                    isDisabled={!editable}
                    isSearchable
                    theme={selectTheme}
                    styles={selectStyles}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreView;
