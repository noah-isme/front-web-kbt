import { Box, Skeleton, Stack } from '@mui/material';

const DetailSkeleton = () => {
  return (
    <Box>
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="80%" sx={{ mb: 3 }} />
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="30%" height={20} />
      </Stack>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={50} width="50%" />
    </Box>
  );
};

export default DetailSkeleton;
