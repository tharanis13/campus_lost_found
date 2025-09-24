import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const itemService = {
  // Create new item
  createItem: async (itemData) => {
    const formData = new FormData();
    
    Object.keys(itemData).forEach(key => {
      if (key === 'images' && itemData.images) {
        itemData.images.forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, itemData[key]);
      }
    });

    const response = await axios.post('/api/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get items with filters
  getItems: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axios.get(`/api/items?${params}`);
    return response.data;
  },

  // Get single item
  getItem: async (id) => {
    const response = await axios.get(`/api/items/${id}`);
    return response.data;
  },

  // Claim item
  claimItem: async (id, description) => {
    const response = await axios.post(`/api/items/${id}/claim`, { description });
    return response.data;
  },

  // Get matches
  getMatches: async (id) => {
    const response = await axios.get(`/api/items/${id}/matches`);
    return response.data;
  }
};

export const adminService = {
  getStats: async () => {
    const response = await axios.get('/api/admin/stats');
    return response.data;
  },

  getUsers: async () => {
    const response = await axios.get('/api/admin/users');
    return response.data;
  },

  getItems: async () => {
    const response = await axios.get('/api/admin/items');
    return response.data;
  },

  updateItemStatus: async (id, status) => {
    const response = await axios.put(`/api/admin/items/${id}/status`, { status });
    return response.data;
  }
};