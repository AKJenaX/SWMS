import React from 'react';

function TableTemplate({ data, columns, entityIdKey, onEdit, onDelete }) {
      const tableContainerStyles = {
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px 0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        border: '2px solid #dee2e6',
        borderTop: '4px solid #e74c3c',
        overflow: 'hidden',
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

  const noDataStyles = {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '1.1rem',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '10px',
    border: '2px dashed rgba(102, 126, 234, 0.3)',
  };

  const tableStyles = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  };

      const thStyles = {
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        color: 'white',
        padding: '12px 10px',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #c0392b',
      };

  const tdStyles = {
    padding: '12px',
    borderBottom: '1px solid #e1e5e9',
    background: 'rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
  };

  const trStyles = {
    transition: 'all 0.3s ease',
  };

      const actionButtonStyles = {
        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginRight: '6px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 6px rgba(231, 76, 60, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      };

      const deleteButtonStyles = {
        background: 'linear-gradient(135deg, #6c757d, #495057)',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 6px rgba(108, 117, 125, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      };

  if (!data || data.length === 0) {
    return (
      <div style={tableContainerStyles}>
        <h3 style={headerStyles}>📊 All Records</h3>
        <div style={noDataStyles}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
          <div>No records found.</div>
          <div style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.7 }}>
            Add some records to see them here!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={tableContainerStyles}>
      <h3 style={headerStyles}>📊 All Records ({data.length})</h3>
      <table style={tableStyles}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={thStyles}>
                {col.header}
              </th>
            ))}
            <th style={thStyles}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={item[entityIdKey]} 
              style={{
                ...trStyles,
                background: index % 2 === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(248,249,250,0.8)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(248,249,250,0.8)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {columns.map(col => (
                <td key={col.key} style={tdStyles}>
                  {item[col.key] === null || item[col.key] === undefined ? (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>N/A</span>
                  ) : (
                    item[col.key]
                  )}
                </td>
              ))}
              <td style={tdStyles}>
                <button 
                  onClick={() => onEdit(item)} 
                  style={actionButtonStyles}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => onDelete(item[entityIdKey])} 
                  style={deleteButtonStyles}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(231, 76, 60, 0.3)';
                  }}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableTemplate;