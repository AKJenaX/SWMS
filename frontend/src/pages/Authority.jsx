import React, { useState, useEffect, useCallback } from 'react';
import TableTemplate from '../components/TableTemplate';
import FormTemplate from '../components/FormTemplate';
import SearchComponent from '../components/SearchComponent';
import { authorityService } from '../api/authorityService'; // *** Change this for other pages ***

function AuthorityPage() {
  const service = authorityService;
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(service.initialFormState);
  const [currentId, setCurrentId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await service.getAll();
      setData(records);
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
      // Validate Works_Under field - it must be null or reference an existing Authority_ID
      if (formData.Works_Under && formData.Works_Under !== '') {
        const supervisorExists = data.some(authority => 
          authority.Authority_ID === parseInt(formData.Works_Under)
        );
        if (!supervisorExists) {
          setError(`Supervisor ID ${formData.Works_Under} does not exist. Please enter a valid Authority ID or leave empty.`);
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
          errorMessage = `Invalid Supervisor ID. The Works_Under field must reference an existing Authority ID or be empty.`;
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
    
    // Date formatting for fields like Installation_Date in Bin
    let itemData = { ...item };
    if (itemData.Installation_Date) {
      // Assuming ISO string from backend, convert to YYYY-MM-DD for date input type
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
        background: 'linear-gradient(135deg, #e8f4fd, #d1ecf1)',
        borderRadius: '12px',
        padding: '30px',
        margin: '20px 0',
        boxShadow: '0 6px 20px rgba(0,123,255,0.15)',
        border: '2px solid #bee5eb',
        borderTop: '5px solid #007bff',
        position: 'relative',
        overflow: 'hidden',
      };

      const headerStyles = {
        textAlign: 'center',
        color: '#0056b3',
        fontSize: '2.2rem',
        fontWeight: '700',
        marginBottom: '25px',
        textShadow: '0 2px 4px rgba(0,123,255,0.2)',
        borderBottom: '3px solid #007bff',
        paddingBottom: '15px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      };

  const errorStyles = {
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
  };

  const loadingStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.2rem',
    color: '#667eea',
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
      <h2 style={headerStyles}>👥 {service.name} Management</h2>
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

      <h3>All {service.name} Records</h3>
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

export default AuthorityPage;