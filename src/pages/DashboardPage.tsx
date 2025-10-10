import { ReactNode } from 'react';

import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import TodayIcon from '@mui/icons-material/Today';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

import LoadingState from '../components/common/LoadingState';
import { useEvents } from '../hooks/useEvents';
import { useUsers } from '../hooks/useUsers';

const DashboardPage = () => {
  const { users, usersQuery } = useUsers();
  const { events, eventsQuery } = useEvents();

  const isLoading = usersQuery.isLoading || eventsQuery.isLoading;

  if (isLoading) {
    return <LoadingState message="Fetching dashboard data..." />;
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={600}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of system activity and resources.
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            icon={<GroupIcon color="primary" fontSize="large" />}
            title="Users"
            value={users.length}
            subtitle="Active administrators and operators"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            icon={<TodayIcon color="secondary" fontSize="large" />}
            title="Events"
            value={events.length}
            subtitle="Scheduled KBT activities"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            icon={<MapIcon color="success" fontSize="large" />}
            title="Live Tracking"
            value={events.length > 0 ? 'Ready' : 'Pending'}
            subtitle={events.length > 0 ? 'Live location available' : 'Create an event to enable tracking'}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  value: number | string;
  subtitle: string;
}

const SummaryCard = ({ icon, title, value, subtitle }: SummaryCardProps) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          {icon}
          <Stack>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

export default DashboardPage;
