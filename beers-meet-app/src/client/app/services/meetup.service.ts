import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMeetup } from '../models/meetup';
import { IUser } from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private readonly apiMeetup = '/api/meetup';

  constructor(private http: HttpClient) {}

  getAllMeetups = () => {
    return this.http.get(`${this.apiMeetup}/`);
  };

  createMeetup = (args: IMeetup) => {
    return this.http.post(`${this.apiMeetup}/create`, {
      name: args.name,
      dateMeetup: args.dateMeetup,
      users: args.users
    })
  }

  registerUserToMeetup = (args) => {
    return this.http.put(`${this.apiMeetup}/add-user`, {
      id: args.id,
      user: args.user,
      action: args.action
    })
  }

  sendInvites = (args) => {

  }
}
