import React, { useState, useEffect } from 'react';

function FormTemplate({ fields, initialData, onSave, isEditing, entityId, onCancelEdit }) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle number/ID fields that might be empty and should be null for MySQL
    const isIdField = name.endsWith('_ID') || name === 'Works_Under' || name === 'Capacity';
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: (isIdField && value === '') ? null : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, isEditing, entityId);
  };

      const formStyles = {
        background: 'white',
        borderRadius: '8px',
        padding: '25px',
        margin: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #dee2e6',
      };

      const headerStyles = {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #dee2e6',
        paddingBottom: '10px',
      };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  };

  const fieldStyles = {
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyles = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  };

      const inputStyles = {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        fontSize: '0.9rem',
        transition: 'border-color 0.2s ease',
        background: '#ffffff',
        fontFamily: 'inherit',
      };

  const helpTextStyles = {
    color: '#666',
    fontSize: '0.8rem',
    marginTop: '5px',
    fontStyle: 'italic',
    padding: '5px 10px',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '5px',
    border: '1px solid rgba(102, 126, 234, 0.2)',
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '25px',
  };

      const submitButtonStyles = {
        background: '#007bff',
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      };

      const cancelButtonStyles = {
        background: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      <h3 style={headerStyles}>
        {isEditing ? `✏️ Edit Record (ID: ${entityId})` : '➕ Add New Record'}
      </h3>
      <div style={gridStyles}>
        {fields.map(field => (
          <div key={field.name} style={fieldStyles}>
            <label style={labelStyles}>
              {field.required && <span style={{ color: '#e74c3c' }}>*</span>}
              {field.label}:
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] === null ? '' : formData[field.name]}
              onChange={handleChange}
              required={field.required}
              placeholder={
                field.name === 'Works_Under' ? 'Enter existing Authority ID or leave empty' :
                field.name === 'Vehicle_ID' ? 'Enter existing Vehicle ID or leave empty' :
                field.name === 'Authority_ID' ? 'Enter existing Authority ID or leave empty' :
                field.label
              }
              style={inputStyles}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
            {field.name === 'Works_Under' && (
              <small style={helpTextStyles}>
                💡 Must reference an existing Authority ID or be empty
              </small>
            )}
            {field.name === 'Vehicle_ID' && (
              <small style={helpTextStyles}>
                💡 Must reference an existing Vehicle ID or be empty
              </small>
            )}
            {field.name === 'Authority_ID' && (
              <small style={helpTextStyles}>
                💡 Must reference an existing Authority ID or be empty
              </small>
            )}
          </div>
        ))}
      </div>
      <div style={buttonContainerStyles}>
        <button type="submit" style={submitButtonStyles}>
          {isEditing ? '🔄 Update Record' : '➕ Add Record'}
        </button>
        {isEditing && (
          <button type="button" onClick={onCancelEdit} style={cancelButtonStyles}>
            ❌ Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

export default FormTemplate;