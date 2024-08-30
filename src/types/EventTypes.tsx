import { User } from './UserTypes';

export interface Event {
    ID?: number;
    name: string;
    description: string;
    CreatedAt: Date;
    users?: User[];
  }