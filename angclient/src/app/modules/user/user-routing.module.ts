import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordComponent } from './components/password/password.component';

import { AuthGuard } from '../../guards/auth.guard';

/* IF Not Lazy Loading
const appRoutes: Routes = [
    { path: 'user', children: [
        {path:'', component:ProfileComponent, canActivate:[AuthGuard]},
        {path:'password', component:PasswordComponent, canActivate:[AuthGuard]}
      ]
    }
];
*/
/* IF Lazy Loading */
const appRoutes: Routes = [
      {path: '', component: ProfileComponent, canActivate: [AuthGuard]},
      {path: 'password', component: PasswordComponent, canActivate: [AuthGuard]}
  ];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule { }
