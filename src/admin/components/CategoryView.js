import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const CategoryView = ({ category, onClose, refetch }) => {
  const { settings } = useSettings();
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const isDarkMode = document.body.classList.contains("dark-mode");

  useEffect(() => {
    if (category) {
      setFormData(category);
      setEditable(false);
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = () => setEditable(true);

  const handleSave = () => {
fetch(`${settings.api_url}/api/v1/categories/edit.php`, {
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
      .catch(err => console.error('Error saving category:', err));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      fetch(`${settings.api_url}/api/v1/categories/delete.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CategoryID: formData.CategoryID }),
      })
        .then(res => res.json())
        .then(data => {
          onClose();
          refetch();
        })
        .catch(err => console.error('Error deleting category:', err));
    }
  };

  if (!category) return null;

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Viewing Category: {formData.CategoryName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row mb-3">
                <input
                  type="hidden"
                  name="CategoryID"
                  value={formData.CategoryID || ''}
                  disabled
                />
                <div className="col-md-6">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="CategoryName"
                    value={formData.CategoryName || ''}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
