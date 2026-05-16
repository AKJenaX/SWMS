import { createApiService } from './apiService';

const ENTITY = 'authority';
const ENTITY_ID_KEY = 'Authority_ID';

export const authorityService = {
  ...createApiService(ENTITY, ENTITY_ID_KEY),
  name: 'Authority',
  initialFormState: { // Primary ID is omitted
    Name: '',
    Designation: '',
    Control_Room: '',
    Works_Under: null,
  },
  fields: [ // Primary ID field is omitted
    { name: 'Name', label: 'Name', type: 'text', required: true },
    { name: 'Designation', label: 'Designation', type: 'text', required: true },
    { name: 'Control_Room', label: 'Control Room', type: 'text', required: true },
    { name: 'Works_Under', label: 'Supervisor ID', type: 'number', required: false },
  ],
  columns: [
    { key: 'Authority_ID', header: 'ID' },
    { key: 'Name', header: 'Name' },
    { key: 'Designation', header: 'Designation' },
    { key: 'Control_Room', header: 'Control Room' },
    { key: 'Works_Under', header: 'Works Under ID' },
  ],
};