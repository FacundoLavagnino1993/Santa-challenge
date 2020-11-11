import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { UserInfoService } from '../../services/userInfoJwt.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  public loginForm: FormGroup;
  public loading: boolean = false;
  public errorLoginMessage: string;
  public errorToLogin: boolean = false;
  readonly _STATUS_FORBIDDEN_ = 403;

  constructor(@Inject(LoginService) public loginService: LoginService, private router: Router,
  @Inject(UserInfoService) public userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  login() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.loading = true;
    this.loginService.login({email: email, password: password}).pipe(
      finalize(() => this.loading = false)
      ).subscribe(
        (data) => {
          this.userInfoService.getUserInfo();
          this.router.navigate(['/home']);
        },
        (error) => {
          this.errorToLogin = true;
          if (error.status == this._STATUS_FORBIDDEN_) {
            this.errorLoginMessage = 'Email y/o contraseña incorrectos.'
          } else {
            this.errorLoginMessage = 'Hubo un problema. Reintente nuevamente.'
          }
      }
    )
  }

}
