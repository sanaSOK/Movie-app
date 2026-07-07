import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MOCK_SHOWS } from './mockShows.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'mock-db');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const MOVIES_FILE = path.join(DB_DIR, 'movies.json');
const FAVORITES_FILE = path.join(DB_DIR, 'favorites.json');
const COMMENTS_FILE = path.join(DB_DIR, 'comments.json');

let mockDbState = {
  users: [],
  movies: [],
  favorites: [],
  comments: [],
};

// Initialize folder database structure
function init() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR);
    }

    const filesExist = fs.existsSync(USERS_FILE) && 
                       fs.existsSync(MOVIES_FILE) && 
                       fs.existsSync(FAVORITES_FILE) && 
                       fs.existsSync(COMMENTS_FILE);

    if (filesExist) {
      mockDbState.users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      mockDbState.movies = JSON.parse(fs.readFileSync(MOVIES_FILE, 'utf8'));
      mockDbState.favorites = JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf8'));
      mockDbState.comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8'));
    } else {
      const oldDbFile = path.join(__dirname, 'mock-db.json');
      if (fs.existsSync(oldDbFile)) {
        console.log('Migrating old mock-db.json to structured mock-db folder...');
        const oldState = JSON.parse(fs.readFileSync(oldDbFile, 'utf8'));
        mockDbState.users = oldState.users || [];
        mockDbState.movies = oldState.movies || [];
        mockDbState.favorites = oldState.favorites || [];
        
        // Extract comments
        mockDbState.comments = [];
        mockDbState.movies.forEach(m => {
          if (m.comments) {
            m.comments.forEach(c => {
              mockDbState.comments.push({
                ...c,
                movieId: m.id || m._id
              });
            });
          }
        });
        
        try {
          fs.unlinkSync(oldDbFile);
        } catch (err) {
          console.warn('Failed to delete old mock-db.json:', err.message);
        }
      } else {
        console.log('Initializing fresh structured mock-db database...');
        const seededMovies = MOCK_SHOWS.map((m, idx) => ({
          ...m,
          _id: `mock-movie-${m.id || idx}`,
          createdAt: new Date().toISOString(),
        }));
        
        mockDbState.users = [];
        mockDbState.movies = seededMovies;
        mockDbState.favorites = [];
        
        // Extract comments
        mockDbState.comments = [];
        seededMovies.forEach(m => {
          if (m.comments) {
            m.comments.forEach(c => {
              mockDbState.comments.push({
                ...c,
                movieId: m.id || m._id
              });
            });
          }
        });
      }
      
      saveAllSync();
    }
  } catch (error) {
    console.error('Failed to initialize mock database folder:', error);
  }
}

function saveAllSync() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(mockDbState.users, null, 2), 'utf8');
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(mockDbState.movies, null, 2), 'utf8');
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify(mockDbState.favorites, null, 2), 'utf8');
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(mockDbState.comments, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write mock database files:', error);
  }
}

