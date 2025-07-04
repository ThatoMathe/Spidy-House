import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useSettings } from '../../context/SettingsContext';

const ProcessProduct = ({ barcode, inventory, onCancel }) => {
  const { settings } = useSettings();
  const [productData, setProductData] = useState({
    productCode: '',
    barcode: barcode || '',
    productName: '',
    productDescription: '',
    orderID: '',
    productImage: null,
    categoryID: '',
    supplierID: '',
    productQuantity: 1,
  });

  const [error, setError] = useState('');
  const [offlineMessage, setOfflineMessage] = useState('');
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
    control: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "#2c2c2c" : "#fff",
      color: isDarkMode ? "#eee" : "#333",
      borderColor: isDarkMode ? "#555" : "#ccc",
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

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {

      const res = await fetch(`${settings.api_url}/api/v1/categories/display-all.php`, {
        credentials: 'include' // Include session/cookies
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();

    },
    onError: (err) => {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories.');
    }
  });

  const categoryOptions = categories.map((cat) => ({
    value: cat.CategoryID,
    label: cat.CategoryName,
  }));

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('productCode', productData.productCode);
      formData.append('barcode', productData.barcode);
      formData.append('productName', productData.productName);
      formData.append('productDescription', productData.productDescription);
      formData.append('orderID', productData.orderID);
      formData.append('categoryID', productData.categoryID);
      formData.append('supplierID', inventory.SupplierID);
      formData.append('productImage', productData.productImage);
      formData.append('inventoryID', inventory.InventoryID);
      formData.append('WarehouseID', inventory.WarehouseID);
      formData.append('QuantityAvailable', productData.productQuantity);
      formData.append('LastOrderDate', new Date().toISOString().slice(0, 19).replace('T', ' '));

      const res = await fetch(`${settings.api_url}/api/v1/products/process.php`, {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include session/cookies
      });


      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    retry: true,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: (data) => {
      setOfflineMessage('');
      if (data.success) {
        toast.success('Product saved successfully!');
        setProductData({
          productCode: '',
          barcode: '',
          productName: '',
          productDescription: '',
          orderID: '',
          productImage: null,
          categoryID: '',
          supplierID: '',
          productQuantity: 1,
        });
        onCancel?.();
      } else {
        setError(data.message || "Save failed");
      }
    },
    onError: (err) => {
      console.error("Submit failed:", err);
      setOfflineMessage('Offline: Submission cached and will sync when online.');
      setError("Submission will retry when online.");
    },
  });

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData({ ...productData, productImage: file });
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  if (!inventory?.InventoryID) {
    return <div className="text-danger p-4">Invalid inventory data. Supplier or Inventory ID missing.</div>;
  }

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Process Product</h5>
            <button type="button" className="btn-close" onClick={handleCancel}></button>
          </div>
          <div className="modal-body">
            <div className='Container'>
              <p>Scanned Barcode: <strong>{barcode}</strong></p>

              {mutation.isLoading && <p>Submitting...</p>}
              {mutation.isError && <p className="text-danger">{error}</p>}
              {offlineMessage && <p className="text-warning fw-bold">{offlineMessage}</p>}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!mutation.isLoading) {
                    if (!navigator.onLine) {
                      onCancel?.();
                      toast.info('Saved. Will sync when online.');
                    }
                    mutation.mutate();
                  }
                }}

                className='mt-4'
              >
                <input type='hidden' name='barcode' value={productData.barcode} readOnly />

                <div className='mb-3'>
                  <label className='form-label'>Product Name</label>
                  <input
                    type='text'
                    name='productName'
                    className='form-control'
                    value={productData.productName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='mb-3'>
                  <label className='form-label'>Category</label>
                  <Select
                    name='categoryID'
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === productData.categoryID)}
                    onChange={(selectedOption) =>
                      setProductData({ ...productData, categoryID: selectedOption.value })
                    }
                    placeholder="Select Category"
                    isSearchable
                    theme={selectTheme}
                    styles={selectStyles}
                  />
                </div>

                <div className='mb-3'>
                  <label className='form-label'>Product Description</label>
                  <textarea
                    name='productDescription'
                    className='form-control'
                    rows='3'
                    value={productData.productDescription}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* <div className='mb-3'>
                  <label className='form-label'>Quantity</label>
                  <div className='input-group'>
                    <button
                      type='button'
                      className='btn btn-outline-secondary'
                      style={{ zIndex: '0' }}
                      onClick={() =>
                        setProductData((prev) => ({
                          ...prev,
                          productQuantity: Math.max(1, prev.productQuantity - 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <input
                      type='number'
                      name='productQuantity'
                      className='form-control text-center'
                      value={productData.productQuantity}
                      onChange={handleChange}
                      min='1'
                      required
                    />
                    <button
                      type='button'
                      className='btn btn-outline-secondary'
                      style={{ zIndex: '0' }}
                      onClick={() =>
                        setProductData((prev) => ({
                          ...prev,
                          productQuantity: prev.productQuantity + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div> */}

                <div className='mb-3'>
                  <label className='form-label'>Product Image</label>
                  <input
                    type='file'
                    name='productImage'
                    className='form-control'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                </div>

                <div className='d-flex justify-content-between'>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={mutation.isLoading}
                  >
                    {mutation.isLoading ? 'Saving...' : 'Save Product'}
                  </button>

                  <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
                </div>
              </form>

              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>


          </div>
        </div>
      </div>
    </div>
  );

};

export default ProcessProduct;
