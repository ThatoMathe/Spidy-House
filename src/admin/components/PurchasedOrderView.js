import React, { useEffect, useState } from "react";
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';


const PurchasedOrderView = ({ purchasedOrder, onClose, onSaved }) => {

  const { settings } = useSettings();
  const [orderDetails, setOrderDetails] = useState([]);
  const [status, setStatus] = useState('');
  const [actualDate, setActualDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (purchasedOrder?.order_id) {
      fetch(`${settings.api_url}/api/v1/purchasedorder/details.php?orderId=${purchasedOrder.order_id}`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setOrderDetails(data || []);
          const first = data?.[0];
          if (first) {
            setStatus(['Pending', 'Approved', 'Rejected'].includes(first.Status) ? first.Status : 'Pending');
            setActualDate(first.ActualDate ? first.ActualDate.split(' ')[0] : '');
          }
        })

        .catch(err => console.error("Error fetching data:", err));
    }
  }, [purchasedOrder]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${settings.api_url}/api/v1/purchasedorder/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          order_id: purchasedOrder.order_id,
          status,
          actual_date: actualDate,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Order updated successfully!');
        if (onSaved) onSaved(); // 🔁 Refresh the list and close modal
        onClose();
      } else {
        toast.error(result.message || 'Failed to update order.');
      }
    } catch (error) {
      toast.error('Error saving order.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const res = await fetch(`${settings.api_url}/api/v1/purchasedorder/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order_id: purchasedOrder.order_id }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success('Order deleted successfully!');
        if (onSaved) onSaved(); // Refetch + close modal
      } else {
        toast.error(result.message || 'Failed to delete order.');
      }
    } catch (error) {
      toast.error('Error deleting order.');
    }
  };


  if (!purchasedOrder || orderDetails.length === 0) return null;

  const first = orderDetails[0];

  return (
    <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order #{first.OrderID} Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p><strong>Order Date:</strong> {new Date(first.OrderDate).toLocaleDateString()}</p>
            <p><strong>Expected Date:</strong> {new Date(first.ExpectedDate).toLocaleDateString()}</p>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label"><strong>Actual Date</strong></label>
                <input
                  type="date"
                  className="form-control"
                  value={actualDate}
                  onChange={(e) => setActualDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label"><strong>Status</strong></label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {orderDetails.map((item, index) => (
              <div key={index} className="border rounded p-3 mb-3">
                <div className="row align-items-center">
                  <div className="col-md-2 text-center mb-2 mb-md-0">
                    {item.ProductImage ? (
                      <img
                        src={item.ProductImage}
                        width="60"
                        height="60"
                        className="img-thumbnail"
                        alt={item.ProductName}
                      />
                    ) : (
                      <div className="text-muted small">No image</div>
                    )}
                  </div>

                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Product:</strong> {item.ProductName}</p>
                        <p className="mb-1"><strong>Barcode:</strong> {item.BarCode}</p>
                        <p className="mb-1"><strong>Code:</strong> {item.ProductCode}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Quantity:</strong> {item.Quantity}</p>
                        <p className="mb-1"><strong>Category:</strong> {item.CategoryName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer d-flex justify-content-between">
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
            <div>
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
};

export default PurchasedOrderView;
