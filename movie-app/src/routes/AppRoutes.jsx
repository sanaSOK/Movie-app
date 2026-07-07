import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import MovieDetail from '../pages/MovieDetail';
import Watch from '../pages/Watch';
import Search from '../pages/Search';
import Favorite from '../pages/Favorite';
import History from '../pages/History';
import FAQ from '../pages/FAQ';
import Request from '../pages/Request';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<MovieDetail />} />
          <Route path="/watch/:id/:episodeId" element={<Watch />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/history" element={<History />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/request" element={<Request />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
