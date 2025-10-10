export interface LocationCoordinate {
  lat: number;
  lng: number;
}

export interface LiveLocation extends LocationCoordinate {
  id: string;
  eventId: string;
  label?: string;
  updatedAt: string;
}
