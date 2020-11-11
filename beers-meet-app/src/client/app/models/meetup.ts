import * as user from './user';

export interface IMeetup {
  _id?: number;
  dateMeetup: Date;
  name: string;
  temperature?: string;
  beersNeeded?: number;
  users: user.IUser[];
  usersCheckIn: user.IUser[];
}
