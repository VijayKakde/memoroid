import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateFlashcard from './pages/CreateFlashcard';
import EditFlashcard from './pages/EditFlashcard';
import ReviewFlashcard from './pages/ReviewFlashcard';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
      />
      <Route
        path="/"
        element={user ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create" element={<CreateFlashcard />} />
        <Route path="edit/:id" element={<EditFlashcard />} />
        <Route path="review" element={<ReviewFlashcard />} />
        <Route path="stats" element={<Stats />} />
      </Route>
    </Routes>
  );
}

export default App