import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoginComponent } from '../login.component';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
const routerFake = {
  navigate: (route): void => { }
}
describe('Login Component', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  beforeEach(() => {
    spyOn(routerFake, 'navigate');
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule],
      providers: [
        { provide: Router, useValue: routerFake }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService);
  });
  it('must be defined', () => {
    expect(component).toBeTruthy();
  });
  describe("on init", () => {
    it("must define login form", () => {
      component.ngOnInit();
      expect(component.loginForm).toBeDefined();
    })
  })
  describe("on login", () => {
    it("must successfully login an user", () => {
      const loginResponse = { data: {} };
      spyOn(loginService, 'login').and.callFake(() => cold('a|', { a: loginResponse }));
      component.ngOnInit();
      component.loginForm.get("email").setValue("chapulin.colorado@lavecindad.com");
      component.loginForm.get("password").setValue("otroGato");
      component.login();
      expect(component.loading).toBeTruthy();
      getTestScheduler().flush();
      expect(loginService.login).toHaveBeenCalledWith({ email: "chapulin.colorado@lavecindad.com", password: "otroGato" });
      expect(routerFake.navigate).toHaveBeenCalledWith(['/home']);
      expect(component.loading).toBeFalsy();
      expect(component.errorToLogin).toBeFalsy();
    });
    it("must catch 403 error if service fails", () => {
      spyOn(loginService, 'login').and.callFake(() => cold('#|', {}, { status: 403 }));
      component.ngOnInit();
      component.loginForm.get("email").setValue("chapulin.colorado@lavecindad.com");
      component.loginForm.get("password").setValue("otroGato");
      component.login();
      expect(component.loading).toBeTruthy();
      getTestScheduler().flush();
      expect(loginService.login).toHaveBeenCalledWith({ email: "chapulin.colorado@lavecindad.com", password: "otroGato" });
      expect(routerFake.navigate).not.toHaveBeenCalled();
      expect(component.loading).toBeFalsy();
      expect(component.errorToLogin).toBeTruthy();
      expect(component.errorLoginMessage).toEqual('Email y/o contraseña incorrectos.');
    })
    it("must catch if service fails with another http error status", () => {
      spyOn(loginService, 'login').and.callFake(() => cold('#|', {}, { status: 500, message: 'Unexpected error' }));
      component.ngOnInit();
      component.loginForm.get("email").setValue("chapulin.colorado@lavecindad.com");
      component.loginForm.get("password").setValue("otroGato");
      component.login();
      expect(component.loading).toBeTruthy();
      getTestScheduler().flush();
      expect(loginService.login).toHaveBeenCalledWith({ email: "chapulin.colorado@lavecindad.com", password: "otroGato" });
      expect(routerFake.navigate).not.toHaveBeenCalled();
      expect(component.loading).toBeFalsy();
      expect(component.errorToLogin).toBeTruthy();
      expect(component.errorLoginMessage).toEqual('Hubo un problema. Reintente nuevamente.');
    })
  })
});
