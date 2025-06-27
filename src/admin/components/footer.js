import React, { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    const toggleBtn = document.getElementById('toggleBtn');
    const wrapper = document.querySelector('.wrapper');
    const icon = toggleBtn?.querySelector('i');

    if (toggleBtn && wrapper && icon) {
      const handleClick = () => {
        wrapper.classList.toggle('collapsed');
        icon.classList.toggle('fa-angle-left');
        icon.classList.toggle('fa-angle-right');
      };

      toggleBtn.addEventListener('click', handleClick);

      // Responsive icon toggle on load
      if (window.innerWidth < 768) {
        if (wrapper.classList.contains('collapsed')) {
          icon.classList.remove('fa-angle-right');
          icon.classList.add('fa-angle-left');
        } else {
          icon.classList.remove('fa-angle-left');
          icon.classList.add('fa-angle-right');
        }
      } else {
        icon.classList.remove('fa-angle-right', 'fa-angle-left');
        icon.classList.add('fa-angle-left');
      }

      // Cleanup
      return () => {
        toggleBtn.removeEventListener('click', handleClick);
      };
    }
  }, []);

};

export default Footer;
