import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-deleteusercontactno',
  templateUrl: './deleteusercontactno.component.html',
  styleUrls: ['./deleteusercontactno.component.css']
})
export class DeleteusercontactnoComponent implements OnInit {
  contactid;
  type;
  result;
  loading = false;
  userObj: any;
  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.userObj =  this.authService.currentUser;
  }

  confirm(): void {
    this.loading = true;
    const payload: any = {};
    payload.contactnoid = this.contactid;
    this.userService.deleteUserContactno(this.userObj.userid, payload)
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
