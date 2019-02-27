import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../../common/toastr.service';
import { ClientsService } from '../../../../../services/clients.service';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-deleteclient',
  templateUrl: './deleteclient.component.html',
  styleUrls: ['./deleteclient.component.css']
})
export class DeleteclientComponent implements OnInit {

  clientid;
  clientname;
  result;
  loading = false;
  userObj: any;

  constructor(
    public authService: AuthService,
    private clientsService: ClientsService,
    private router: Router,
    private toastr: ToastrService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.userObj =  this.authService.currentUser;
  }

  confirm(): void {

    this.loading = true;
    this.clientsService.deleteClient(this.clientid)
    .subscribe(data => {
      if (data.success === false) {
        this.loading = false;
        if (data.errcode) {
          this.authService.logout();
          this.router.navigate(['/errorpage']);
        }
        this.toastr.error(data.message);
      } else {
        this.loading = false;
        this.toastr.success(data.message);
      }
      this.modalRef.hide();
    },
    err => {
      this.loading = false;
      this.toastr.error(err);
    });
  }

  decline(): void {
    this.modalRef.hide();
  }

}
