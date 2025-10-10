import axios, { AxiosInstance } from 'axios';

// API base URL - can be configured via environment or defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token on 401
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async getCurrentUser() {
    const { data } = await this.client.get('/auth/me');
    return data;
  }

  // Photo endpoints
  async getPhotos(hashtag?: string) {
    const { data } = await this.client.get('/photos', {
      params: hashtag ? { hashtag } : {},
    });
    return data;
  }

  async getPhoto(photoId: number) {
    const { data } = await this.client.get(`/photos/${photoId}`);
    return data;
  }

  async uploadPhoto(file: File, hashtags: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('hashtags', hashtags);

    const { data } = await this.client.post('/photos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  async deletePhoto(photoId: number) {
    const { data } = await this.client.delete(`/photos/${photoId}`);
    return data;
  }

  // Hashtag endpoints
  async getHashtags() {
    const { data } = await this.client.get('/hashtags');
    return data;
  }

  async createHashtag(name: string) {
    const { data } = await this.client.post('/hashtags/', { name });
    return data;
  }

  async searchHashtags(query: string) {
    const { data } = await this.client.get('/hashtags/search', {
      params: { q: query },
    });
    return data;
  }
}

export const apiClient = new ApiClient();

// Auth helper functions
export const getAuthLoginUrl = () => `${API_BASE_URL}/auth/login`;

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};
