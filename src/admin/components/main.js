import React, { useState, useEffect } from 'react';
import '../styles.css';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom'; // Import this

const Main = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    // Lock body scroll on mobile only
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 769) {
      document.body.classList.add('sidebar-lock');
    } else {
      document.body.classList.remove('sidebar-lock');
    }
  }, [sidebarOpen]);

  // Closes only on mobile
  const handleMobileSidebarClose = () => {
    if (window.innerWidth < 769) {
      setSidebarOpen(false);
    }
  };


  return (
    <>
      <div className={`Custsidebar ${sidebarOpen ? 'open' : ''}`}>
         <div className="sidebar w-100">
          <Sidebar isOpen={sidebarOpen} onClose={handleMobileSidebarClose} />
        </div>
        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <i className="fas fa-angle-left"></i> : <i className="fas fa-angle-right"></i>}
        </button>
      </div>

      <div className={`wrapper ${sidebarOpen ? 'shifted' : ''}`}>
        <div className={`Custcontainer ${sidebarOpen ? 'sidebar-open blurred' : ''}`}>
          <Outlet /> {/* Use Outlet here for route content */}
        </div>
      </div>
    </>
  );
};

export default Main;
