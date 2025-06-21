// src/components/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Example function to check if the user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

const PublicRoute = ({ element }) => {
  return !isAuthenticated() ? element : <Navigate to="/" state={{ message: 'You are already logged in' }} />;
};

export default PublicRoute;
