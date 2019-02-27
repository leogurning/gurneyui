import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordComponent } from './components/password/password.component';

import { SharedModule } from '../../modules/shared/shared.module';
import { AdduseraddressComponent } from './components/adduseraddress/adduseraddress.component';
import { EdituseraddressComponent } from './components/edituseraddress/edituseraddress.component';
import { DeleteuseraddressComponent } from './components/deleteuseraddress/deleteuseraddress.component';
import { AddusercontactnoComponent } from './components/addusercontactno/addusercontactno.component';
import { EditusercontactnoComponent } from './components/editusercontactno/editusercontactno.component';
import { DeleteusercontactnoComponent } from './components/deleteusercontactno/deleteusercontactno.component';



@NgModule({
  declarations: [
    ProfileComponent,
    PasswordComponent,
    AdduseraddressComponent,
    EdituseraddressComponent,
    DeleteuseraddressComponent,
    AddusercontactnoComponent,
    EditusercontactnoComponent,
    DeleteusercontactnoComponent
  ],
  imports: [
    UserRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AdduseraddressComponent,
    EdituseraddressComponent,
    DeleteuseraddressComponent,
    AddusercontactnoComponent,
    EditusercontactnoComponent,
    DeleteusercontactnoComponent
  ]
})
export class UserModule { }
