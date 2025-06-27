import React, { useState, useEffect } from 'react';
import '../admin/styles.css';
import Header from '../admin/components/header';
import { toast } from 'react-toastify';
import { useSettings } from '../context/SettingsContext';

const SettingsPage = () => {
  const { settings } = useSettings();
  const [loading2FA, setLoading2FA] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [activeTab, setActiveTab] = useState('password');

const [allSessions, setAllSessions] = useState([]);
const [currentSessionId, setCurrentSessionId] = useState(null);

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

useEffect(() => {
  fetch(`${settings.api_url}/api/v1/profile/settings.php`, {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      setSessionInfo(data);
      setAllSessions(data.sessions || []);
      setCurrentSessionId(data.current_session_id || null);

      if (data.is_2fa_enabled !== undefined) {
        setIs2FAEnabled(data.is_2fa_enabled === 1);
      }
    })
    .catch(() => toast.error('Failed to fetch session info.'));
}, [settings.api_url]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { new_password, confirm_password } = passwords;

    if (!new_password || new_password !== confirm_password) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    try {
      const res = await fetch(`${settings.api_url}/api/v1/profile/change-password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords),
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message || 'Password updated.');
        setPasswords({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        toast.error(result.message || 'Failed to update password.');
      }
    } catch {
      toast.error('Network error while changing password.');
    }
  };

  const handleToggle2FA = async () => {
    setLoading2FA(true);
    try {
      const res = await fetch(`${settings.api_url}/api/v1/profile/update-2fa.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enable_2fa: !is2FAEnabled }),
        credentials: 'include',
      });

      const result = await res.json();

      if (result.success) {
        setIs2FAEnabled(!is2FAEnabled);
        toast.success(`Two-Factor Authentication ${!is2FAEnabled ? 'enabled' : 'disabled'}.`);
      } else {
        toast.error(result.message || 'Failed to update 2FA.');
      }
    } catch {
      toast.error('Network error while updating 2FA.');
    } finally {
      toast.error('Failed to update 2FA.');
      setLoading2FA(false);
    }
  };



  return (
    <>
      <div className="Custheader">
        <Header title="Settings" />
      </div>

      <div className="Custbody">
        <div className="container py-1">

          {/* Tabs Navigation */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link text-muted ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link text-muted ${activeTab === '2fa' ? 'active' : ''}`}
                onClick={() => setActiveTab('2fa')}
              >
                Two-Factor Auth
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link text-muted ${activeTab === 'session' ? 'active' : ''}`}
                onClick={() => setActiveTab('session')}
              >
                Session Info
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h4>Change Password</h4>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="current_password"
                      className="form-control"
                      value={passwords.current_password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="new_password"
                      className="form-control"
                      value={passwords.new_password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      className="form-control"
                      value={passwords.confirm_password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </form>
              </div>
            )}

            {/* Two-Factor Authentication Tab */}
            {activeTab === '2fa' && (
              <div>
                <h4>Two-Factor Authentication (2FA)</h4>
                <div className="form-check form-switch d-flex align-items-center gap-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="2faSwitch"
                    checked={is2FAEnabled}
                    onChange={handleToggle2FA}
                    disabled={loading2FA}
                  />
                  <label className="form-check-label mb-0" htmlFor="2faSwitch">
                    {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </label>

                  {loading2FA && (
                    <div className="spinner-border spinner-border-sm text-primary ms-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Session Info Tab */}
            {activeTab === 'session' && (
              <div>
  <h4>Session Information</h4>

  {sessionInfo ? (
    <>
      <div className="mb-3">
        <p><strong>User:</strong> {sessionInfo.full_name}</p>
        <p><strong>Email:</strong> {sessionInfo.email}</p>
        <p><strong>Login Time:</strong> {sessionInfo.login_time}</p>
      </div>

      <h5 className="mt-5">Active Sessions</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th className='text-nowrap text-start'>IP Address</th>
              <th>User Agent</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allSessions.map((session) => (
              <tr
                key={session.Token}
                className={session.Token === currentSessionId ? 'table-success' : ''}
              >
                <td className="text-nowrap text-start small">{session.IPAddress}</td>
                <td className="text-break small" style={{ minWidth: '300px', overflowX: 'auto' }}>
                  <div className="overflow-auto">{session.UserAgent}</div>
                </td>
                <td className="text-nowrap text-start small">{session.CreatedAt || '—'}</td>
                <td>
                  {session.Token === currentSessionId ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-secondary">Other</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <p>Loading session details...</p>
  )}
</div>

            )}

          </div>

        </div>
      </div>
    </>
  );
};


export default SettingsPage;
