import { createApiService } from './apiService';

const ENTITY = 'driver';
const ENTITY_ID_KEY = 'Driver_ID';

export const driverService = {
  ...createApiService(ENTITY, ENTITY_ID_KEY),
  name: 'Driver',
  initialFormState: { // Primary ID is omitted
    Name: '',
    Address: '',
    Control_Number: '',
    Duty_Per_Order_ID: '',
    Vehicle_ID: '',
    Authority_ID: '',
  },
  fields: [ // Primary ID field is omitted
    { name: 'Name', label: 'Name', type: 'text', required: true },
    { name: 'Address', label: 'Address', type: 'text', required: true },
    { name: 'Control_Number', label: 'Control Number', type: 'text', required: true },
    { name: 'Duty_Per_Order_ID', label: 'Order ID', type: 'number', required: true },
    { name: 'Vehicle_ID', label: 'Vehicle ID', type: 'number', required: true },
    { name: 'Authority_ID', label: 'Authority ID', type: 'number', required: true },
  ],
  columns: [
    { key: 'Driver_ID', header: 'ID' },
    { key: 'Name', header: 'Name' },
    { key: 'Address', header: 'Address' },
    { key: 'Control_Number', header: 'Control No' },
    { key: 'Duty_Per_Order_ID', header: 'Order ID' },
    { key: 'Vehicle_ID', header: 'Vehicle ID' },
    { key: 'Authority_ID', header: 'Authority ID' },
  ],
};