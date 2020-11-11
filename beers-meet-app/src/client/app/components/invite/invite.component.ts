import { Component, Inject, OnInit} from '@angular/core';
import { UserInfoService } from '../../services/userInfoJwt.service';
import { IMeetup } from '../../models/meetup';
import { IUser } from '../../models/user';
import { MeetupService } from '../../services/meetup.service';
import { UsersService } from '../../services/users.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'invite-component',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit{
  public allUsers: IUser[];
  public loadingUsers: boolean = false;
  public errorToGetUsers: boolean = false;
  public errorToSave: boolean = false;
  public saving: boolean = false;
  public meetupSelected: IMeetup;
  public meetups: IMeetup[];

  constructor(
    @Inject(UserInfoService) public userInfoService: UserInfoService,
    @Inject(MAT_DIALOG_DATA) public data: IMeetup[],
    @Inject(UsersService) public usersService: UsersService,
    @Inject(MeetupService) public meetupService: MeetupService,
    public dialogRef: MatDialogRef<InviteComponent>,
    private snackBar: MatSnackBar,
  ) {
    this.meetups = this.data;
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.loadingUsers = true;
    this.usersService.getAllUsers().pipe
    (finalize(() => this.loadingUsers = false))
    .subscribe(
      (data: IUser[]) => {
        this.errorToGetUsers = false;
        this.allUsers = data;
      },
      (error) => {
        this.errorToGetUsers =  true;
        this.snackBar.open('Hubo un error al obtener los usuarios.',  null, {
          duration: 3000,
          horizontalPosition: 'center'});
        this.close();
        console.log(error);
      })
  }

  usersInvitesYet(userEmailList) {
    return this.meetupSelected?.users?.find(user => user.email === userEmailList)
  }

  sendInvites(usersSelected) {
    this.meetupService.sendInvites(usersSelected);
  }

  close() {
    this.dialogRef.close();
  }

}
