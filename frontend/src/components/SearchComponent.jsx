import React, { useState } from 'react';

function SearchComponent({ entityName, entityIdKey, onSearch, onEdit, onDelete }) {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const handleSearchClick = async () => {
    if (!searchId) {
      setSearchError(`Please enter a ${entityName} ID.`);
      setSearchResult(null);
      return;
    }
    setSearchError(null);
    try {
      const record = await onSearch(searchId);
      setSearchResult(record);
      setSearchError(null);
    } catch (err) {
      setSearchResult(null);
      setSearchError(err.message || 'Record not found.');
    }
  };

      const searchContainerStyles = {
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        border: '2px solid #dee2e6',
        borderTop: '4px solid #e74c3c',
      };

      const headerStyles = {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '15px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        borderBottom: '2px solid #e74c3c',
        paddingBottom: '8px',
      };

      const searchInputStyles = {
        padding: '10px 12px',
        borderRadius: '5px',
        border: '2px solid #ced4da',
        fontSize: '0.95rem',
        marginRight: '12px',
        width: '180px',
        transition: 'all 0.3s ease',
        background: '#ffffff',
        fontFamily: 'inherit',
      };

      const searchButtonStyles = {
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      };

  const errorStyles = {
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '10px',
    marginTop: '15px',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
  };

  const resultContainerStyles = {
    marginTop: '20px',
    borderTop: '2px dashed rgba(102, 126, 234, 0.3)',
    paddingTop: '20px',
  };

  const resultHeaderStyles = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    textAlign: 'center',
  };

  const resultCardStyles = {
    background: 'rgba(255,255,255,0.9)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    marginBottom: '20px',
  };

  const fieldRowStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  };

  const fieldLabelStyles = {
    fontWeight: '600',
    color: '#555',
    fontSize: '0.9rem',
  };

  const fieldValueStyles = {
    color: '#333',
    fontSize: '0.9rem',
  };

  const actionButtonContainerStyles = {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '20px',
  };

      const editButtonStyles = {
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 6px rgba(231, 76, 60, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      };

      const deleteButtonStyles = {
        background: 'linear-gradient(135deg, #6c757d, #495057)',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 6px rgba(108, 117, 125, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      };

  return (
    <div style={searchContainerStyles}>
      <h3 style={headerStyles}>🔍 Search {entityName} by ID</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <input
          type="number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder={`Enter ${entityName} ID`}
          style={searchInputStyles}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e1e5e9';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button 
          onClick={handleSearchClick} 
          style={searchButtonStyles}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }}
        >
          🔍 Search
        </button>
      </div>

      {searchError && <div style={errorStyles}>⚠️ {searchError}</div>}

      {searchResult && (
        <div style={resultContainerStyles}>
          <h4 style={resultHeaderStyles}>
            ✅ Search Result: {entityName} ID {searchResult[entityIdKey]}
          </h4>
          <div style={resultCardStyles}>
            {Object.entries(searchResult).map(([key, value]) => {
              // Skip the ID field since it's already shown in the header
              if (key === entityIdKey) return null;
              
              // Format the field name for display
              const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              // Handle null values
              const displayValue = value === null || value === undefined ? 'N/A' : value;
              
              return (
                <div key={key} style={fieldRowStyles}>
                  <span style={fieldLabelStyles}>{displayKey}:</span>
                  <span style={fieldValueStyles}>{displayValue}</span>
                </div>
              );
            })}
          </div>
          <div style={actionButtonContainerStyles}>
            <button 
              onClick={() => onEdit(searchResult)} 
              style={editButtonStyles}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              ✏️ Edit This Record
            </button>
            <button 
              onClick={() => onDelete(searchResult[entityIdKey])} 
              style={deleteButtonStyles}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
              }}
            >
              🗑️ Delete This Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchComponent;