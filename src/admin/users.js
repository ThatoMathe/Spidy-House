import { useState, useEffect } from 'react';
import Header from './components/header';
import UserView from './components/UserView';
import { useQuery } from '@tanstack/react-query';
import AddUser from './components/AddUser';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';
import { useNotifications } from '../hook/Notification';

const Users = () => {
  const { settings } = useSettings();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  const { removeNotificationByTitle } = useNotifications();

  removeNotificationByTitle("Users");
  const fetchSuppliers = async () => {
    const res = await fetch(`${settings.api_url}/api/v1/users/display-all.php`, {
      credentials: 'include' // Include session/cookies
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  };


  // useQuery with correct function
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch, // Add refetch here
  } = useQuery({
    queryKey: ['Users'],
    queryFn: fetchSuppliers,
    refetchInterval: settings.refresh_frequency,
    staleTime: 30000,
  });


  const handleViewClick = (user) => {
    setSelectedUser(user);
  };



  const handleCloseView = () => {
    setSelectedUser(null);
    setShowAddUser(false);
  };

  // Optional: Basic filter logic
  const filteredUsers = users.filter((user) => {
    const value = `${user.UserName} ${user.UserEmail} ${user.Role}`.toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  return (
    <>
        <div className="Custheader">
          <Header title="Users" />
        </div>

        <div className="Custbody">
          {isLoading && <div className="alert alert-info">Loading users...</div>}
          {isError && <div className="alert alert-danger">{error.message}</div>}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="input-group w-50">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email or role"
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
                data={filteredUsers}
                headers={[
                  { label: 'User ID', key: 'UserID' },
                  { label: 'Username', key: 'UserName' },
                  { label: 'Email', key: 'Email' },
                  { label: 'Role', key: 'Role' }
                ]}
                filename="users_export.csv"
                className="btn btn-outline-success d-flex align-items-center me-2"
              >
                <i className="fas fa-file-csv me-1"></i> CSV
              </CSVLink>

              <button
                className="btn btn-outline-primary btn-primary me-2"
                onClick={() => setShowAddUser(true)} // fix
              >
                <i className="fas fa-plus me-1"></i> Add
              </button>



            </div>
          </div>

          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light text-nowrap">
                <tr>
                  <th className="text-center">No.</th>
                  <th>Name</th>
                  <th>Email Address</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.UserID} className="text-nowrap">
                    <td className="text-center" >{index + 1}</td>
                    <td><strong>{user.UserName}</strong></td>
                    <td>{user.Email}</td>
                    <td className="text-center">{user.Role || '-'}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleViewClick(user)}
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
    


      {selectedUser && (
        <UserView
          user={selectedUser}
          onClose={handleCloseView}
          refetch={refetch} // Pass refetch to UserView
        />
      )}
      {showAddUser && (
        <AddUser onClose={handleCloseView} refetch={refetch} />
      )}
    </>
  );
};

export default Users;
