
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Reset from './Auth/Reset';
import Dashboard from './Pages/Dashboard';
import DashboardReact from './Pages/DashboardReact';
import { useAuth } from './Contexts/AuthContext';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/register" />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        <Route
          path="/reset"
          element={
            isAuthenticated ? <Navigate to="/login" /> : <Reset />
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardReact /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

