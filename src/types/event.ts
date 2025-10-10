export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  locationName?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateEventInput = {
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  locationName?: string;
};

export type UpdateEventInput = Partial<CreateEventInput>;
