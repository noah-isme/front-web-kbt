import { User } from './UserTypes';

export interface Event {
    ID?: number;
    name: string;
    description: string;
    gpx_route?: File;
    // CreatedAt: Date;
    users?: User[];
  }