import { useState } from 'react';
import Header from './components/header';
import ProductView from './components/ProductView';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';
import { useNotifications } from '../hook/Notification';

const Products = () => {
  const { settings } = useSettings();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { removeNotificationByTitle } = useNotifications();

  removeNotificationByTitle("Products");
  const fetchProducts = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/products/display-all.php`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  };

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    refetchInterval: settings.refresh_frequency,
    staleTime: 30000
  });



  const filteredProducts = products.filter((product) =>
  (product.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ProductCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.CategoryName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="Custheader">
        <Header title="Products" />
      </div>

      <div className="Custbody">
        {isLoading && <div className="alert alert-info">Loading products...</div>}
        {isError && <div className="alert alert-danger">{error.message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, barcode or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="d-flex align-items-center">
            <CSVLink
              data={filteredProducts}
              headers={[
                { label: 'Product ID', key: 'ProductID' },
                { label: 'Product Name', key: 'ProductName' },
                { label: 'Barcode', key: 'BarCode' },
                { label: 'Product Code', key: 'ProductCode' },
                { label: 'Category', key: 'CategoryName' },
                { label: 'Supplier', key: 'SupplierName' },
                { label: 'Warehouse', key: 'WarehouseName' }
              ]}
              filename="products_export.csv"
              className="btn btn-outline-success d-flex align-items-center me-2"
            >
              <i className="fas fa-file-csv me-1"></i> CSV
            </CSVLink>


          </div>
        </div>

<div className="table-responsive" style={{ overflowX: 'auto' }}>
  <table className="table table-bordered table-hover align-middle">
    <thead className="table-light text-nowrap">
      <tr>
        <th className="text-center">No.</th>
        <th>Image</th>
        <th>Title | <span className="text-muted">Barcode</span></th>
        <th>Product code</th>
        <th>Category</th>
        <th>Supplier</th>
        <th className="text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts.map((product, index) => (
        <tr key={product.ProductID} className="text-nowrap">
          <td className="text-center">{index + 1}</td>
          <td>
            <img
              src={`${settings.api_url}/${product.ProductImage}`}
              width="50"
              height="50"
              className="img-thumbnail"
              alt="Product"
            />
          </td>
          <td>
            <strong>{product.ProductName}</strong>
            <hr className="m-0 p-0" />
            <small className="text-muted">{product.BarCode}</small>
          </td>
          <td>{product.ProductCode}</td>
          <td>{product.CategoryName}</td>
          <td>{product.SupplierName}</td>
          <td className="text-center">
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={() => setSelectedProduct(product)}
            >
              More info
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>

      {selectedProduct && (
        <ProductView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDeleteSuccess={() => {
            setSelectedProduct(null);
            refetch();
          }}
          onEditSuccess={() => {
            setSelectedProduct(null);
            refetch();
          }}
        />
      )}
    </>
  );
};

export default Products;
