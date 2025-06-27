import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const SupplierView = ({ product, onClose, refetch }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({});
  const [orderStats, setOrderStats] = useState({});
  const [linkedProducts, setLinkedProducts] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setLoadingDetails(true);

      fetch(`${settings.api_url}/api/v1/suppliers/details.php?id=${product.SupplierID}`, {
        credentials: 'include' // Include session/cookies
      })
        .then(res => res.json())
        .then(data => {
          setOrderStats(data.orderStats || {});
          setLinkedProducts(data.linkedProducts || []);
        })
        .catch(err => {
          console.error("Error fetching supplier details:", err); // Debug: fetch error
        })
        .finally(() => setLoadingDetails(false));
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditable(true);

  const handleSave = () => {
    setEditable(false);
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    let id = product.SupplierID;
    fetch(`${settings.api_url}/api/v1/suppliers/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ SupplierID: id }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refetch();
          alert('Supplier deleted successfully.');
          onClose(); // Close the modal
        } else {
          alert(data.message || 'Failed to delete supplier.');
        }
      })
      .catch(err => console.error('Delete error:', err));
  };


  if (!product) return null;

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Supplier: {formData.SupplierName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loadingDetails ? (
              <div className="text-center py-3">Loading supplier details...</div>
            ) : (
              <>
                {/* Order Stats */}
                <div className="row g-2 mb-3">
                  <div className="col-6 col-md-3 d-flex">
                    <div className="card w-100 text-center">
                      <div className="card-body">
                        <h5 className="card-title">{orderStats.pending || 0}</h5>
                        <p className="card-text">Pending Orders</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-md-3 d-flex">
                    <div className="card w-100 text-center">
                      <div className="card-body">
                        <h5 className="card-title">{orderStats.approved || 0}</h5>
                        <p className="card-text">Approved Orders</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-md-3 d-flex">
                    <div className="card w-100 text-center">
                      <div className="card-body">
                        <h5 className="card-title">{orderStats.total || 0}</h5>
                        <p className="card-text">Total Orders</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-md-3 d-flex">
                    <div className="card w-100 text-center">
                      <div className="card-body">
                        <h6 className="card-title">{orderStats.lastOrdered || '-'}</h6>
                        <p className="card-text">Last Ordered</p>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Supplier Form */}
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Supplier Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="SupplierName"
                        value={formData.SupplierName || ''}
                        disabled={!editable}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Supplier Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="SupplierAddress"
                        value={formData.SupplierAddress || ''}
                        disabled={!editable}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Linked Products */}
                  <div className="mb-3">
                    <label className="form-label">Linked Products</label>
                    {linkedProducts.length > 0 ? (
                      <ul className="list-group">
                        {linkedProducts.map((prod, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between">
                            <span>{prod.ProductName}</span>
                            <span className="text-muted">#{prod.ProductCode}</span>
                          </li>
                        ))}
                      </ul>
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
              <>
                <button className="btn btn-primary me-2" onClick={handleEdit}>Edit</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </>
            ) : (
              <>
                <button className="btn btn-warning me-2" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditable(false)}>Cancel</button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Optional inline style for debugging layout */}
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

export default SupplierView;
