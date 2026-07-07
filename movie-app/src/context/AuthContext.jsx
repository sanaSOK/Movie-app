import React, { createContext, useContext, useState, useEffect } from 'react';
import { request } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await request('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Success: update user state
        setUser(response.data);
        localStorage.setItem('auth_user', JSON.stringify(response.data));
      } catch (err) {
        console.error('Session validation failed, logging out:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('auth_token', receivedToken);
      localStorage.setItem('auth_user', JSON.stringify(receivedUser));
      return receivedUser;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('auth_token', receivedToken);
      localStorage.setItem('auth_user', JSON.stringify(receivedUser));
      return receivedUser;
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const isFormData = profileData instanceof FormData;
      const response = await request('/users/profile', {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: isFormData ? profileData : JSON.stringify(profileData)
      });
      
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
