import { useState, useEffect } from 'react';
import Header from './components/header';
import CategoryView from './components/CategoryView';
import AddCategory from './components/AddCategory';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';
import { useNotifications } from '../hook/Notification';

const Categories = () => {
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { removeNotificationByTitle } = useNotifications();

  removeNotificationByTitle("Categories");
  const fetchCategories = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/categories/display-all.php`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  };


  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    refetchInterval: Number(settings.refresh_frequency) || 10000,
    staleTime: 30000,
  });

  const filteredCategories = categories.filter(category =>
    category.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleViewClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCloseView = () => {
    setSelectedCategory(null);
    setShowAddCategory(false);
  };

  const handleNewClick = () => {
    setShowAddCategory(true);
  };

  return (
    <>
        <div className="Custheader">
          <Header title="Categories" />
        </div>

        <div className="Custbody">
          {isLoading && <div className="alert alert-info">Loading all categories...</div>}
          {isError && <div className="alert alert-danger">{error.message}</div>}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="input-group w-50">
              <input
                type="text"
                className="form-control"
                placeholder="Search by category name"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <div className="d-flex align-items-center">
              <CSVLink
                data={filteredCategories}
                headers={[
                  { label: 'Category ID', key: 'CategoryID' },
                  { label: 'Category Name', key: 'CategoryName' },
                ]}
                filename="categories_export.csv"
                className="btn btn-outline-success d-flex align-items-center me-2"
              >
                <i className="fas fa-file-csv me-1"></i> CSV
              </CSVLink>

              <button className="btn btn-outline-primary btn-primary me-2" onClick={handleNewClick}>
                <i className="fas fa-plus me-1"></i> Add
              </button>
            </div>
          </div>

          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-light text-nowrap">
                <tr>
                  <th>No.</th>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr key={category.CategoryID} className="text-nowrap">
                    <td>{index + 1}</td>
                    <td>{category.CategoryName}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleViewClick(category)}
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
   

      {selectedCategory && (
        <CategoryView
          category={selectedCategory}
          onClose={handleCloseView}
          refetch={refetch}
        />
      )}

      {showAddCategory && (
        <AddCategory onClose={handleCloseView} refetch={refetch} />
      )}
    </>
  );
};

export default Categories;
