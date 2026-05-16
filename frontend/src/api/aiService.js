import axios from 'axios';

const API_URL = 'http://localhost:3000/ai';

export const aiService = {
  chat: async (message, context) => {
    try {
      const res = await axios.post(`${API_URL}/chat`, { message, context }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return res.data;
    } catch (error) {
      // Re-throw the error so the component can handle it
      throw error;
    }
  }
};


