// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Example function to check if the user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login-page" />;
};

export default PrivateRoute;
