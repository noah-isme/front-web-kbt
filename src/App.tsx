import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import LiveLocationsPage from './pages/LiveLocationsPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<RequireAuth />}>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/locations" element={<LiveLocationsPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const RequireAuth = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default App;
