import React, { useCallback } from 'react';
import ResourcePage from '../components/ResourcePage';
import { userService } from '../api/userService';
import { vehicleService } from '../api/vehicleService';

function UserPage() {
  const loadReferences = useCallback(async () => {
    const vehicles = await vehicleService.getAll();
    return { vehicles };
  }, []);

  return (
    <ResourcePage
      service={userService}
      icon="👥"
      subtitle="Citizen linkage, household records, and vehicle service mapping"
      loadReferences={loadReferences}
      validate={(formData, { references }) => {
        const exists = references.vehicles?.some((vehicle) => vehicle.Vehicle_ID === Number(formData.Vehicle_ID));
        return exists ? null : `Vehicle ID ${formData.Vehicle_ID} does not exist.`;
      }}
    />
  );
}

export default UserPage;
