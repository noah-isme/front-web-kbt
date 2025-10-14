import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import LoadingState from './components/common/LoadingState';
import { useAuth } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import LoginPage from './pages/LoginPage';
import { UserRole } from './types';

// Lazy-loaded page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const LiveLocationsPage = lazy(() => import('./pages/LiveLocationsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    {/* Protected routes that require authentication */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingState message="Loading Dashboard..." />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/events"
          element={
            <Suspense fallback={<LoadingState message="Loading Events..." />}>
              <EventsPage />
            </Suspense>
          }
        />
        <Route
          path="/locations"
          element={
            <Suspense fallback={<LoadingState message="Loading Live Locations..." />}>
              <LiveLocationsPage />
            </Suspense>
          }
        />
        {/* Example of role-based protection */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin', 'operator']}>
              <Suspense fallback={<LoadingState message="Loading Users..." />}>
                <UsersPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode; // Add children prop for nested routes
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but does not have the required role
    // Redirect to a general dashboard or an unauthorized page
    return <Navigate to="/" replace />; 
  }

  return children ? <>{children}</> : <Outlet />;
};

export default App;
