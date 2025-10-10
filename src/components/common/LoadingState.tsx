import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState = ({ message = 'Loading data...' }: { message?: string }) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
    <CircularProgress sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default LoadingState;
