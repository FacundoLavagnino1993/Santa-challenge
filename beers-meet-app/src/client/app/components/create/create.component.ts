import { Component, Inject, OnInit} from '@angular/core';
import { UserInfoService } from '../../services/userInfoJwt.service';
import { IMeetup } from '../../models/meetup';
import { IUser } from '../../models/user';
import { MeetupService } from '../../services/meetup.service';
import { UsersService } from '../../services/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'create-component',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit{
  public minDate: Date;
  public maxDate: Date;
  public allUsers: IUser[];
  public loadingUsers: boolean = false;
  public errorToGetUsers: boolean = false;
  public meetupForm: FormGroup;
  public hours: number[] = Array.from({length: 24}, (x, i) => i);
  public minutes: number[] = Array.from({length: 60}, (x, i) => i);
  public errorToSave: boolean = false;
  public saving: boolean = false;

  constructor(
    @Inject(UsersService) public usersService: UsersService,
    @Inject(MeetupService) public meetupService: MeetupService,
    public dialogRef: MatDialogRef<CreateComponent>,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    const now = new Date();
    this.minDate = new Date();
    const oneWeek = now.setDate(now.getDate() + 7);
    this.maxDate = new Date(oneWeek)
    this.meetupForm = new FormGroup({
      name: new FormControl('',[Validators.required, Validators.maxLength(18)]),
      date: new FormControl('', [Validators.required]),
      hour: new FormControl('', [Validators.required]),
      minutes: new FormControl('', [Validators.required]),
    });
  }


  createMeet() {
    const newMeet: IMeetup = {
      name: this.meetupForm.get('name').value,
      users: [],
      usersCheckIn: [],
      dateMeetup: this.addTimeToDate()
    }
    this.saving = true;
    this.meetupService.createMeetup(newMeet).pipe(
      finalize(() => this.saving = false)
    )
    .subscribe(
      (data) => {
        this.errorToSave = false;
        this.snackBar.open('Meetup creada con exito!',  null, {
          duration: 3000,
          horizontalPosition: 'center'
        });
        this.dialogRef.close(data);
      },
      (error) => {
        this.snackBar.open('ERROR al crear meetup.',  null, {
          duration: 3000,
          horizontalPosition: 'center'});
        console.log(error);
        this.errorToSave = true;
      }
    )
  }

  addTimeToDate() {
    const hour = this.meetupForm.get('hour').value;
    const minutes = this.meetupForm.get('minutes').value;
    const date = this.meetupForm.get('date').value;
    const dateUpdate = new Date(date).setHours(hour, minutes);
    return new Date(dateUpdate);
  }

  close() {
    this.dialogRef.close();
  }

}
