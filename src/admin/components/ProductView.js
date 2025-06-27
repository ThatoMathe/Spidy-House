import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useSettings } from '../../context/SettingsContext';

const ProductView = ({ product, onClose, onDeleteSuccess, onEditSuccess }) => {
  const { settings } = useSettings();
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setEditable(false);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setEditable(true);

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append('productID', formData.ProductID);
      form.append('ProductName', formData.ProductName);
      form.append('BarCode', formData.BarCode);
      if (newImageFile) form.append('ProductImage', newImageFile);

      const res = await fetch(`${settings.api_url}/api/v1/products/edit.php`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Product updated successfully');
        setEditable(false);
        if (typeof onEditSuccess === 'function') onEditSuccess();
      } else {
        toast.error(result.message || 'Failed to update product.');
      }
    } catch {
      toast.error('Network error while updating product.');
    }
  };


  const handleDelete = async () => {
    try {
      const res = await fetch(`${settings.api_url}/api/v1/products/delete.php`, {
        method: 'POST',
        body: new URLSearchParams({ productID: formData.ProductID }),
        credentials: 'include',
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Product deleted successfully.');
        if (typeof onDeleteSuccess === 'function') onDeleteSuccess();
        onClose();
      } else {
        toast.error(result.message || 'Failed to delete product.');
      }
    } catch {
      toast.error('Network error while deleting product.');
    }
  };

  if (!product) return null;

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow rounded">
          <div className="modal-header">
            <h5 className="modal-title">{formData.ProductName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Product Image</label><br />
              <img
                src={`${settings.api_url}/${formData.ProductImage}`}
                alt={formData.ProductName}
                width="100"
                className="img-thumbnail mb-2"
              />
              {editable && (
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                />
              )}
            </div>


            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ProductName"
                    value={formData.ProductName || ''}
                    onChange={handleChange}
                    disabled={!editable}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Barcode</label>
                  <input
                    type="text"
                    className="form-control"
                    name="BarCode"
                    value={formData.BarCode || ''}
                    onChange={handleChange}
                    disabled={!editable}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Product Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.ProductCode || ''}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.CategoryName || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Supplier</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.SupplierName || ''}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Warehouse</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.WarehouseName || ''}
                    disabled
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
            {!editable ? (
              <button className="btn btn-primary" onClick={handleEdit}>
                Edit
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSave}>
                Save
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
