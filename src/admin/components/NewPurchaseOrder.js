import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';

const NewPurchaseOrder = ({ onSuccess }) => {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    product_id: '',
    supplier_id: '',
    order_quantity: '',
    expected_date: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${settings.api_url}/api/v1/products/display-all.php`, { credentials: 'include' });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'product_id') {
      const foundProduct = products.find(p => p.ProductID === value);
      setSelectedProduct(foundProduct || null);
      setFormData(prev => ({
        ...prev,
        product_id: value,
        supplier_id: foundProduct?.SupplierID || ''
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { product_id, order_quantity, expected_date } = formData;

  // Automatically extract supplier_id from selectedProduct
  const supplier_id = selectedProduct?.SupplierID;

  if (!product_id || !supplier_id || !order_quantity || !expected_date) {
    toast.error('Please fill in all fields.');
    return;
  }

  // Check if the selected date is in the past
  const selectedDate = new Date(expected_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove time for accurate comparison

  if (selectedDate < today) {
    toast.error('Expected date cannot be in the past.');
    return;
  }

  const payload = {
    product_id,
    supplier_id, // assigned automatically from selectedProduct
    order_quantity,
    expected_date,
  };

  try {
    const res = await fetch(`${settings.api_url}/api/v1/purchasedorder/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.success) {
      toast.success('✅ Purchase order created!');
      setFormData({ product_id: '', supplier_id: '', order_quantity: '', expected_date: '' });
      setSelectedProduct(null);
      if (onSuccess) onSuccess();
    } else {
      toast.error(result.message || 'Failed to create order.');
    }
  } catch (error) {
    toast.error('Server error while creating order.');
  }
};


  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">

        <div className="modal-content shadow-sm">

          <div className="modal-header bg-light border-bottom">
            <h5 className="modal-title">Create New Purchase Order</h5>
            <button type="button" className="btn-close" onClick={() => onSuccess?.()}></button>
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">Product</label>
                  <select
                    className="form-select"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleChange}
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.ProductID} value={p.ProductID}>
                        {p.ProductName}
                      </option>
                    ))}
                  </select>

                  <label className="form-label mt-3">Supplier</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedProduct?.SupplierName || 'Select a product first'}
                    readOnly
                  />

                  <label className="form-label mt-3">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="order_quantity"
                    value={formData.order_quantity}
                    onChange={handleChange}
                    min="1"
                    placeholder="Enter quantity"
                  />

                  <label className="form-label mt-3">Expected Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expected_date"
                    value={formData.expected_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label d-block">Product Info</label>
                  {selectedProduct ? (
                    <div className="border rounded p-3 bg-light small">
                      <div><strong>Code:</strong> {selectedProduct.ProductCode}</div>
                      <div><strong>Barcode:</strong> {selectedProduct.BarCode}</div>
                      <div><strong>Category:</strong> {selectedProduct.CategoryName}</div>
                      <div><strong>Stock:</strong> {selectedProduct.QuantityAvailable}</div>
                      <div><strong>Warehouse:</strong> {selectedProduct.WarehouseName}</div>
                      <div><strong>Location:</strong> {selectedProduct.LocationName}</div>
                      {selectedProduct.ProductImage && (
                        <img
                          src={`${settings.api_url}${selectedProduct.ProductImage}`}
                          alt="Product"
                          className="img-thumbnail mt-2"
                          style={{ maxWidth: '100%', height: '150px' }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-muted small">Select a product to see details.</div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary">
                  Submit Order
                </button>
              </div>
            </form>
          </div>

          <div className="modal-footer border-top px-4">
            <small className="text-muted">Make sure all details are correct before submitting.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchaseOrder;
