import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { MeetupService } from '../../../services/meetup.service';
import { UserInfoService } from '../../../services/userInfoJwt.service';
import { UsersService } from '../../../services/users.service';
import { CreateComponent } from '../create.component';

describe('Create Component', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let userInfoService: UserInfoService;
  let usersService: UsersService;
  let meetupService: MeetupService;
  let matSnackBar: MatSnackBar;
  let matDialogRef: MatDialogRef<any, any>;
  const dialogRefMock = {
    close: (value?) => { }
  }
  const userInfoServiceMock = {
    user: () => ({
      name: "Juan Perez",
      email: "juan.perez@mail.com",
      role: 'admin',
      isLogged: true
    })
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateComponent],
      imports: [MatDatepickerModule, MatNativeDateModule, HttpClientModule, MatSnackBarModule, FormsModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule, MatFormFieldModule, MatDatepickerModule],
      providers: [
        MatDatepickerModule,
        UsersService,
        MeetupService,
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: UserInfoService, useValue: userInfoServiceMock },
        MatSnackBar
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    userInfoService = TestBed.inject(UserInfoService);
    usersService = TestBed.inject(UsersService);
    meetupService = TestBed.inject(MeetupService);
    matSnackBar = TestBed.inject(MatSnackBar);
    matDialogRef = TestBed.inject(MatDialogRef);
  });
  afterEach(() => getTestScheduler().flush());
  it('must be defined', () => {
    expect(component).toBeTruthy();
  });
  describe("on init", () => {
    it("must define meetup form", () => {
      component.ngOnInit();
      expect(component.meetupForm).toBeDefined();
    })
  })
  describe("On create meet", () => {
    it("should successfully create a meetup", () => {
      const createMeetupResponse = { data: {} };
      spyOn(meetupService, "createMeetup").and.callFake(() => cold('a|', { a: createMeetupResponse }));
      spyOn(matSnackBar, "open");
      spyOn(matDialogRef, "close");
      component.ngOnInit();
      component.meetupForm.get("name").setValue("Super Party");
      component.meetupForm.get("hour").setValue(10);
      component.meetupForm.get("minutes").setValue(35);
      component.meetupForm.get("date").setValue(new Date("05/10/2020"));
      const expected = {
        name: "Super Party",
        users: [],
        dateMeetup: new Date('2020-05-10T13:35:00.000Z'),
        usersCheckIn: []
      }
      component.createMeet();
      expect(component.saving).toBeTruthy();
      getTestScheduler().flush();
      expect(meetupService.createMeetup).toHaveBeenCalledWith(expected);
      expect(component.saving).toBeFalsy();
      expect(component.errorToSave).toBeFalsy();
      expect(matDialogRef.close).toHaveBeenCalledWith(createMeetupResponse);
      expect(matSnackBar.open).toHaveBeenCalledWith('Meetup creada con exito!', null, {
        duration: 3000,
        horizontalPosition: 'center'
      });
    })
    it("should catch error if meetup service fails", () => {
      const createMeetupResponse = { data: {} };
      spyOn(meetupService, "createMeetup").and.callFake(() => cold('--#|', {}, { error: 'Unexpected Error' }));
      spyOn(matSnackBar, "open");
      spyOn(matDialogRef, "close");
      component.ngOnInit();
      component.meetupForm.get("name").setValue("Super Party");
      component.meetupForm.get("hour").setValue(10);
      component.meetupForm.get("minutes").setValue(35);
      component.meetupForm.get("date").setValue(new Date("05/10/2020"));
      const expected = {
        name: "Super Party",
        users: [],
        dateMeetup: new Date('2020-05-10T13:35:00.000Z'),
        usersCheckIn: []
      }
      component.createMeet();
      expect(component.saving).toBeTruthy();
      getTestScheduler().flush();
      expect(meetupService.createMeetup).toHaveBeenCalledWith(expected);
      expect(component.saving).toBeFalsy();
      expect(component.errorToSave).toBeTruthy();
      expect(matDialogRef.close).not.toHaveBeenCalled();
      expect(matSnackBar.open).toHaveBeenCalledWith('ERROR al crear meetup.', null, {
        duration: 3000,
        horizontalPosition: 'center'
      });
    })
  })
  describe("On close", () => {
    it("must close itself", () => {
      spyOn(matDialogRef, "close");
      component.close();
      expect(matDialogRef.close).toHaveBeenCalled();
    })
  })
});
