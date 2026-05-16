import React, { useCallback } from 'react';
import ResourcePage from '../components/ResourcePage';
import { authorityService } from '../api/authorityService';
import { driverService } from '../api/driverService';
import { vehicleService } from '../api/vehicleService';

function DriverPage() {
  const loadReferences = useCallback(async () => {
    const [vehicles, authorities] = await Promise.all([
      vehicleService.getAll(),
      authorityService.getAll(),
    ]);
    return { vehicles, authorities };
  }, []);

  return (
    <ResourcePage
      service={driverService}
      icon="🧑‍✈️"
      subtitle="Dispatch-ready crew profiles, assigned vehicles, and duty orders"
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

export default DriverPage;
