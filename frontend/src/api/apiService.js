import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const createApiService = (entity, entityIdKey) => {
  const ENTITY_URL = `${API_URL}/${entity}`;

  return {
    getAll: () => axios.get(ENTITY_URL).then(res => res.data),

    // Search function relies on fetching all and filtering locally. 
    // Best practice is to implement a GET by ID route on the backend.
    getOne: async (id) => {
        const response = await axios.get(ENTITY_URL);
        const record = response.data.find(item => item[entityIdKey] === parseInt(id));
        if (!record) {
            throw new Error(`Record with ID ${id} not found.`);
        }
        return record;
    },

    // Frontend sends data, backend auto-increments the ID
    add: (data) => axios.post(`${ENTITY_URL}/add`, data).then(res => res.data),

    update: (id, data) => axios.put(`${ENTITY_URL}/update/${id}`, data).then(res => res.data),

    remove: (id) => axios.delete(`${ENTITY_URL}/delete/${id}`).then(res => res.data),
    
    entityIdKey,
  };
};