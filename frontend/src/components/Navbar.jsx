import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const links = [
    { name: 'Authority', path: '/authority', icon: '👥' },
    { name: 'Bin', path: '/bin', icon: '🗂️' },
    { name: 'Driver', path: '/driver', icon: '🚗' },
    { name: 'User', path: '/user', icon: '👤' },
    { name: 'Vehicle', path: '/vehicle', icon: '🚛' }
  ];
  
      const navStyles = {
        background: '#343a40',
        padding: '12px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      };

  const containerStyles = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

      const logoStyles = {
        fontSize: '1.4rem',
        fontWeight: '600',
        color: 'white',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      };

  const navLinksStyles = {
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
  };

      const linkStyles = (isActive) => ({
        color: isActive ? '#007bff' : '#ffffff',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        background: isActive ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.9rem',
      });

      const homeLinkStyles = (isActive) => ({
        ...linkStyles(isActive),
        background: isActive ? '#007bff' : '#6c757d',
        color: 'white',
        fontWeight: '600',
      });
  
  return (
    <nav style={navStyles}>
      <div style={containerStyles}>
        <Link to="/" style={homeLinkStyles(location.pathname === '/')}>
          🏠 Home
        </Link>
        
        <div style={navLinksStyles}>
          {links.map(link => (
            <Link 
              key={link.name} 
              to={link.path} 
              style={linkStyles(location.pathname === link.path)}
            >
              <span>{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;