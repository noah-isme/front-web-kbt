import { Box, Skeleton, Stack } from '@mui/material';

interface ListSkeletonProps {
  count?: number;
  height?: number;
}

const ListSkeleton = ({ count = 5, height = 50 }: ListSkeletonProps) => {
  return (
    <Stack spacing={1}>
      {Array.from(new Array(count)).map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={height} />
      ))}
    </Stack>
  );
};

export default ListSkeleton;
