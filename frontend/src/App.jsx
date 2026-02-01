import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// Import all your page components
import AuthorityPage from './pages/Authority';
import BinPage from './pages/Bin';
import DriverPage from './pages/Driver';
import UserPage from './pages/User';
import VehiclePage from './pages/Vehicle';

function App() {
      const appStyles = {
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
      };

  const containerStyles = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    minHeight: 'calc(100vh - 80px)',
  };

      const welcomeStyles = {
        textAlign: 'center',
        color: '#333',
        fontSize: '2rem',
        fontWeight: '600',
        marginTop: '40px',
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      };

  return (
    <div style={appStyles}>
      <Router>
        <Navbar />
        <div style={containerStyles}>
          <Routes>
            {/* Default landing page */}
                <Route path="/" element={
                  <div style={welcomeStyles}>
                    <h1>Waste Management System</h1>
                    <p style={{ fontSize: '1.1rem', marginTop: '20px', color: '#666' }}>
                      Database Management System for Waste Collection Operations
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '20px',
                      marginTop: '30px'
                    }}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #e8f4fd, #d1ecf1)', 
                        padding: '20px', 
                        borderRadius: '10px',
                        border: '2px solid #007bff',
                        boxShadow: '0 4px 8px rgba(0,123,255,0.2)'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#0056b3' }}>👥 Authority</h4>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#333' }}>Manage waste management authorities and their organizational hierarchy</p>
                      </div>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #d1ecf1, #bee5eb)', 
                        padding: '20px', 
                        borderRadius: '10px',
                        border: '2px solid #17a2b8',
                        boxShadow: '0 4px 8px rgba(23,162,184,0.2)'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#0c5460' }}>🚗 Driver</h4>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#333' }}>Handle driver information, assignments, and workforce management</p>
                      </div>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)', 
                        padding: '20px', 
                        borderRadius: '10px',
                        border: '2px solid #dc3545',
                        boxShadow: '0 4px 8px rgba(220,53,69,0.2)'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#721c24' }}>🚛 Vehicle</h4>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#333' }}>Track and manage waste collection vehicles and fleet operations</p>
                      </div>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)', 
                        padding: '20px', 
                        borderRadius: '10px',
                        border: '2px solid #ffc107',
                        boxShadow: '0 4px 8px rgba(255,193,7,0.2)'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#856404' }}>🗂️ Bin</h4>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#333' }}>Monitor waste bins, their locations, and collection schedules</p>
                      </div>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f0f8ff, #e6f3ff)', 
                        padding: '20px', 
                        borderRadius: '10px',
                        border: '2px solid #28a745',
                        boxShadow: '0 4px 8px rgba(40,167,69,0.2)'
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#155724' }}>👤 User</h4>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#333' }}>Manage system users, their profiles, and access permissions</p>
                      </div>
                    </div>
                  </div>
                } />
            
            {/* Routes for each entity management page */}
            <Route path="/authority" element={<AuthorityPage />} />
            <Route path="/bin" element={<BinPage />} />
            <Route path="/driver" element={<DriverPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/vehicle" element={<VehiclePage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;