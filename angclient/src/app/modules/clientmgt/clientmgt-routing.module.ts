import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { PendinguserComponent } from './components/pendinguser/pendinguser.component';

import { AuthGuard } from '../../guards/auth.guard';

/* IF Lazy Loading */
const appRoutes: Routes = [
  {path: 'clients', component: ClientsComponent, canActivate: [AuthGuard]},
  {path: 'pendingusercli', component: PendinguserComponent, canActivate: [AuthGuard]},
  // {path:'password', component:PasswordComponent, canActivate:[AuthGuard]}
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
export class ClientmgtRoutingModule { }
