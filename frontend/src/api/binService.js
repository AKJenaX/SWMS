import { createApiService } from './apiService';

const ENTITY = 'bin';
const ENTITY_ID_KEY = 'Bin_ID';

export const binService = {
  ...createApiService(ENTITY, ENTITY_ID_KEY),
  name: 'Bin',
  initialFormState: { // Primary ID is omitted
    Capacity: '',
    GSM_Number: '',
    Installation_Date: '',
    Assigned_Location: '',
    Vehicle_ID: '',
    Authority_ID: '',
  },
  fields: [ // Primary ID field is omitted
    { name: 'Capacity', label: 'Capacity (kg/L)', type: 'number', required: true },
    { name: 'GSM_Number', label: 'GSM Number', type: 'text', required: true },
    { name: 'Installation_Date', label: 'Installation Date', type: 'date', required: true },
    { name: 'Assigned_Location', label: 'Location', type: 'text', required: true },
    { name: 'Vehicle_ID', label: 'Vehicle ID', type: 'number', required: true },
    { name: 'Authority_ID', label: 'Authority ID', type: 'number', required: true },
  ],
  columns: [
    { key: 'Bin_ID', header: 'ID' },
    { key: 'Capacity', header: 'Capacity' },
    { key: 'GSM_Number', header: 'GSM' },
    { key: 'Installation_Date', header: 'Install Date' },
    { key: 'Assigned_Location', header: 'Location' },
    { key: 'Vehicle_ID', header: 'Vehicle ID' },
    { key: 'Authority_ID', header: 'Authority ID' },
  ],
};