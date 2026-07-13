import { request } from './api';
import { MOCK_UPCOMING } from './mockData';

export const movieService = {
  async getUpcomingShows() {
    return MOCK_UPCOMING;
  },
  async getShows(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'All') params.append('type', filters.type);
    if (filters.country && filters.country !== 'All') params.append('country', filters.country);
    if (filters.genre && filters.genre !== 'All') params.append('genre', filters.genre);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await request(`/movies${queryString}`);
    
    return response.data?.movies || [];
  },

  async getShowById(id) {
    const response = await request(`/movies/${id}`);
    return response.data;
  },

  async addComment(movieId, commentText, token) {
    const response = await request(`/movies/${movieId}/comment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: commentText })
    });
    return response.data;
  }
};
