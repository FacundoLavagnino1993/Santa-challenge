import { Component, Inject, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IMeetup } from '../../models/meetup';
import { IUser } from '../../models/user';
import { UserInfoService } from '../../services/userInfoJwt.service';
import { MeetupService } from '../../services/meetup.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'meetup',
  templateUrl: './meetup.component.html',
  styleUrls: ['./meetup.component.scss']
})
export class MeetupComponent implements  OnInit{
  public dayMeetup: string;
  public dateMeetup: string;
  private readonly _ADMIN: string = 'admin';
  public readonly CURRENT: string = 'current';
  public readonly OLD: string = 'old';
  public errorToRegistry: boolean = false;
  public hasAdvancedRole: boolean;
  public readonly checkInAction: any = {
    name: 'CHECK_IN',
    successMsg: 'Check In exitoso!',
    errorMsg: 'Error al hacer Check In'
  };
  public readonly inscriptAction: any = {
    name: 'INSCRIPT',
    successMsg: 'Inscripcion exitosa!',
    errorMsg: 'Error al Inscribirse'
  };
  @Input() meetups: IMeetup[];
  @Input() meetupType: string;

  constructor(
    @Inject(UserInfoService) private userInfoService: UserInfoService,
    @Inject(MeetupService) private meetupService: MeetupService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.hasAdvancedRole = this.userInfoService.user.role === this._ADMIN;
  }

  userRegistryValidation(meetupsUsers: IUser[]) {
    const userRegister = meetupsUsers?.find((user) =>  user.email === this.userInfoService.user.email);
    return userRegister !== undefined;
  }

  registerUser(meetup: IMeetup, action: any) {
    const payload = {
      action: action.name,
      id: meetup._id,
      user: {
        name: this.userInfoService.user.name,
        email: this.userInfoService.user.email
      }
    }
    this.meetupService.registerUserToMeetup(payload).subscribe(
      (data) => {
        if (action.name == 'CHECK_IN') {
          this.meetups.forEach((meetup) => {
            if (meetup._id === payload.id) meetup.usersCheckIn.push(payload.user)
          });
        } else {
          this.meetups.forEach((meetup) => {
            if (meetup._id === payload.id) meetup.users.push(payload.user)
          });
        }
        this.snackBar.open(action.successMsg,  null, {
          duration: 3000,
          horizontalPosition: 'center'});
        this.errorToRegistry = false;
      },(error) => {
        console.log(error);
        this.snackBar.open(action.errorMsg,  null, {
          duration: 3000,
          horizontalPosition: 'center'});
        this.errorToRegistry = true;
      })
  };
}
