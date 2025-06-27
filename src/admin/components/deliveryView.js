import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const DeliveryView = ({ delivery, onClose }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({});
  const [linkedProducts, setLinkedProducts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (delivery) {
      setLoadingDetails(true);
      fetch(`${settings.api_url}/api/v1/deliveries/details.php?DeliveryID=${delivery.DeliveryID}`, {
        credentials: 'include' // Include session/cookies
      })
        .then(res => res.json())
        .then(data => {
          setFormData(data.info || {});
          setLinkedProducts(data.linkedProducts || []);
        })
        .catch(err => {
          console.error("Error fetching delivery details:", err);
        })
        .finally(() => setLoadingDetails(false));
    }
  }, [delivery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditable(true);
  const handleSave = () => {
    // Add your saving logic here
    setEditable(false);
  };

  if (!delivery) return null;

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delivery Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loadingDetails ? (
              <div className="text-center py-3">Loading delivery details...</div>
            ) : (
              <>
                {/* Customer Info */}
                <div className="row g-2 mb-3">
                  <div className="col-6 col-md-6">
                    <div className="info-card">
                      <h5>{formData.CustomerID || '-'}</h5>
                      <small>Customer ID</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="info-card">
                      <h5>{formData.CustomerName || '-'}</h5>
                      <small>Customer Name</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="info-card">
                      <h5>{formData.CustomerAddress || '-'}</h5>
                      <small>Customer Address</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="info-card">
                      <h6>{formData.DeliveryAddress || '-'}</h6>
                      <small>Delivery Address</small>
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <form>
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Courier Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="CourierName"
                        value={formData.CourierName || ''}
                        disabled={!editable}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Status"
                        value={formData.Status || ''}
                        disabled={!editable}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

{/* Linked Products */}
<div className="mb-3">
  <label className="form-label mb-2"><strong>Linked Products</strong></label>
  {linkedProducts.length > 0 ? (
    <div className="row g-1">
{linkedProducts.map((prod, index) => (
  <div key={index} className="col-md-6">
    <div className="card shadow-sm border-0">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          {(!prod.ProductName && !prod.ProductCode) ? (
            <div className="text-danger">
              <strong>Removed from database</strong>
            </div>
          ) : (
            <>
              <h6 className="card-title mb-1 text-primary">
                {prod.ProductName || 'Unknown product'}
              </h6>
              <p className="card-subtitle text-muted small mb-0">
                Code: {prod.ProductCode || 'N/A'}
              </p>
            </>
          )}
        </div>
        <span className="badge bg-warning text-dark rounded-pill">
          Qty: {prod.Quantity}
        </span>
      </div>
    </div>
  </div>
))}

    </div>
  ) : (
    <p className="text-muted">No linked products found.</p>
  )}
</div>

                </form>
              </>
            )}
          </div>

          <div className="modal-footer">
            {!editable ? (
              <button className="btn btn-primary me-3" onClick={handleEdit}>Edit</button>
            ) : (
              <button className="btn btn-warning me-3" onClick={handleSave}>Save</button>
            )}
          </div>
        </div>
      </div>

      {/* Inline styling for info cards */}
      <style>
        {`
          .info-card {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default DeliveryView;
