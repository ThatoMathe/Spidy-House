import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Delay to ensure DOM has rendered
      setTimeout(() => {
        const el = document.getElementById(location.hash.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // 100ms is usually enough
    }
  }, [location]);

  return null; // nothing to render
};

export default ScrollToHash;
