import React, { useState, useEffect } from 'react';

function FormTemplate({
  fields,
  initialData,
  onSave,
  isEditing,
  entityId,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isIdField =
      name.endsWith('_ID') || name === 'Works_Under' || name === 'Capacity';

    setFormData((prev) => ({
      ...prev,
      [name]: isIdField && value === '' ? null : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, isEditing, entityId);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="form-header">
        <h3>
          {isEditing ? `Edit Record (ID: ${entityId})` : 'Add New Record'}
        </h3>
        <p className="form-subtitle">
          Fill in the details below and save your changes
        </p>
      </div>

      {/* Fields */}
      <div className="form-grid">
        {fields.map((field) => (
          <div key={field.name} className="form-field">
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>

            <input
              className="form-input"
              type={field.type}
              name={field.name}
              value={formData[field.name] === null ? '' : formData[field.name]}
              onChange={handleChange}
              required={field.required}
              placeholder={field.label}
            />

            {(field.name === 'Works_Under' ||
              field.name === 'Vehicle_ID' ||
              field.name === 'Authority_ID') && (
              <small className="form-help">
                Must reference an existing {field.label} or be empty
              </small>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Record' : 'Add Record'}
        </button>

        {isEditing && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default FormTemplate;