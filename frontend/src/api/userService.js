import { createApiService } from './apiService';

const ENTITY = 'user';
const ENTITY_ID_KEY = 'User_ID';

export const userService = {
  ...createApiService(ENTITY, ENTITY_ID_KEY),
  name: 'User',
  initialFormState: { // Primary ID is omitted
    Mobile_Number: '',
    House_Number: '',
    Vehicle_ID: '',
  },
  fields: [ // Primary ID field is omitted
    { name: 'Mobile_Number', label: 'Mobile Number', type: 'text', required: true },
    { name: 'House_Number', label: 'House Number', type: 'text', required: true },
    { name: 'Vehicle_ID', label: 'Vehicle ID', type: 'number', required: true },
  ],
  columns: [
    { key: 'User_ID', header: 'ID' },
    { key: 'Mobile_Number', header: 'Mobile No' },
    { key: 'House_Number', header: 'House No' },
    { key: 'Vehicle_ID', header: 'Vehicle ID' },
  ],
};