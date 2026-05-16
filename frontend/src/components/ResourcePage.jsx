import React, { useCallback, useEffect, useState } from 'react';
import FormTemplate from './FormTemplate';
import SearchComponent from './SearchComponent';
import TableTemplate from './TableTemplate';

function normalizeDateFields(item) {
  const next = { ...item };
  if (next.Installation_Date) {
    next.Installation_Date = new Date(next.Installation_Date).toISOString().split('T')[0];
  }
  return next;
}

function ResourcePage({ service, icon, subtitle, accentLabel = 'Resource Management', loadReferences, validate }) {
  const [data, setData] = useState([]);
  const [references, setReferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(service.initialFormState);
  const [currentId, setCurrentId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [records, referenceData] = await Promise.all([
        service.getAll(),
        loadReferences ? loadReferences() : Promise.resolve({}),
      ]);
      setData(records);
      setReferences(referenceData || {});
    } catch (err) {
      setError(`Failed to fetch ${service.name} data.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loadReferences, service]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentEntity(service.initialFormState);
    setCurrentId(null);
  };

  const handleSave = async (formData, isEditMode, id) => {
    try {
      if (validate) {
        const validationMessage = validate(formData, { data, references });
        if (validationMessage) {
          setError(validationMessage);
          return;
        }
      }

      setError(null);
      if (isEditMode) await service.update(id, formData);
      else await service.add(formData);

      await fetchData();
      handleCancelEdit();
    } catch (err) {
      const message = err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'add'} ${service.name} record.`;
      setError(message);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete ${service.name} ID ${id}?`)) return;
    try {
      await service.remove(id);
      await fetchData();
    } catch (err) {
      setError(`Failed to delete ${service.name} record. Check for dependent records.`);
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentEntity(normalizeDateFields(item));
    setCurrentId(item[service.entityIdKey]);
  };

  if (loading) {
    return (
      <div className="resource-page">
        <div className="resource-loading">
          <div className="spinner" />
          <span>Loading {service.name} data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-page">
      <header className="resource-hero">
        <div className="resource-kicker">{accentLabel}</div>
        <div className="resource-icon">{icon}</div>
        <h1>{service.name}</h1>
        <p>{subtitle}</p>
      </header>

      {error && <div className="alert alert-error">Warning: {error}</div>}

      <SearchComponent entityName={service.name} entityIdKey={service.entityIdKey} onSearch={service.getOne} onEdit={handleEdit} onDelete={handleDelete} />

      <FormTemplate fields={service.fields} initialData={currentEntity} onSave={handleSave} isEditing={isEditing} entityId={currentId} onCancelEdit={handleCancelEdit} />

      <h2 className="section-title">All {service.name} Records</h2>

      <TableTemplate data={data} columns={service.columns} entityIdKey={service.entityIdKey} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default ResourcePage;
