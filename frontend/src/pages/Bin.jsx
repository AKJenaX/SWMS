import React, { useState, useEffect, useCallback } from 'react';
import TableTemplate from '../components/TableTemplate';
import FormTemplate from '../components/FormTemplate';
import SearchComponent from '../components/SearchComponent';
import { binService } from '../api/binService'; // ONLY CHANGE HERE

function BinPage() {
  const service = binService;
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(service.initialFormState);
  const [currentId, setCurrentId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [authorities, setAuthorities] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await service.getAll();
      setData(records);
      
      // Also fetch vehicles and authorities for validation
      const vehicleResponse = await fetch('http://localhost:3000/vehicle');
      const vehicleData = await vehicleResponse.json();
      setVehicles(vehicleData);
      
      const authorityResponse = await fetch('http://localhost:3000/authority');
      const authorityData = await authorityResponse.json();
      setAuthorities(authorityData);
    } catch (err) {
      setError(`Failed to fetch ${service.name} data.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (formData, isEditMode, id) => {
    try {
      // Validate Vehicle_ID field
      if (formData.Vehicle_ID && formData.Vehicle_ID !== '') {
        const vehicleExists = vehicles.some(vehicle => 
          vehicle.Vehicle_ID === parseInt(formData.Vehicle_ID)
        );
        if (!vehicleExists) {
          setError(`Vehicle ID ${formData.Vehicle_ID} does not exist. Please enter a valid Vehicle ID or leave empty.`);
          return;
        }
      }

      // Validate Authority_ID field
      if (formData.Authority_ID && formData.Authority_ID !== '') {
        const authorityExists = authorities.some(authority => 
          authority.Authority_ID === parseInt(formData.Authority_ID)
        );
        if (!authorityExists) {
          setError(`Authority ID ${formData.Authority_ID} does not exist. Please enter a valid Authority ID or leave empty.`);
          return;
        }
      }

      setError(null); // Clear any previous errors
      
      if (isEditMode) {
        await service.update(id, formData);
      } else {
        await service.add(formData); 
      }
      fetchData(); 
      handleCancelEdit();
    } catch (err) {
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'add'} ${service.name} record.`;
      
      // Check for specific database constraint errors
      if (err.response?.data?.message) {
        if (err.response.data.message.includes('foreign key constraint')) {
          errorMessage = `Invalid Vehicle ID or Authority ID. Both must reference existing records or be empty.`;
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete ${service.name} ID ${id}?`)) return;
    try {
      await service.remove(id);
      fetchData();
    } catch (err) {
      setError(`Failed to delete ${service.name} record. Check for dependent records.`);
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    
    let itemData = { ...item };
    if (itemData.Installation_Date) {
      itemData.Installation_Date = new Date(itemData.Installation_Date).toISOString().split('T')[0];
    }
    
    setCurrentEntity(itemData);
    setCurrentId(item[service.entityIdKey]);
  };
  
  const handleCancelEdit = () => {
      setIsEditing(false);
      setCurrentEntity(service.initialFormState);
      setCurrentId(null);
  };

  const pageStyles = {
    background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
    borderRadius: '12px',
    padding: '30px',
    margin: '20px 0',
    boxShadow: '0 6px 20px rgba(255,193,7,0.15)',
    border: '2px solid #ffeaa7',
    borderTop: '5px solid #ffc107',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyles = {
    textAlign: 'center',
    color: '#856404',
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '25px',
    textShadow: '0 2px 4px rgba(255,193,7,0.2)',
    borderBottom: '3px solid #ffc107',
    paddingBottom: '15px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const errorStyles = {
    background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
    color: '#721c24',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
    fontSize: '1rem',
    fontWeight: '500',
  };

  const loadingStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.2rem',
    color: '#ffc107',
  };

  if (loading) return (
    <div style={pageStyles}>
      <div style={loadingStyles}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          Loading {service.name} data...
        </div>
      </div>
    </div>
  );
  
  return (
    <div style={pageStyles}>
      <h2 style={headerStyles}>🗂️ {service.name} Management</h2>
      {error && <div style={errorStyles}>⚠️ Error: {error}</div>}

      <SearchComponent 
          entityName={service.name} 
          entityIdKey={service.entityIdKey}
          onSearch={service.getOne} 
          onEdit={handleEdit}
          onDelete={handleDelete}
      />

      <FormTemplate
        fields={service.fields}
        initialData={currentEntity}
        onSave={handleSave}
        isEditing={isEditing}
        entityId={currentId}
        onCancelEdit={handleCancelEdit}
      />

      <h3 style={{ color: '#856404', textAlign: 'center', marginTop: '20px' }}>All {service.name} Records</h3>
      <TableTemplate
        data={data}
        columns={service.columns}
        entityIdKey={service.entityIdKey}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default BinPage;