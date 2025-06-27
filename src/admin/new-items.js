import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './components/header';
import { BrowserMultiFormatReader } from '@zxing/browser';
import beepsound from './assets/store-scanner-beep.mp3';
import ProcessProduct from './components/process-product';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';

const BarcodeScanner = () => {
  const { settings } = useSettings();
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState(null);
  const [error, setError] = useState(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const streamControls = useRef(null);
  const beepSound = useRef(new Audio(beepsound));
  const [showProcessProduct, setShowProcessProduct] = useState(false);
  const [searchParams] = useSearchParams();
  const inventoryID = searchParams.get('id');

  const fetchValidation = async ({ queryKey }) => {
    const [, inventoryID] = queryKey;
    const res = await fetch(`${settings.api_url}/api/v1/inventory/display-one.php?id=${inventoryID}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  };

  const { data: inventory = [], isLoading, isError } = useQuery({
    queryKey: ['inventory', inventoryID],
    queryFn: fetchValidation,
    enabled: !!inventoryID,
    refetchInterval: settings.refresh_frequency,
    staleTime: 30000,
  });

  const startScanner = () => {
    BrowserMultiFormatReader.listVideoInputDevices()
      .then((devices) => {
        if (!devices.length) throw new Error('No video input devices found.');

        const backCamera = devices.find(d => d.label.toLowerCase().includes('back'));
        const selectedDeviceId = backCamera?.deviceId || devices[0].deviceId;

        return codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err, controls) => {
            if (result) {
              beepSound.current.play();
              setBarcode(result.getText());
              setShowProcessProduct(true);
              controls.stop();
            }
            if (err && err.name !== 'NotFoundException') {
              console.warn('Decode error:', err);
            }
            streamControls.current = controls;
          }
        );
      })
      .catch((err) => {
        console.error('Camera error:', err);
        setError('Could not access camera.');
      });
  };

  useEffect(() => {
    beepSound.current.load();
    beepSound.current.onerror = (e) => console.error('Audio error:', e);
    startScanner();

    const handleVisibilityChange = () => {
      if (document.hidden && streamControls.current) {
        streamControls.current.stop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (streamControls.current) streamControls.current.stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleManualEntry = (e) => {
    if (e.key === 'Enter') {
      const value = e.target.value.trim();
      if (value) {
        if (streamControls.current) streamControls.current.stop();
        setBarcode(value);
        setShowProcessProduct(true);
      }
    }
  };

  return (
    <>
      <div className="Custheader">
        <Header title="Processing product" />
      </div>

      <div className="Custbody">
        <div className="container-fluid p-3">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-5">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading inventory data...</p>
                </div>
              ) : !showProcessProduct ? (
                inventory?.productAvailable === false ? (
                  <div className="card shadow-sm p-3">
                    {error && <p className="text-danger">{error}</p>}
                    <p>🔍 Scanning... Hold a barcode in front of the camera</p>
                    <video
                      ref={videoRef}
                      className="w-100 rounded"
                      muted
                      playsInline
                    />
                    <div className="mt-3">
  <label htmlFor="manualBarcode" className="form-label">Manual Barcode Entry:</label>
  <div className="input-group">
    <input
      type="text"
      id="manualBarcode"
      className="form-control"
      placeholder="Enter barcode manually"
      onKeyDown={handleManualEntry}
    />
    <button
      className="btn btn-outline-secondary"
      type="button"
      onClick={startScanner}
    >
      Refresh Camera
    </button>
  </div>

  <button
    className="btn btn-success mt-2 w-100"
    type="button"
    onClick={() => {
      const manual = document.getElementById('manualBarcode')?.value?.trim();
      if (!barcode && !manual) return alert('Please enter a barcode first.');
      if (!barcode && manual) setBarcode(manual);
      setShowProcessProduct(true);
    }}
  >
    Continue
  </button>

  <small className="text-muted">Press Enter after typing the barcode.</small>
</div>

                  </div>
                ) : (
                  <div className="card shadow-sm p-3 bg-light text-center">
                    <h5 className="mb-3 text-success">Product Already Processed</h5>
                    <p className="text-muted">This product has already been handled. No further action is required.</p>
                  </div>
                )
              ) : null}

              <div className="mt-4">
                <BluetoothSettings />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProcessProduct && (
        <ProcessProduct
          barcode={barcode}
          inventory={inventory}
          onCancel={() => {
            setShowProcessProduct(false);
            setBarcode(null);
            startScanner();
          }}
        />
      )}
    </>
  );
};

export default BarcodeScanner;

export const BluetoothSettings = () => {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const connectToDevice = async () => {
    try {
      setError('');
      setLoading(true);

      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });

      setDevice(selectedDevice);
    } catch (err) {
      setError(err.message || 'Bluetooth connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      <h5 className="mb-3">Bluetooth Device Settings</h5>
      {device ? (
        <div className="alert alert-success">
          Connected to <strong>{device.name || 'Unnamed Device'}</strong>
        </div>
      ) : (
        <button className="btn btn-primary w-100" onClick={connectToDevice} disabled={loading}>
          {loading ? 'Connecting...' : 'Scan & Connect'}
        </button>
      )}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};
