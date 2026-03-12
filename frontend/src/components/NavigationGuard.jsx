import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * NavigationGuard prevents direct URL access to specific routes.
 * It checks if the navigation was initiated via an internal trigger (like a button click)
 * by looking for a specific flag in the location state.
 */
const NavigationGuard = ({ children }) => {
  const location = useLocation();
  
  // If the user attempts to access the URL directly (state is null or missing fromButton),
  // redirect them back to the home page or login.
  if (!location.state?.fromButton) {
    console.warn(`[Direct Access Blocked]: Tried to access ${location.pathname} directly.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default NavigationGuard;
