import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';

const NewPurchaseOrder = ({ onSuccess }) => {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    product_id: '',
    supplier_id: '',
    order_quantity: '',
    expected_date: '',
  });




  const fetchProducts = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/products/display-all.php`, { credentials: 'include' });
    const data = await res.json();
    setProducts(data);
  };

  const fetchSuppliers = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/suppliers/display-all.php`, { credentials: 'include' });
    const data = await res.json();
    setSuppliers(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_id || !formData.supplier_id || !formData.order_quantity || !formData.expected_date) {
      toast.error('Please fill in all fields.');
      return;
    }

    const res = await fetch(`${settings.api_url}/api/v1/purchasedorder/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    if (result.success) {
      toast.success('Purchase order created successfully!');
      setFormData({ product_id: '', supplier_id: '', order_quantity: '', expected_date: '' });
      if (onSuccess) onSuccess(); // trigger refetch
    } else {
      toast.error(result.message || 'Failed to create order.');
    }
  };

  return (
    <div className=" p-4 mb-4">
      <h5>Create New Purchase Order</h5>
      <form onSubmit={handleSubmit} className="row g-3 mt-2">
        <div className="col-md-6">
          <label className="form-label">Product</label>
          <select className="form-select" name="product_id" value={formData.product_id} onChange={handleChange}>
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p.ProductID} value={p.ProductID}>
                {p.ProductName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Supplier</label>
          <select className="form-select" name="supplier_id" value={formData.supplier_id} onChange={handleChange}>
            <option value="">Select supplier</option>
            {suppliers.map(s => (
              <option key={s.SupplierID} value={s.SupplierID}>
                {s.SupplierName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="order_quantity"
            value={formData.order_quantity}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Expected Date</label>
          <input
            type="date"
            className="form-control"
            name="expected_date"
            value={formData.expected_date}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-primary">Submit Order</button>
        </div>
      </form>
    </div>
  );
};

export default NewPurchaseOrder;
