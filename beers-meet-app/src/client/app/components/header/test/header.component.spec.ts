import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HeaderComponent } from '../header.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginService } from '../../../services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { cold, getTestScheduler } from 'jasmine-marbles';
const routerFake = {
  navigate: (route): void => { }
}
describe('Login Component', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cookieService: CookieService;
  let router: Router;
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [HttpClientModule, MatToolbarModule, MatIconModule,FormsModule, ReactiveFormsModule, MatProgressBarModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule],
      providers: [
        CookieService,
        { provide: Router, useValue: routerFake }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    cookieService = TestBed.inject(CookieService);
    cookieService.set('token', 'someTokenValue');
    router = TestBed.inject(Router);
  });
  it('must be defined', () => {
    expect(component).toBeTruthy();
  });

  describe("on login", () => {
    it("must desolgin an user", () => {
      const navegateRoute = spyOn(router, 'navigate');
      expect(cookieService.get('token')).toBe("someTokenValue");
      component.logout();
      expect(cookieService.get('token')).toBe("");
      expect(navegateRoute).toHaveBeenCalledWith(['/login']);
    });
  });
})
