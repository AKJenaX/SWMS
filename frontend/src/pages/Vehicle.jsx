import React, { useCallback } from 'react';
import ResourcePage from '../components/ResourcePage';
import { authorityService } from '../api/authorityService';
import { vehicleService } from '../api/vehicleService';

function VehiclePage() {
  const loadReferences = useCallback(async () => {
    const authorities = await authorityService.getAll();
    return { authorities };
  }, []);

  return (
    <ResourcePage
      service={vehicleService}
      icon="🚛"
      subtitle="Fleet registry, service locations, and authority assignments"
      loadReferences={loadReferences}
      validate={(formData, { references }) => {
        const exists = references.authorities?.some((authority) => authority.Authority_ID === Number(formData.Authority_ID));
        return exists ? null : `Authority ID ${formData.Authority_ID} does not exist.`;
      }}
    />
  );
}

export default VehiclePage;
