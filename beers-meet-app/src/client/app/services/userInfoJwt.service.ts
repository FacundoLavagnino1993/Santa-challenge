
import { Injectable, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { decodeJwt } from '../utils/jwtDecode';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {

  private _user: IUser;

  constructor(private cookieService: CookieService) {
    this.getUserInfo();
  }

  public get user() {
    return this._user;
  }

  public getUserInfo() {
    if (this.cookieService.get('token')) {
      const userDecode = decodeJwt(this.cookieService.get('token'));
      this._user = ({
        name: userDecode.name,
        email: userDecode.email,
        role: userDecode.role
      });
    }

  }

}

