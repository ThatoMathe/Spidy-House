import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const EntryView = ({ data, onClose, onEdit, onDelete }) => {
  const { settings } = useSettings();
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState(data || {});

  if (!data) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleEdit = () => setEditable(true);

const handleSave = async () => {
  setEditable(false);
  try {
const res = await fetch(`${settings.api_url}/api/v1/reports/update.php`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData),
  credentials: 'include' // Include session/cookies
});

    const result = await res.json();
    if (result.success && onEdit) {
      onEdit(formData); // update parent
    }
  } catch (error) {
    console.error('Error updating entry:', error);
  }
};

const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this entry?")) return;

  try {
const res = await fetch(`${settings.api_url}/api/v1/reports/delete.php`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ ReportID: formData.ReportID }),
  credentials: 'include' // Include session/cookies
});

    const result = await res.json();
    if (result.success && onDelete) {
      onDelete(formData); // notify parent
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
  }
};


  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Viewing Activity by: {data.Username}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row mb-3">
                <input type="hidden" name="ReportID" value={formData.ReportID || ''} disabled />
                <div className="col-md-6 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Title"
                    value={formData.Title || ''}
                    disabled={!editable}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.Username || ''}
                    disabled
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.Date || ''}
                    disabled
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.Time || ''}
                    disabled
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="Description"
                    rows="3"
                    value={formData.Description || ''}
                    disabled={!editable}
                    onChange={handleChange}
                  ></textarea>
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

export default EntryView;
