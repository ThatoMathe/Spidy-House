import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useNotifications } from '../../hook/Notification';
import default_logo from '../../assets/images/logo_200.png';

const Sidebar = ({ onClose }) => {
  const { settings } = useSettings();
  const location = useLocation();
  const { pageCounts } = useNotifications();

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const renderBadge = (title) => {
    const count = pageCounts[title]?.count || 0;
    return count > 0 ? (
      <span
        className="badge bg-danger text-white d-inline-flex justify-content-center align-items-center"
        style={{
          borderRadius: '50%',
          minWidth: '22px',
          height: '22px',
          fontSize: '0.75rem',
          marginLeft: 'auto',
          marginRight: '12px',
        }}
      >
        {count}
      </span>
    ) : null;
  };

  return (
    <div className="pb-5 w-100">
      <div className="d-flex justify-content-center mb-3 mt-3">
        <img
          src={settings.logo_200_url ? settings.api_url + settings.logo_200_url : default_logo}
          alt="Logo"
          style={{ width: '80%', height: 'auto' }}
        />
      </div>

      <nav className="nav flex-column">
        <Link onClick={onClose} className={`nav-link ${isActive('/admin/dashboard')} d-flex justify-content-between align-items-center`} to="/admin/dashboard">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-tachometer-alt me-2"></i> Dashboard</span>
            {renderBadge('Dashboard')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/settings')} d-flex justify-content-between align-items-center`} to="/admin/settings">
          <span className="sidebar-header-text"><i className="fas fa-cogs me-2"></i> General Settings</span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/users')} d-flex justify-content-between align-items-center`} to="/admin/users">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-users me-2"></i> Users</span>
            {renderBadge('Users')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/stores')} d-flex justify-content-between align-items-center`} to="/admin/stores">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-store me-2"></i> Stores</span>
            {renderBadge('Stores')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/warehouses')} d-flex justify-content-between align-items-center`} to="/admin/warehouses">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-warehouse me-2"></i> Warehouses</span>
            {renderBadge('Warehouse')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/products')} d-flex justify-content-between align-items-center`} to="/admin/products">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-box me-2"></i> Products</span>
            {renderBadge('Products')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/categories')} d-flex justify-content-between align-items-center`} to="/admin/categories">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
          <span><i className="fas fa-th-large me-2"></i> Categories</span>
          {renderBadge('Categories')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/inventory')} d-flex justify-content-between align-items-center`} to="/admin/inventory">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-clipboard-list me-2"></i> Inventory</span>
            {renderBadge('Inventory')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/transfers')} d-flex justify-content-between align-items-center`} to="/admin/transfers">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-random me-2"></i> Transfers</span>
            {renderBadge('Transfers')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/suppliers')} d-flex justify-content-between align-items-center`} to="/admin/suppliers">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-truck-loading me-2"></i> Suppliers</span>
            {renderBadge('Suppliers')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/purchased-orders')} d-flex justify-content-between align-items-center`} to="/admin/purchased-orders">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-shopping-cart me-2"></i> Purchased Orders</span>
            {renderBadge('Purchased Orders')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/couriers')} d-flex justify-content-between align-items-center`} to="/admin/couriers">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-truck me-2"></i> Couriers</span>
            {renderBadge('Couriers')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/deliveries')} d-flex justify-content-between align-items-center`} to="/admin/deliveries">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-box me-2"></i> Deliveries</span>
            {renderBadge('Deliveries')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/returns')} d-flex justify-content-between align-items-center`} to="/admin/returns">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-undo-alt me-2"></i> Stock Returns</span>
            {renderBadge('Stock Returns')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>

        <Link onClick={onClose} className={`nav-link ${isActive('/admin/reports')} d-flex justify-content-between align-items-center`} to="/admin/reports">
          <span className="sidebar-header-text d-flex justify-content-between w-100">
            <span><i className="fas fa-chart-line me-2"></i> Reports</span>
            {renderBadge('Reports')}
          </span>
          <i className="fas fa-angle-right"></i>
        </Link>
      </nav>

      <div style={{ textAlign: 'center', width: '100%', paddingTop: '40px' }}>
        <small className="sidebar-header-text text-muted" style={{ fontSize: '0.6rem' }}>
          &copy; 2025 Spidy Warehouse
        </small>
      </div>
    </div>
  );
};

export default Sidebar;
