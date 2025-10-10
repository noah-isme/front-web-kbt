import { useMemo } from 'react';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { logout, user } = useAuth();
  const { toggleTheme, mode } = useThemeContext();

  const greeting = useMemo(() => {
    if (!user) return 'Welcome';
    return `Hello, ${user.name}`;
  }, [user]);

  return (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
      <Toolbar>
        {isMobile && onToggleSidebar && (
          <IconButton color="inherit" edge="start" onClick={onToggleSidebar} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {greeting}
        </Typography>
        <Tooltip title="Toggle theme">
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
