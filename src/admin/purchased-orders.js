import { useState } from 'react';
import Header from './components/header';
import PurchasedOrderView from './components/PurchasedOrderView';
import NewPurchaseOrder from './components/NewPurchaseOrder';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';

const PurchasedOrders = () => {
  const { settings } = useSettings();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  const fetchPurchasedOrders = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/purchasedorder/display-all.php`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error("Failed to fetch purchased orders");
    const json = await res.json();
    return json.data || [];
  };

  const {
    data: purchasedOrders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['purchasedOrders'],
    queryFn: fetchPurchasedOrders,
    refetchInterval: Number(settings.refresh_frequency) || 10000,
    staleTime: 30000,
  });


  const handleViewClick = (order) => setSelectedOrder(order);
  const handleCloseView = () => setSelectedOrder(null);


  const handleCreateNewOrder = () => setShowNewOrderForm(true);
  const handleCloseNewOrder = () => setShowNewOrderForm(false);
  const handleNewOrderSuccess = () => {
    handleCloseNewOrder();
    queryClient.invalidateQueries(['purchasedOrders']);
  };


  const filteredOrders = purchasedOrders.filter((order) =>
    `${order.order_id} ${order.product_name} ${order.order_date} ${order.expected_date} ${order.supplier} ${order.status}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="Custheader">
        <Header title="Purchased Orders" />
      </div>

      <div className="Custbody">
        {isLoading && <div className="alert alert-info">Loading purchased orders...</div>}
        {isError && <div className="alert alert-danger">{error.message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="input-group w-50">

            <input
              type="text"
              className="form-control"
              placeholder="Search by Order ID or Supplier"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="d-flex gap-2">


            <CSVLink
              data={purchasedOrders}
              headers={[
                { label: 'Order ID', key: 'order_id' },
                { label: 'Order Date', key: 'order_date' },
                { label: 'Expected Date', key: 'expected_date' },
                { label: 'Quantity', key: 'quantity' },
                { label: 'Product Name', key: 'product_name' },
                { label: 'Supplier', key: 'supplier' },
              ]}
              filename="purchased_orders.csv"
              className="btn btn-outline-success d-flex align-items-center"
            >
              <i className="fas fa-file-csv me-1"></i> CSV
            </CSVLink>

            <button className="btn btn-outline-primary" onClick={handleCreateNewOrder}>
              <i className="fas fa-plus me-1"></i> Add
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light text-nowrap">
              <tr>
                <th>No.</th>
                <th>Product Name</th>
                <th>Ordered Date</th>
                <th>Expected Date</th>
                <th>Quantity</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7">No matching orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={order.order_id} className="text-nowrap">
                    <td>{index + 1}</td>
                    <td>{order.product_name}</td>
                    <td>
                      {new Date(order.order_date).toLocaleDateString()}<br />
                      <small className="text-muted">
                        {new Date(order.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </small>
                    </td>
                    <td>
                      {new Date(order.expected_date).toLocaleDateString()}<br />
                      <small className="text-muted">
                        {new Date(order.expected_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </small>
                    </td>



                    <td>{order.quantity}</td>
                    <td>{order.supplier}</td>
                    <td>
                      <span className={
                        order.status === 'Approved' ? 'text-success' :
                          order.status === 'Rejected' ? 'text-danger' :
                            'text-warning'
                      }>
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewClick(order)}
                      >
                        More info
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {selectedOrder && (
        <PurchasedOrderView
          purchasedOrder={selectedOrder}
          onClose={handleCloseView}
          onSaved={() => {
            handleCloseView();
            queryClient.invalidateQueries(['purchasedOrders']);
          }}
        />
      )}


      {showNewOrderForm && (
        <div className="modal show d-block mb-4" >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Purchase Order</h5>
                <button type="button" className="btn-close" onClick={handleCloseNewOrder}></button>
              </div>
              <div className="modal-body">
                <NewPurchaseOrder onSuccess={handleNewOrderSuccess} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchasedOrders;
