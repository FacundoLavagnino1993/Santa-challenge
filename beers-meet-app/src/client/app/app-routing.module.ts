import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { MeetupComponent } from './components/meetup/meetup.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [{
  path: 'home',
  component: MainComponent,
  children: [{
    path:'meets',
    component: MeetupComponent
  }
  ]
}, {
  path:'login',
  component: LoginComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
