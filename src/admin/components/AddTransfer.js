import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useSettings } from '../../context/SettingsContext';

const AddTransfer = ({ onClose, refetch }) => {
    const { settings } = useSettings();
    const modalRef = useRef(null);
    const [form, setForm] = useState({
        TransferID: '',
        TransferQuantity: 0,
        ReceivedDate: '',
        FromWarehouseID: '',
        ProductID: '',
        StoreID: '',
        WarehouseID: ''
    });
    const [transferTo, setTransferTo] = useState('store');
    const [error, setError] = useState('');
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Allow closing on outside click
    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose?.();
        }
    };

    // Allow closing on ESC key
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

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
            borderColor: isDarkMode ? "#555" : "#ccc",
        }),
        singleValue: (base) => ({ ...base, color: isDarkMode ? "#eee" : "#333" }),
        input: (base) => ({ ...base, color: isDarkMode ? "#eee" : "#333" }),
        menu: (base) => ({ ...base, backgroundColor: isDarkMode ? "#2c2c2c" : "#fff" }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? (isDarkMode ? "#3a3a3a" : "#f2f2f2") : "transparent",
            color: isDarkMode ? "#eee" : "#333",
        }),
    };

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${settings.api_url}/api/v1/products/display-all.php`, { credentials: 'include' });
            return res.json();
        },
    });

    const { data: stores = [] } = useQuery({
        queryKey: ['stores'],
        queryFn: async () => {
            const res = await fetch(`${settings.api_url}/api/v1/stores/display-all.php`, { credentials: 'include' });
            return res.json();
        },
    });

    const { data: warehouses = [] } = useQuery({
        queryKey: ['warehouses'],
        queryFn: async () => {
            const res = await fetch(`${settings.api_url}/api/v1/warehouses/display-all.php`, { credentials: 'include' });
            return res.json();
        },
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const mutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const res = await fetch(`${settings.api_url}/api/v1/transfers/new.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!res.ok) throw new Error("Network error");
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Transfer added!");
                refetch?.();
                onClose?.();
            } else {
                setError(data.message);
            }
        },
        onError: () => setError("Submission failed. Try again."),
    });

    return (
        <div className="modal show d-block mb-4" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Transfer</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>

                            <div className="mb-3">
                                <label className="form-label">Product</label>
                                <Select
                                    name="ProductID"
                                    options={products.map(p => ({ value: p.ProductID, label: p.ProductName }))}
                                    value={
                                        products.find(p => p.ProductID === form.ProductID)
                                            ? {
                                                value: form.ProductID,
                                                label: products.find(p => p.ProductID === form.ProductID)?.ProductName
                                            }
                                            : null
                                    }
                                    onChange={(selected) => {
                                        setForm({ ...form, ProductID: selected.value });
                                        setError(''); // clear any previous error
                                    }}
                                    styles={selectStyles}
                                    theme={selectTheme}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Transfer Quantity
                                    {form.ProductID && (
                                        <span className="text-muted ms-2">
                                            (Available: {products.find(p => p.ProductID === form.ProductID)?.QuantityAvailable || 0})
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="number"
                                    name="TransferQuantity"
                                    className="form-control"
                                    value={form.TransferQuantity}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        const product = products.find(p => p.ProductID === form.ProductID);
                                        if (product && value > product.QuantityAvailable) {
                                            setError(`Quantity exceeds available stock (${product.QuantityAvailable})`);
                                        } else {
                                            setError('');
                                            setForm({ ...form, TransferQuantity: value });
                                        }
                                    }}
                                    min="1"
                                    required
                                />
                            </div>


                            <div className="mb-3">
                                <label className="form-label">Expected Date</label>
                                <input type="datetime-local" name="ReceivedDate" className="form-control" value={form.ReceivedDate} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">From Warehouse</label>
                                <Select
                                    name="FromWarehouseID"
                                    options={warehouses.map(w => ({ value: w.WarehouseID, label: w.WarehouseName }))}
                                    value={warehouses.find(w => w.WarehouseID === form.FromWarehouseID) ? { value: form.FromWarehouseID, label: warehouses.find(w => w.WarehouseID === form.FromWarehouseID)?.WarehouseName } : null}
                                    onChange={(selected) => setForm({ ...form, FromWarehouseID: selected.value })}
                                    styles={selectStyles}
                                    theme={selectTheme}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Transfer To</label>
                                <select className="form-select mb-2" value={transferTo} onChange={(e) => setTransferTo(e.target.value)}>
                                    <option value="store">To Store</option>
                                    <option value="warehouse">To Warehouse</option>
                                </select>

                                {transferTo === "store" ? (
                                    <Select
                                        name="StoreID"
                                        options={stores.map(s => ({ value: s.StoreID, label: s.StoreName }))}
                                        value={stores.find(s => s.StoreID === form.StoreID) ? { value: form.StoreID, label: stores.find(s => s.StoreID === form.StoreID)?.StoreName } : null}
                                        onChange={(selected) => setForm({ ...form, StoreID: selected.value, WarehouseID: '' })}
                                        styles={selectStyles}
                                        theme={selectTheme}
                                    />
                                ) : (
                                    <Select
                                        name="WarehouseID"
                                        options={warehouses.map(w => ({ value: w.WarehouseID, label: w.WarehouseName }))}
                                        value={warehouses.find(w => w.WarehouseID === form.WarehouseID) ? { value: form.WarehouseID, label: warehouses.find(w => w.WarehouseID === form.WarehouseID)?.WarehouseName } : null}
                                        onChange={(selected) => setForm({ ...form, WarehouseID: selected.value, StoreID: '' })}
                                        styles={selectStyles}
                                        theme={selectTheme}
                                    />
                                )}
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary" disabled={mutation.isLoading}>
                                    {mutation.isLoading ? 'Saving...' : 'Add Transfer'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransfer;
