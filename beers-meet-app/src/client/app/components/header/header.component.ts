import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    @Inject(Router) private router: Router,
    private cookieService: CookieService,
  ) {
  }

  logout() {
    this.cookieService.delete('token');
    this.router.navigate(['/login']);
  }

}
