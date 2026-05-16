import React, { useCallback } from 'react';
import ResourcePage from '../components/ResourcePage';
import { authorityService } from '../api/authorityService';
import { binService } from '../api/binService';
import { vehicleService } from '../api/vehicleService';

function BinPage() {
  const loadReferences = useCallback(async () => {
    const [vehicles, authorities] = await Promise.all([
      vehicleService.getAll(),
      authorityService.getAll(),
    ]);
    return { vehicles, authorities };
  }, []);

  return (
    <ResourcePage
      service={binService}
      icon="🗑️"
      subtitle="Smart bin capacity, telemetry identifiers, and field placement"
      loadReferences={loadReferences}
      validate={(formData, { references }) => {
        const vehicleExists = references.vehicles?.some((vehicle) => vehicle.Vehicle_ID === Number(formData.Vehicle_ID));
        if (!vehicleExists) return `Vehicle ID ${formData.Vehicle_ID} does not exist.`;

        const authorityExists = references.authorities?.some((authority) => authority.Authority_ID === Number(formData.Authority_ID));
        if (!authorityExists) return `Authority ID ${formData.Authority_ID} does not exist.`;

        return null;
      }}
    />
  );
}

export default BinPage;
