import { useState, useEffect } from 'react';
import Header from './components/header';
import { toast } from 'react-toastify';
import { useSettings } from '../context/SettingsContext';

const Settings = () => {
  const [message, setMessage] = useState('');
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    api_url: '',
    environment: '',
    site_name: '',
    tagline: '',
    refresh_frequency: '',
    gemini_api: '',
    logo_300_url: '',
    logo_200_url: '',
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    smtp_secure: '',
  });

useEffect(() => {
  fetch(`${settings.api_url}/api/v1/settings/general.php`, {
    credentials: 'include'
  })
    .then(res => res.json()) // Assuming the API returns JSON
    .then(data => {
      setFormData(prev => ({ ...prev, ...data }));
    })
    .catch(() => setMessage("Failed to load settings."));
}, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, field, uploadEndpoint, requiredWidth, requiredHeight) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      if (img.width !== requiredWidth || img.height !== requiredHeight) {
        toast.error(`Image size must be ${requiredWidth}x${requiredHeight}px`);

        return;
      }

      const form = new FormData();
      form.append("image", file);

      const res = await fetch(`${settings.api_url}/api/v1/settings/${uploadEndpoint}`, {
        method: "POST",
        body: form,
        credentials: 'include' // Include session/cookies
      });


      const data = await res.json();
      if (data.success && data.url) {
        toast.success('Settings saved successfully.');
        setFormData(prev => ({ ...prev, [field]: data.url }));
      } else {
        toast.error(data.error || 'Upload failed');
      }
    };
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const res = await fetch(`${settings.api_url}/api/v1/settings/general.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include' // Include session/cookies
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || 'Settings saved successfully.');
      } else {
        toast.error(result.message || 'Failed to save settings.');
      }

    } catch {
      toast.error("Failed to save settings due to network error.");
    }
  };


  return (
    <>

      <div className="Custheader">
        <Header title="Settings" />
      </div>

      <div className="Custbody">
        <div className="container py-4">
          <h3>Environment Settings</h3>
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>API URL</label>
                <input name="api_url" className="form-control" value={formData.api_url} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label>Environment</label>
                <select name="environment" className="form-select" value={formData.environment} onChange={handleChange}>
                  <option value="development">Development</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>

            <hr />
            <h4>Site Info</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Site Name</label>
                <input name="site_name" className="form-control" value={formData.site_name} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label>Tagline</label>
                <input name="tagline" className="form-control" value={formData.tagline} onChange={handleChange} />
              </div>
            </div>

            <hr />
            <h4>Real Time</h4>
            <div className="mb-3">
              <label>Refresh Frequency (in seconds)</label>
              <input name="refresh_frequency" type="number" className="form-control" value={formData.refresh_frequency} onChange={handleChange} />
            </div>

            <hr />
            <h4>Google Gemini API</h4>
            <div className="mb-3">
              <label>API KEY</label>
              <input name="gemini_api" type="text" className="form-control" value={formData.gemini_api} onChange={handleChange} />
            </div>

            <hr />
            <h4>Email (SMTP) Settings</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>SMTP Host</label>
                <input name="smtp_host" className="form-control" value={formData.smtp_host} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label>SMTP Port</label>
                <input name="smtp_port" type="number" className="form-control" value={formData.smtp_port} onChange={handleChange} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>SMTP Username</label>
                <input name="smtp_user" className="form-control" value={formData.smtp_user} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label>SMTP Password</label>
                <input name="smtp_pass" type="password" className="form-control" value={formData.smtp_pass} onChange={handleChange} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>SMTP Secure (tls or ssl)</label>
                <input name="smtp_secure" className="form-control" value={formData.smtp_secure} onChange={handleChange} />
              </div>
            </div>

            <hr />
            <h4>Site Logos</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Logo (300x300)</label>
                <input type="file" accept="image/*" className="form-control"
                  onChange={(e) => handleImageUpload(e, 'logo_300_url', 'upload-logo-300.php', 300, 300)}
                />
                {formData.logo_300_url && <img src={formData.api_url + formData.logo_300_url} alt="Logo 300x300" className="img-thumbnail mt-2" style={{ maxHeight: '150px' }} />}
              </div>
              <div className="col-md-6 mb-3">
                <label>Banner (500x200)</label>
                <input type="file" accept="image/*" className="form-control"
                  onChange={(e) => handleImageUpload(e, 'logo_200_url', 'upload-logo-200.php', 500, 200)}
                />
                {formData.logo_200_url && <img src={formData.api_url + formData.logo_200_url} alt="Banner 200x500" className="img-thumbnail mt-2" style={{ maxHeight: '150px' }} />}
              </div>
            </div>



            <button type="submit" className="btn btn-primary">Save Settings</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
