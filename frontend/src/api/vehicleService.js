import { createApiService } from './apiService';

const ENTITY = 'vehicle';
const ENTITY_ID_KEY = 'Vehicle_ID';

export const vehicleService = {
  ...createApiService(ENTITY, ENTITY_ID_KEY),
  name: 'Vehicle',
  initialFormState: { // Primary ID is omitted
    Vehicle_Number: '',
    Vehicle_Type: '',
    Manufacturer: '',
    Assigned_Location: '',
    Authority_ID: '',
  },
  fields: [ // Primary ID field is omitted
    { name: 'Vehicle_Number', label: 'Vehicle Number', type: 'text', required: true },
    { name: 'Vehicle_Type', label: 'Type', type: 'text', required: true },
    { name: 'Manufacturer', label: 'Manufacturer', type: 'text', required: true },
    { name: 'Assigned_Location', label: 'Location', type: 'text', required: true },
    { name: 'Authority_ID', label: 'Authority ID', type: 'number', required: true },
  ],
  columns: [
    { key: 'Vehicle_ID', header: 'ID' },
    { key: 'Vehicle_Number', header: 'Number' },
    { key: 'Vehicle_Type', header: 'Type' },
    { key: 'Manufacturer', header: 'Manufacturer' },
    { key: 'Assigned_Location', header: 'Location' },
    { key: 'Authority_ID', header: 'Authority ID' },
  ],
};