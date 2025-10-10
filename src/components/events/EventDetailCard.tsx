import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

import { Event } from '../../types';
import dayjs from '../../utils/dayjs';

interface EventDetailCardProps {
  event: Event | null;
}

const EventDetailCard = ({ event }: EventDetailCardProps) => {
  if (!event) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select an event to see the details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose an event from the list to preview its schedule, location, and description.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Event
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {event.title}
            </Typography>
            {event.description && (
              <Typography variant="body1" color="text.secondary">
                {event.description}
              </Typography>
            )}
          </Stack>
          <Divider />
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarMonthIcon color="primary" />
            <Typography variant="body2">
              {dayjs(event.startTime).format('DD MMM YYYY HH:mm')}
            </Typography>
            {event.endTime && (
              <>
                <Typography variant="body2" color="text.secondary">
                  to
                </Typography>
                <Typography variant="body2">
                  {dayjs(event.endTime).format('DD MMM YYYY HH:mm')}
                </Typography>
              </>
            )}
          </Stack>
          {event.locationName && (
            <Stack direction="row" spacing={1} alignItems="center">
              <PlaceIcon color="secondary" />
              <Typography variant="body2">{event.locationName}</Typography>
            </Stack>
          )}
          <Stack direction="row" spacing={1} alignItems="center">
            <ScheduleIcon color="action" />
            <Chip label={`Updated ${dayjs(event.updatedAt).fromNow()}`} variant="outlined" />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EventDetailCard;
