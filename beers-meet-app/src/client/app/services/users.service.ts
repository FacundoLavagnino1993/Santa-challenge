import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUsers = '/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers = () => {
    return this.http.get(`${this.apiUsers}/`);
  };
}
