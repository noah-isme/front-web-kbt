import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';

import { Event } from '../../types';
import dayjs from '../../utils/dayjs';

interface EventListProps {
  events: Event[];
  onSelect: (event: Event) => void;
  selectedId?: string;
}

const EventList = ({ events, onSelect, selectedId }: EventListProps) => {
  return (
    <Stack spacing={2}>
      {events.map((event) => {
        const isSelected = event.id === selectedId;
        return (
          <Card
            key={event.id}
            variant={isSelected ? 'outlined' : undefined}
            sx={{ borderColor: isSelected ? 'primary.main' : undefined }}
          >
            <CardActionArea onClick={() => onSelect(event)}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar>{event.title.charAt(0)}</Avatar>
                <Stack flex={1} spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(event.startTime).format('DD MMM YYYY HH:mm')}
                  </Typography>
                </Stack>
                <ArrowForwardIosIcon fontSize="small" color="disabled" />
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Stack>
  );
};

export default EventList;
