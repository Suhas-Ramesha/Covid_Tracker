const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    },
    
    register: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    }
  },

  // Data endpoints
  data: {
    upload: async (data: any[], token: string) => {
      const response = await fetch(`${API_BASE_URL}/data/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data })
      });
      return handleResponse(response);
    },
    
    getUserData: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/data/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    },
    
    deleteData: async (dataId: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/data/${dataId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    }
  },

  // Analytics endpoints
  analytics: {
    getSummary: async (token: string, filters?: any) => {
      const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/analytics/summary${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    },
    
    getVisualizationData: async (type: string, token: string, filters?: any) => {
      const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/analytics/visualization/${type}${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    }
  },

  // File upload endpoints
  files: {
    uploadFile: async (file: File, token: string) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return handleResponse(response);
    },
    
    getUploadHistory: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/files/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    }
  }
};