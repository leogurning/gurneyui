import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './modules/root/components/home/home.component';
import { ErrorpageComponent } from './modules/root/components/errorpage/errorpage.component';
import { PagenotfoundComponent } from './modules/root/components/pagenotfound/pagenotfound.component';
import { LoginComponent } from './modules/root/components/login/login.component';
import { DashboardComponent } from './modules/root/components/dashboard/dashboard.component';
import { LogoutComponent } from './modules/root/components/logout.component';
import { EmailverificationComponent } from './modules/root/components/emailverification/emailverification.component';
import { RegisterclientComponent } from './modules/root/components/registerclient/registerclient.component';
import { ForgetpasswordComponent } from './modules/root/components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './modules/root/components/resetpassword/resetpassword.component';

import { AuthGuard } from './guards/auth.guard';
import { CustomPreloadingService } from './custom-preloading.service';

const appRoutes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'errorpage', component: ErrorpageComponent},
    {path: 'verify', component: EmailverificationComponent },
    {path: 'registercli', component: RegisterclientComponent },
    {path: 'forgetpassword', component: ForgetpasswordComponent },
    {path: 'resetpwd', component: ResetpasswordComponent },
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
    /* This is for feature module lazy loading with preload strategy */
    {path: 'user', data: { preload: true } , loadChildren: './modules/user/user.module#UserModule'},
    {path: 'clientmgt', data: { preload: true } , loadChildren: './modules/clientmgt/clientmgt.module#ClientmgtModule'},
    {path: '**', component: PagenotfoundComponent}
  ];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    RouterModule.forRoot(appRoutes, {preloadingStrategy: CustomPreloadingService})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
