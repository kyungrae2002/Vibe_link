import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await apiClient.post('/api/auth/refresh');
        // Retry the original request
        return apiClient(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Authentication
  auth: {
    login: () => {
      window.location.href = `${API_BASE_URL}/api/auth/login`;
    },
    logout: () => apiClient.post('/api/auth/logout'),
    refresh: () => apiClient.post('/api/auth/refresh'),
  },

  // User
  user: {
    getProfile: () => apiClient.get('/api/user/profile'),
    getTopArtists: (params?: { time_range?: 'short_term' | 'medium_term' | 'long_term'; limit?: number }) =>
      apiClient.get('/api/user/top-artists', { params }),
    getTopTracks: (params?: { time_range?: 'short_term' | 'medium_term' | 'long_term'; limit?: number }) =>
      apiClient.get('/api/user/top-tracks', { params }),
    getUserProfile: (userId: string) => apiClient.get(`/api/user/${userId}/profile`),
  },

  // Preference Sharing
  preference: {
    createLink: () => apiClient.post('/api/preference/create-link'),
    getLink: (linkId: string) => apiClient.get(`/api/preference/link/${linkId}`),
    acceptLink: (linkId: string) => apiClient.post(`/api/preference/accept/${linkId}`),
    getMyLinks: () => apiClient.get('/api/preference/my-links'),
  },

  // Playlist
  playlist: {
    createBlend: (data: { commonArtistIds: string[]; playlistName?: string; playlistDescription?: string }) =>
      apiClient.post('/api/playlist/create-blend', data),
    getRecommendations: (params?: { seed_artists?: string; limit?: number }) =>
      apiClient.get('/api/playlist/recommendations', { params }),
    getMyPlaylists: (params?: { limit?: number }) =>
      apiClient.get('/api/playlist/my-playlists', { params }),
    getPlaylist: (playlistId: string) => apiClient.get(`/api/playlist/${playlistId}`),
  },

  // Health check
  health: () => apiClient.get('/health'),
};

export default api;
