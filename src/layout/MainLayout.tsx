import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar, { drawerWidth } from '../components/navigation/Sidebar';
import Topbar from '../components/navigation/Topbar';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          ml: { xs: 0, md: `${drawerWidth}px` },
          px: 3,
          pb: 6,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
