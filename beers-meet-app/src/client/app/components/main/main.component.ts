import { Component, Inject, OnInit } from '@angular/core';
import { UserInfoService } from '../../services/userInfoJwt.service';
import { ForecastService } from '../../services/forecast.service';
import { MeetupService } from '../../services/meetup.service';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { IMeetup } from '../../models/meetup';
import { calculatePurchaseBeers } from '../../utils/stockBuilder';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { InviteComponent } from '../invite/invite.component';
import { IUser } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit {

  public name: string;
  public email: string;
  public errorToGetMeetups: boolean = false;
  public errorToGetForecast: boolean = false;
  public meetups: IMeetup[] = [];
  public currentMeetups: IMeetup[] = [];
  public oldMeetups: IMeetup[] = [];
  public forecastDay;
  public beersNeeded: any;
  public loadingResources: boolean = false;
  private forecast: any;
  private readonly milliseconds: number = 1000;
  private readonly _ADMIN: string = 'admin';
  public hasAdvancedRole: boolean;


  constructor(
    @Inject(UserInfoService) private userInfoService: UserInfoService,
    @Inject(ForecastService) private forecastService: ForecastService,
    @Inject(MeetupService) private meetupService: MeetupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.name = this.userInfoService.user.name;
    this.email = this.userInfoService.user.email;
    this.hasAdvancedRole = this.userInfoService.user.role === this._ADMIN;
    this.getMeetups();
  }


  getMeetups() {
    this.loadingResources = true;
    forkJoin([
      this.meetupService.getAllMeetups().pipe(
        catchError(_ => {
          this.errorToGetMeetups = true;
          this.snackBar.open('ERROR al obtener meetups',  null, {
            duration: 3000,
            horizontalPosition: 'center'
          });
          return of([]);
        }),
      ),this.forecastService.getForecast().pipe(
        catchError(_ => {
          this.errorToGetForecast = true;
          this.snackBar.open('ERROR al obtener datos del pronóstico',  null, {
            duration: 3000,
            horizontalPosition: 'center'
          });
          return of([]);
        })
    )]).pipe(finalize(() => this.loadingResources = false)).subscribe(
        (response: any[]) => {
        [this.meetups, this.forecast] = response;
        this.meetups?.forEach((meetup: IMeetup) => {
          meetup = this.completeMeetupInfo(meetup);
          this.filterByDate(meetup);
        });
        this.errorToGetForecast = false;
        this.errorToGetMeetups = false;
      }, (error) => {
        console.log(error);
      })
  }

  filterByDate(meetup: IMeetup) {
    new Date(meetup.dateMeetup).getTime() >= Date.now() ? this.currentMeetups.push(meetup) : this.oldMeetups.push(meetup)
  }

  completeMeetupInfo (meetup:IMeetup): IMeetup {
    const forecastDay =  this.forecast?.daily.find(item => this.matchForecast(item.dt, meetup.dateMeetup));
    meetup.temperature = forecastDay ? String(Math.round(forecastDay.temp.day)) : '-';
    meetup.beersNeeded = calculatePurchaseBeers(meetup.users.length , meetup.temperature)
    return meetup;
  }

  matchForecast(forecastDate, meetupDate) {
    const forecastDateParse = new Date(forecastDate * this.milliseconds).getDate();
    const meetupDatePase = new Date(meetupDate).getDate();
    return forecastDateParse === meetupDatePase;
  }

  createMeet() {
    this.dialog.open(CreateComponent, {
      width: '80%',
      panelClass: "create-dialog"
    }).afterClosed().subscribe((meetupCreated: IMeetup) => {
      if (meetupCreated) {
        this.currentMeetups.push(this.completeMeetupInfo(meetupCreated));
      }
    })
  }

  sendInvites() {
    this.dialog.open(InviteComponent, {
      width: '80%',
      data: this.currentMeetups,
      panelClass: "invite-dialog"
    }).afterClosed().subscribe((users: IUser[]) => {
    })
  }
}
