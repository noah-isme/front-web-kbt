import { Box, Typography } from '@mui/material';

const EmptyState = ({ message }: { message: string }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    py={6}
    border="1px dashed"
    borderColor="divider"
    borderRadius={2}
  >
    <Typography variant="body1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default EmptyState;
