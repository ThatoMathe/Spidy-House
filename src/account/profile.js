import { useState, useEffect } from 'react';
import '../admin/styles.css';
import Header from '../admin/components/header';
import { toast } from 'react-toastify';
import { useSettings } from '../context/SettingsContext';

const AccountProfile = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    UserName: '',
    Email: '',
    Role: '',
    WarehouseName: '',
  });

  useEffect(() => {
    fetch(`${settings.api_url}/api/v1/profile/get.php`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFormData((prev) => ({
            ...prev,
            ...data.data,
          }));
        } else {
          toast.error('Failed to load profile.');
        }
      })
      .catch(() => toast.error('Failed to load profile.'));
  }, [settings.api_url]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${settings.api_url}/api/v1/profile/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserName: formData.UserName,
          Email: formData.Email,
        }),
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message || 'Profile updated successfully.');
      } else {
        toast.error(result.message || 'Failed to update profile.');
      }
    } catch {
      toast.error('Network error while updating profile.');
    }
  };

  return (
    <>
      <div className="Custheader">
        <Header title="Account Profile" />
      </div>

      <div className="Custbody">
        <div className="container py-4">
          <h3>My Profile</h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Username</label>
                <input
                  name="UserName"
                  className="form-control"
                  value={formData.UserName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  name="Email"
                  type="email"
                  className="form-control"
                  value={formData.Email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Role</label>
                <input
                  name="Role"
                  className="form-control"
                  value={formData.Role}
                  disabled
                />
              </div>
                          {formData.WarehouseName && (
              <div className="col-md-6 mb-3">
                <label>Warehouse</label>
                <input
                  className="form-control"
                  value={formData.WarehouseName}
                  disabled
                />
              </div>
            )}
            </div>

            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountProfile;