async function saveUsers() {
  try {
    await fs.promises.writeFile(USERS_FILE, JSON.stringify(mockDbState.users, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write users.json:', error);
  }
}

async function saveMovies() {
  try {
    await fs.promises.writeFile(MOVIES_FILE, JSON.stringify(mockDbState.movies, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write movies.json:', error);
  }
}

async function saveFavorites() {
  try {
    await fs.promises.writeFile(FAVORITES_FILE, JSON.stringify(mockDbState.favorites, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write favorites.json:', error);
  }
}

async function saveComments() {
  try {
    await fs.promises.writeFile(COMMENTS_FILE, JSON.stringify(mockDbState.comments, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write comments.json:', error);
  }
}

init();

// Chainable mock mongoose query builder
class MockQuery {
  constructor(dataPromise) {
    this.dataPromise = dataPromise;
    this.skips = 0;
    this.limits = null;
    this.sorts = null;
    this.populates = [];
  }

  then(onfulfilled, onrejected) {
    return this.dataPromise.then(data => {
      let result = Array.isArray(data) ? [...data] : data;
      if (Array.isArray(result)) {
        if (this.sorts) {
          const entries = Object.entries(this.sorts);
          if (entries.length > 0) {
            const [sortKey, sortOrder] = entries[0];
            result.sort((a, b) => {
              const valA = a[sortKey] || 0;
              const valB = b[sortKey] || 0;
              
              // Try date comparison first
              const dateA = Date.parse(valA);
              const dateB = Date.parse(valB);
              
              if (!isNaN(dateA) && !isNaN(dateB)) {
                return sortOrder === -1 ? dateB - dateA : dateA - dateB;
              }
              
              // Fallback to general comparison
              if (valA < valB) return sortOrder === -1 ? 1 : -1;
              if (valA > valB) return sortOrder === -1 ? -1 : 1;
              return 0;
            });
          }
        }
        if (this.skips) {
          result = result.slice(this.skips);
        }
        if (this.limits) {
          result = result.slice(0, this.limits);
        }
      }

      // Handle populate
      if (this.populates.length > 0 && Array.isArray(result)) {
        result = result.map(item => {
          const newItem = { ...item };
          for (const path of this.populates) {
            if (path === 'movie') {
              const movieId = typeof newItem.movie === 'object' && newItem.movie !== null ? newItem.movie._id || newItem.movie.id : newItem.movie;
              newItem.movie = mockDbState.movies.find(m => m._id === movieId || m.id === movieId);
            }
          }
          return newItem;
        });
      }

      return onfulfilled(result);
    }, onrejected);
  }

  catch(onrejected) {
    return this.dataPromise.catch(onrejected);
  }

  finally(onfinally) {
    return this.dataPromise.finally(onfinally);
  }

  select() { return this; }
  skip(n) { this.skips = n; return this; }
  limit(n) { this.limits = n; return this; }
  sort(obj) { this.sorts = obj; return this; }
  populate(path) { this.populates.push(path); return this; }
}

export const UserMock = {
  findOne: async function(query) {
    let user = null;
    if (query.$or) {
      const orConditions = query.$or;
      user = mockDbState.users.find(u => {
        return orConditions.some(cond => {
          return Object.entries(cond).every(([key, val]) => u[key] === val);
        });
      });
    } else {
      user = mockDbState.users.find(u => {
        return Object.entries(query).every(([key, val]) => u[key] === val);
      });
    }
    return user || null;
  },

  create: async function(userData) {
    const newUser = {
      _id: `mock-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=default',
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
    };
    mockDbState.users.push(newUser);
    await saveUsers();
    return newUser;
  },

  createWithId: async function(userData) {
    const idx = mockDbState.users.findIndex(u => u._id === userData._id || u.email === userData.email);
    const dataToSave = { ...userData };
    delete dataToSave.__v;
    if (idx !== -1) {
      mockDbState.users[idx] = { ...mockDbState.users[idx], ...dataToSave };
    } else {
      mockDbState.users.push(dataToSave);
    }
    await saveUsers();
    return dataToSave;
  },

  findById: function(id) {
    const userPromise = Promise.resolve(mockDbState.users.find(u => u._id === id) || null);
    return new MockQuery(userPromise);
  },

  findByIdAndUpdate: function(id, updateObj, options) {
    const updatePromise = (async () => {
      const user = mockDbState.users.find(u => u._id === id);
      if (!user) return null;
      if (updateObj.$set) {
        Object.assign(user, updateObj.$set);
      } else {
        Object.assign(user, updateObj);
      }
      await saveUsers();
      return user;
    })();
    return new MockQuery(updatePromise);
  }
};

export const MovieMock = {
  countDocuments: async function(query = {}) {
    const filtered = filterMovies(mockDbState.movies, query);
    return filtered.length;
  },

  find: function(query = {}) {
    const filtered = filterMovies(mockDbState.movies, query);
    return new MockQuery(Promise.resolve(filtered));
  },

  findOne: async function(query) {
    const movie = mockDbState.movies.find(m => {
      return Object.entries(query).every(([key, val]) => m[key] === val);
    });
    if (!movie) return null;
    return {
      ...movie,
      save: async function() {
        const idx = mockDbState.movies.findIndex(m => m.id === this.id || m._id === this._id);
        if (idx !== -1) {
          const toSave = { ...this };
          delete toSave.save;
          mockDbState.movies[idx] = toSave;
          await saveMovies();

          // Sync comments to comments.json
          const movieComments = toSave.comments || [];
          let commentsChanged = false;
          movieComments.forEach(c => {
            const exists = mockDbState.comments.some(existing => existing.id === c.id);
            if (!exists) {
              mockDbState.comments.unshift({
                ...c,
                movieId: toSave.id || toSave._id
              });
              commentsChanged = true;
            }
          });
          if (commentsChanged) {
            await saveComments();
          }
        }
        return this;
      }
    };
  },

  create: async function(movieData) {
    const newMovie = {
      ...movieData,
      _id: `mock-movie-${movieData.id || Date.now()}`,
      createdAt: new Date().toISOString(),
      comments: movieData.comments || [],
    };
    mockDbState.movies.push(newMovie);
    await saveMovies();
    
    // Sync comments
    if (newMovie.comments && newMovie.comments.length > 0) {
      newMovie.comments.forEach(c => {
        mockDbState.comments.push({
          ...c,
          movieId: newMovie._id
        });
      });
      await saveComments();
    }
    
    return newMovie;
  },

  createWithId: async function(movieData) {
    const idx = mockDbState.movies.findIndex(m => m._id === movieData._id || m.id === movieData.id);
    const dataToSave = { ...movieData };
    delete dataToSave.__v;
    if (idx !== -1) {
      mockDbState.movies[idx] = { ...mockDbState.movies[idx], ...dataToSave };
    } else {
      mockDbState.movies.push(dataToSave);
    }
    await saveMovies();

    // Sync comments
    if (dataToSave.comments && dataToSave.comments.length > 0) {
      let commentsChanged = false;
      dataToSave.comments.forEach(c => {
        const exists = mockDbState.comments.some(existing => existing.id === c.id);
        if (!exists) {
          mockDbState.comments.push({
            ...c,
            movieId: dataToSave._id || dataToSave.id
          });
          commentsChanged = true;
        }
      });
      if (commentsChanged) {
        await saveComments();
      }
    }
    
    return dataToSave;
  }
};

export const FavoriteMock = {
  find: function(query = {}) {
    const filtered = mockDbState.favorites.filter(f => {
      return Object.entries(query).every(([key, val]) => f[key] === val);
    });
    return new MockQuery(Promise.resolve(filtered));
  },

  findOne: async function(query) {
    const fav = mockDbState.favorites.find(f => {
      return Object.entries(query).every(([key, val]) => f[key] === val);
    });
    return fav || null;
  },

  create: async function(favData) {
    const newFav = {
      _id: `mock-fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user: favData.user,
      movie: favData.movie,
      addedAt: new Date().toISOString(),
    };
    mockDbState.favorites.push(newFav);
    await saveFavorites();
    return newFav;
  },

  createWithId: async function(favData) {
    const idx = mockDbState.favorites.findIndex(f => f._id === favData._id);
    const dataToSave = { ...favData };
    delete dataToSave.__v;
    if (idx !== -1) {
      mockDbState.favorites[idx] = { ...mockDbState.favorites[idx], ...dataToSave };
    } else {
      const dupIdx = mockDbState.favorites.findIndex(f => f.user === favData.user && f.movie === favData.movie);
      if (dupIdx !== -1) {
        mockDbState.favorites[dupIdx] = { ...mockDbState.favorites[dupIdx], ...dataToSave };
      } else {
        mockDbState.favorites.push(dataToSave);
      }
    }
    await saveFavorites();
    return dataToSave;
  },

  findOneAndDelete: async function(query) {
    const idx = mockDbState.favorites.findIndex(f => {
      return Object.entries(query).every(([key, val]) => f[key] === val);
    });
    if (idx === -1) return null;
    const deleted = mockDbState.favorites.splice(idx, 1)[0];
    await saveFavorites();
    return deleted;
  }
};

function filterMovies(movies, queryObj) {
  return movies.filter(m => {
    if (queryObj.type && queryObj.type !== 'All' && m.type !== queryObj.type) return false;
    if (queryObj.country && queryObj.country !== 'All' && m.country !== queryObj.country) return false;
    if (queryObj.$or) {
      const orConditions = queryObj.$or;
      const searchCond = orConditions.find(c => c.title && c.title.$regex);
      if (searchCond) {
        const searchStr = searchCond.title.$regex;
        const regex = new RegExp(searchStr, 'i');
        const titleMatch = regex.test(m.title || '');
        const synopsisMatch = regex.test(m.synopsis || '');
        const genresMatch = m.genres && m.genres.some(g => regex.test(g));
        if (!titleMatch && !synopsisMatch && !genresMatch) return false;
      }
    }
    return true;
  });
}
