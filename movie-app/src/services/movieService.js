import { MOCK_SHOWS, MOCK_UPCOMING } from './mockData';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const movieService = {
  async getUpcomingShows() {
    await delay(150);
    return MOCK_UPCOMING;
  },
  async getShows(filters = {}) {
    await delay(200);
    let results = [...MOCK_SHOWS];

    if (filters.type && filters.type !== 'All') {
      results = results.filter((show) => show.type.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (show) =>
          show.title.toLowerCase().includes(q) ||
          show.synopsis.toLowerCase().includes(q) ||
          show.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    return results;
  },

  async getShowById(id) {
    await delay(200);
    const show = MOCK_SHOWS.find((item) => item.id === id);
    if (!show) throw new Error('Show not found');
    return show;
  },

  async getFeaturedSpotlight() {
    await delay(100);
    // Vincenzo is our spotlight show
    return MOCK_SHOWS.find((show) => show.id === 'vincenzo-2021');
  },
};
