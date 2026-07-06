import React from 'react';
import { FavoriteProvider } from './context/FavoriteContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <AppRoutes />
      </FavoriteProvider>
    </AuthProvider>
  );
}
