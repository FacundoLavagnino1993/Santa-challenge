import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from '@angular/material/tabs';
import { MeetupComponent } from '../meetup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MeetupService } from '../../../services/meetup.service';
import { UserInfoService } from '../../../services/userInfoJwt.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';

const routerFake = {
  navigate: (route): void => { }
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
    name: "Juan Perez",
    email: "juan.perez@mail.com",
    role: 'user',
    isLogged: true
  }
}
const date = new Date("2020-10-08T10:30:00.000+0000");
describe('Meetup Component with admin role', () => {
  let component: MeetupComponent;
  let fixture: ComponentFixture<MeetupComponent>;
  let meetupService: MeetupService;
  let userInfoService: UserInfoService;
  let matSnackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetupComponent],
      imports: [HttpClientModule, MatCardModule, MatSnackBarModule, MatToolbarModule, MatIconModule,FormsModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule],
      providers: [
        MatSnackBar,
        MeetupService,
        UserInfoService,
        { provide: Router, useValue: routerFake },
        { provide: UserInfoService, useValue: userAdminInfoServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MeetupComponent);
    component = fixture.componentInstance;
    userInfoService = TestBed.inject(UserInfoService);
    meetupService = TestBed.inject(MeetupService);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  it('must be defined', () => {
    expect(component).toBeTruthy();
  });

  describe('init with role admin', () => {
    it('user should be role advance', () => {
      component.ngOnInit();
      expect(component.hasAdvancedRole).toBeTruthy();
    })
  });

  describe('user save on meetup', () => {
    it('user should not be on meetup', () => {
      component.meetups = [{
        "users" : [{"name" : "Juan Perez","email" : "juan.perez@mail.com"}],
        "name" : "vaaamoo",
        "usersCheckIn": [],
        "dateMeetup" : date
      }];
      expect(component.userRegistryValidation([component.meetups[0].users[0]])).toBeFalsy();
    })
  });

  describe('registry service', () => {
    beforeEach(() => {
      component.meetups = [{
        "users" : [{"name" : "Juan Perez","email" : "juan.perez@mail.com"}],
        "name" : "vaaamoo",
        "usersCheckIn": [],
        "dateMeetup" : date
      }];
    })
    it('should registry user with INSCRIPT action', () => {
      spyOn(meetupService, "registerUserToMeetup").and.callFake(() => cold('a|', { a: {data: {}} }));
      component.registerUser(component.meetups[0], component.inscriptAction);
      getTestScheduler().flush();

      expect(component.meetups[0].users[1]).toEqual({"email" : "admin@mail.com", "name" : "admin"})
      expect(component.errorToRegistry).toBeFalsy();
    });

    it('registry user service should be fail', () => {
      spyOn(matSnackBar, "open");
      spyOn(meetupService, "registerUserToMeetup").and.callFake(() => cold('#|', {}, {error: {}}));
      component.registerUser(component.meetups[0], component.inscriptAction);
      getTestScheduler().flush();

      //expect(component.errorToRegistry).toBeTruthy();
      expect(matSnackBar.open).toHaveBeenCalledWith(component.inscriptAction.errorMsg, null, {
        duration: 3000,
        horizontalPosition: 'center'
      });
    });
  })

})




describe('Meetup Component with user role', () => {
  let component: MeetupComponent;
  let fixture: ComponentFixture<MeetupComponent>;
  let meetupService: MeetupService;
  let userInfoService: UserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetupComponent],
      imports: [HttpClientModule, MatCardModule, MatSnackBarModule, MatToolbarModule, MatIconModule,FormsModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule],
      providers: [
        MeetupService,
        UserInfoService,
        { provide: Router, useValue: routerFake },
        { provide: UserInfoService, useValue: userInfoServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MeetupComponent);
    component = fixture.componentInstance;
    userInfoService = TestBed.inject(UserInfoService);
    meetupService = TestBed.inject(MeetupService);
  });

  it('must be defined', () => {
    expect(component).toBeTruthy();
  });

  describe('init with role admin', () => {
    it('user should be role advance', () => {
      component.ngOnInit();
      expect(component.hasAdvancedRole).toBeFalsy();
    })

  });
  describe('user save on meetup', () => {
    it('user should not be on meetup', () => {
      component.meetups = [{
        "users" : [{"name" : "Juan Perez","email" : "juan.perez@mail.com"}],
        "name" : "vaaamoo",
        "usersCheckIn": [],
        "dateMeetup" : date
      }];
      expect(component.userRegistryValidation([component.meetups[0].users[0]])).toBeTruthy();
    })
  })

  describe('registry service', () => {
    beforeEach(() => {
      component.meetups = [{
        "users" : [{"name" : "Juan Perez","email" : "juan.perez@mail.com"}],
        "name" : "vaaamoo",
        "usersCheckIn": [],
        "dateMeetup" : date
      }];
    })
    it('should registry user with check in action', () => {
      spyOn(meetupService, "registerUserToMeetup").and.callFake(() => cold('a|', { a: {data: {}} }));
      component.registerUser(component.meetups[0], component.checkInAction);
      getTestScheduler().flush();
      expect(component.meetups[0].usersCheckIn[0]).toEqual({"email" : "juan.perez@mail.com", "name" : "Juan Perez"})
    });
  })
})
