import React, { useState } from 'react';
import Header from './components/header';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../context/SettingsContext';
import { CSVLink } from 'react-csv';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import EntryView from './components/entryview';

const Reports = () => {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const [tempFilterType, setTempFilterType] = useState('all');
  const [tempDateRange, setTempDateRange] = useState([null, null]);
const isDarkMode = document.body.classList.contains("dark-mode");

const fetchActivity = async () => {
  const res = await fetch(`${settings.api_url}/api/v1/reports/display-all.php`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error("Failed to fetch activity log");
  return res.json();
};


const {
  data: activity = [],
  isLoading,
  isError,
  error,
  refetch // ⬅ Add this line
} = useQuery({
  queryKey: ['userActivity'],
  queryFn: fetchActivity,
  refetchInterval: Number(settings.refresh_frequency) || 10000,
  staleTime: 30000,
});


  const today = new Date().toISOString().split('T')[0];

  const filteredActivity = activity.filter(entry => {
    const entryDate = entry.Date;
    const entryDateObj = new Date(entryDate);
    const matchesSearch =
      entry.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.Description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'today') {
      return matchesSearch && entryDate === today;
    }

    if (filterType === 'range') {
      const isInRange =
        startDate &&
        endDate &&
        entryDateObj >= startDate &&
        entryDateObj <= endDate;
      return matchesSearch && isInRange;
    }

    return matchesSearch;
  });

  const applyFilters = () => {
    setSearchTerm(tempSearch);
    setFilterType(tempFilterType);
    setDateRange(tempDateRange);
    setShowModal(false);
  };

  return (
    <>
      <div className="Custheader">
        <Header title="Reports" />
      </div>

      <div className="Custbody">
        {isLoading && <div className="alert alert-info">Loading reports...</div>}
        {isError && <div className="alert alert-danger">{error.message}</div>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="input-group w-50 me-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

            <button className="btn btn-outline-secondary">
              <i className="fas fa-search"></i>
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setTempSearch(searchTerm);
                setTempFilterType(filterType);
                setTempDateRange(dateRange);
                setShowModal(true);
              }}
            >
              <i className="fas fa-filter"></i>
            </button>
          </div>
          <div className="d-flex align-items-center">
            <CSVLink
              data={filteredActivity}
              headers={[
                { label: 'Report ID', key: 'ReportID' },
                { label: 'User ID', key: 'UserID' },
                { label: 'Username', key: 'Username' },
                { label: 'Date', key: 'Date' },
                { label: 'Time', key: 'Time' },
                { label: 'Title', key: 'Title' },
                { label: 'Description', key: 'Description' }
              ]}
              filename="user_activity_log.csv"
              className="btn btn-outline-success d-flex align-items-center me-2"
            >
              <i className="fas fa-file-csv me-1"></i>CSV
            </CSVLink>


          </div>
        </div>

        {/* Table */}
<div className="table-responsive">
  <table className="table table-bordered table-hover align-middle text-center">
    <thead className="table-light text-nowrap">
      <tr>
        <th>No.</th>
        <th>Username</th>
        <th>Date | <span className="text-muted">Time</span></th>
        <th>Title</th>
        <th>Description</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredActivity.length > 0 ? (
        filteredActivity.map((entry, index) => (
          <tr key={entry.ReportID}>
            <td>{index + 1}</td>
            <td className="text-nowrap">{entry.Username}</td>
            <td className="text-nowrap">
              <strong>{entry.Date}</strong>
              <hr className="m-0 p-0" />
              <small className="text-muted">{entry.Time}</small>
            </td>
            <td className="text-nowrap">{entry.Title}</td>
            <td className="text-break" style={{ maxWidth: '200px' }}>{entry.Description}</td>
            <td>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setSelectedEntry(entry)}
              >
                More info
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-muted">No matching records found</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>

{/* Filter Modal */}
{showModal && (
  <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Filter</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>

        <div className="modal-body">
<div className="mb-3">
  <label className="form-label fw-semibold">Filter Type</label>
  <div className="d-flex gap-2 w-100">
    {['all', 'today', 'range'].map(type => (
      <div
        key={type}
        className={`card px-3 py-3 text-center flex-fill ${
          tempFilterType === type ? 'border-primary bg-light' : 'border-secondary'
        }`}
        style={{ cursor: 'pointer' }}
        onClick={() => setTempFilterType(type)}
      >
        <div className={`fw-semibold ${tempFilterType === type ? 'text-primary' : ''}`}>
          {type === 'all' && 'All'}
          {type === 'today' && 'Today'}
          {type === 'range' && 'Date Range'}
        </div>
      </div>
    ))}
  </div>
</div>


{tempFilterType === 'range' && (
  <div className="mb-3 text-center">
    <label className="form-label fw-semibold mb-3 d-block">
      <i className="fas fa-calendar-alt me-2 text-primary"></i> Select Date Range
    </label>

    <div className="d-flex justify-content-center">
<DayPicker
  mode="range"
  selected={{
    from: tempDateRange[0],
    to: tempDateRange[1],
  }}
  onSelect={(range) =>
    setTempDateRange([range?.from || null, range?.to || null])
  }
  numberOfMonths={2}
  showOutsideDays
  className={isDarkMode ? 'daypicker-dark' : ''}
/>

    </div>

    <small className="text-muted mt-2 d-block">
      Choose a start and end date for filtering
    </small>
  </div>
)}





        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={applyFilters}>Apply</button>
        </div>
      </div>
    </div>
  </div>
)}
{selectedEntry && (
  <EntryView
    data={selectedEntry}
    onClose={() => setSelectedEntry(null)}
    onEdit={(updatedData) => {
      setSelectedEntry(null);
      refetch(); // ⬅ Refresh the table after editing
    }}
    onDelete={(entryToDelete) => {
      setSelectedEntry(null);
      refetch(); // ⬅ Refresh the table after deleting
    }}
  />
)}


    </>
  );
};

export default Reports;
