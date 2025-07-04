import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { toast } from 'react-toastify';

const TransferView = ({ transfer, onClose }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({});
  const [AllData, setTotals] = useState(null);
  const [loadingAllData, setLoadingTotals] = useState(true);

  useEffect(() => {
    if (transfer) {
      setFormData(transfer);
      fetchTotals(transfer.TransferID);
    }
  }, [transfer]);

  const fetchTotals = async (TransferID) => {
    try {
      const res = await fetch(`${settings.api_url}/api/v1/transfers/details.php?TransferID=${TransferID}`, {
        credentials: 'include' // Include session/cookies
      });
      const data = await res.json();

      setTotals(data);
    } catch (error) {
      console.error("Error fetching transfer details:", error);
      setTotals(null);
    } finally {
      setLoadingTotals(false);
    }
  };

  if (!transfer) return null;

  const {
    TransferID, TransferQuantity, SentDate, ReceivedDate,
    ProductName, ProductCode, BarCode, ProductImage, ProductDescription,
    FromWarehouseName, WarehouseName, LocationName,
    LocationAddress, StoreName, StoreLocation
  } = AllData || {};


  const handleReturn = async () => {
    if (!formData.TransferID) return;

    if (!window.confirm("Are you sure you want to return this transfer?")) return;

    try {
      const res = await fetch(`${settings.api_url}/api/v1/transfers/returning.php?TransferID=${formData.TransferID}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${data.message || "Transfer returned successfully."}`);

        onClose(); // Close modal
      } else {
        alert(data.message || "Failed to return transfer.");
      }
    } catch (err) {
      console.error("Return error:", err);
      alert("An error occurred while returning the transfer.");
    }
  };


  return (
    <div
      className="modal show d-block mb-4"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow">
          <div className="modal-header bg-light border-bottom">
            <h5 className="modal-title">
               Transferred: <span className="text-primary">{formData.ProductName}</span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body px-4 py-3">
            {loadingAllData ? (
              <div>Loading transfer info...</div>
            ) : AllData ? (
              <>
                <div className="row g-3 mb-3">
                  <div className="col-md-6"><strong>Transfer ID:</strong> {TransferID}</div>
                  <div className="col-md-6"><strong>Quantity:</strong> {TransferQuantity}</div>
                  <div className="col-md-6"><strong>Sent Date:</strong> {SentDate}</div>
                  <div className="col-md-6"><strong>Received Date:</strong> {ReceivedDate || 'Pending'}</div>
                </div>

                <hr className="my-3" />

                <div className="row g-3 mb-3 align-items-start">
                  <div className="col-md-6">
                    <div className="mb-2"><strong>Product Name:</strong> {ProductName}</div>
                    <div className="mb-2"><strong>Product Code:</strong> {ProductCode}</div>
                    <div className="mb-2"><strong>Barcode:</strong> {BarCode}</div>
                  </div>

                  {ProductImage && (
                    <div className="col-md-6 d-flex">
                      <div className="text-end">
                        <img
                          src={`${settings.api_url}/${ProductImage}`}
                          alt="Product"
                          className="img-fluid shadow rounded border"
                          style={{
                            maxHeight: '120px',
                            minHeight: '80px',
                            objectFit: 'cover',
                            borderColor: '#dee2e6',
                            padding: '4px',
                            backgroundColor: '#f8f9fa',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-3" />

                <div className="row g-3">
                  {FromWarehouseName && (
                    <div className="col-12">
                      <strong>From Warehouse:</strong> {FromWarehouseName}
                    </div>
                  )}

                  {StoreName && (
                    <>
                      <div className="col-md-6">
                        <strong>To Store:</strong> {StoreName}
                      </div>
                      <div className="col-md-6">
                        <strong>Location Name:</strong> {StoreLocation}
                      </div>
                    </>
                  )}

                  {WarehouseName && (
                    <>
                      <div className="col-md-6">
                        <strong>To Warehouse:</strong> {WarehouseName}
                      </div>
                      <div className="col-md-6">
                        <strong>Location Name:</strong> {LocationName}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="alert alert-warning text-center mb-0">No data available.</div>
            )}
          </div>

          <div className="modal-footer bg-light border-top">
            <button className="btn btn-danger me-auto" onClick={handleReturn}>
              <i className="fas fa-undo-alt me-1"></i> Return
            </button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default TransferView;
