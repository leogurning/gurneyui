import { NgModule } from '@angular/core';

import { ClientmgtRoutingModule } from './clientmgt-routing.module';
import { ClientsComponent } from './components/clients/clients.component';
import { SharedModule } from '../../modules/shared/shared.module';
import { AddclientComponent } from './components/clients/addclient/addclient.component';
import { EditclientComponent } from './components/clients/editclient/editclient.component';
import { DeleteclientComponent } from './components/clients/deleteclient/deleteclient.component';
import { PendinguserComponent } from './components/pendinguser/pendinguser.component';
import { ApproveComponent } from './components/pendinguser/approve/approve.component';
import { RejectComponent } from './components/pendinguser/reject/reject.component';

@NgModule({
  declarations: [
    ClientsComponent,
    AddclientComponent,
    EditclientComponent,
    DeleteclientComponent,
    PendinguserComponent,
    ApproveComponent, RejectComponent
  ],
  imports: [
    SharedModule,
    ClientmgtRoutingModule
  ],
  entryComponents: [
    AddclientComponent,
    EditclientComponent,
    DeleteclientComponent,
    ApproveComponent,
    RejectComponent
  ]
})
export class ClientmgtModule { }
