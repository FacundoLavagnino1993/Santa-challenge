import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiLogin = '/api/login';

  constructor(private http: HttpClient) {}

  login = (args) => {
    return this.http.post(`${this.apiLogin}/authentication`,{
      email: args.email,
      password: args.password
    });
  };
}
