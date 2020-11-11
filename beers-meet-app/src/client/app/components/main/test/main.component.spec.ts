import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from '@angular/material/tabs';
import { MainComponent } from '../main.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MeetupComponent } from '../../meetup/meetup.component';
import { HeaderComponent } from '../../header/header.component';
import { CreateComponent } from '../../create/create.component';
import { InviteComponent } from '../../invite/invite.component';
import { ForecastService } from '../../../services/forecast.service';
import { MeetupService } from '../../../services/meetup.service';
import { UserInfoService } from '../../../services/userInfoJwt.service';
import { MatDialogRef } from '@angular/material/dialog';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Router } from '@angular/router';
import * as meetupMockResponse from './mock/meetup-mock.json';
import * as forecastMockResponse from './mock/forecast-mock.json';
import { forkJoin, of } from 'rxjs';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

const routerFake = {
  navigate: (route): void => { }
}

const dialogDataMock = {
  users : [{
    name : "Juan Perez",
    email : "juan.perez@mail.com"
  }],
  name : "MEET BEER",
  dateMeetup : "2020-10-12T23:30:00.000+0000"
};

export class DialogMock {
  open() {
    return {
      afterClosed: () => of(dialogDataMock),
    };
  }
}

const userAdminInfoServiceMock = {
  user: {
    name: "admin",
    email: "admin@mail.com",
    role: 'admin',
    isLogged: true
  }
}

const userInfoServiceMock = {
  user: {
    name: "juan perez",
    email: "juan.perez@mail.com",
    role: 'user',
    isLogged: true
  }
}

describe('Main Component with admin role', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let matSnackBar: MatSnackBar;
  let meetupService: MeetupService;
  let forecastService: ForecastService;
  let userInfoService: UserInfoService;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent, HeaderComponent, MeetupComponent, CreateComponent, InviteComponent],
      imports: [HttpClientModule, MatDialogModule,MatListModule, MatDatepickerModule, MatTabsModule, MatCardModule, MatSnackBarModule, MatToolbarModule, MatIconModule,FormsModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule],
      providers: [
        ForecastService,
        MeetupService,
        { provide: Router, useValue: routerFake },
        { provide: UserInfoService, useValue: userAdminInfoServiceMock },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useClass: DialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [CreateComponent],
      },
    }).compileComponents();
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    userInfoService = TestBed.inject(UserInfoService);
    meetupService = TestBed.inject(MeetupService);
    forecastService = TestBed.inject(ForecastService);
    dialog = TestBed.inject(MatDialog);
  });

  it('must be defined', () => {
    expect(component).toBeTruthy();
  });

  describe("init component ", () => {
    it('should retrive all info', () => {
      spyOn(meetupService, "getAllMeetups").and.callFake(() => cold('a|', { a: meetupMockResponse}));
      spyOn(forecastService, "getForecast").and.callFake(() => cold('a|', { a: forecastMockResponse }));
      component.ngOnInit();
      expect(component.loadingResources).toBeTruthy();

      expect(component.hasAdvancedRole).toBeTruthy();
      expect(component.errorToGetMeetups).toBeFalsy();
      expect(component.errorToGetForecast).toBeFalsy();
      getTestScheduler().flush();
      expect(component.loadingResources).toBeFalsy();
    })

    /*it('should open create meetup dialog', (done) => {

      component.createMeet();

      spyOn(dialog, 'open');
      expect(dialog.open).toHaveBeenCalled();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(dialog.open).toHaveBeenCalled();
      });
      done();
      expect(component.currentMeetups.length).toBe(1);
    })*/
  });
})
