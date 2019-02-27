import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../../common/toastr.service';
import { PendingusercliService } from '../../../../../services/pendingusercli.service';
import { AuthService } from '../../../../../services/auth.service';
import { UserService } from '../../../../../services/user.service';
import { ClientsService } from '../../../../../services/clients.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {
  title;
  result;
  userid;
  user: any;
  inputForm: FormGroup;
  userObj: any;
  loading = false;
  clist: any[];
  @ViewChild('inputclientRef') inputclientElementRef: ElementRef;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private pendingUsercliService: PendingusercliService,
    private userService: UserService,
    private clientsService: ClientsService,
    private router: Router,
    private toastr: ToastrService,
    public modalRef: BsModalRef) { }

  firstname = new FormControl({value: '', disabled: true}, [Validators.required]);
  email = new FormControl({value: '', disabled: true}, [Validators.email]);
  usercode = new FormControl('', [Validators.required]);

  ngOnInit() {

    this.userObj =  this.authService.currentUser;

    const payload: any = {};
    payload.clientname = '';
    this.getClients(payload, (error, result) => {
      if (error) { this.clist = [{client_id: '', client_name: error}];
      } else { this.clist = result; }
    });

    this.getUser(this.userid);

    this.inputForm = this.fb.group({
      firstname: this.firstname,
      email: this.email,
      usercode: this.usercode
    });

  }

  getUser(id): void {
    this.loading = true;
    this.userService.getUser(id).subscribe(data => {
      if (data.success === false) {
        if (data.errcode) {
          this.authService.logout();
          this.router.navigate(['/errorpage']);
        }
        this.toastr.error(data.message);
      } else {
        this.user = data.data;
        this.populateForm(this.user);

        if (!this.user.usercode || this.user.usercode === '') {
          this.inputclientElementRef.nativeElement.selectedIndex = 0;
        }
      }
      this.loading = false;
    },
    err => {
      this.loading = false;
      this.toastr.error(err);
    });
  }

  populateForm(data): void {
    this.inputForm.patchValue({
      firstname: data.firstname,
      email: data.email,
      usercode: data.usercode
    });
  }

  getClients(payload, cb) {
    this.clientsService.getActiveclient(payload).subscribe(data => {
      if (data.success === true) {
        if (data.data[0]) {
          cb(null, data.data);
        } else {
          cb('No client found', null);
        }
      } else {
        cb(data.message, null);
      }
    },
    err => {
      cb('Error getting client list', null);
    });
  }

  approveUser(formdata: any): void {
    this.loading = true;
    formdata.usercliid = this.userid;
    formdata.admusercode = this.userObj.usercode;
    console.log(formdata);
    console.log(this.userObj.usercode);
    this.pendingUsercliService.approveUserclient(this.userObj.userid, formdata)
      .subscribe(data => {
        this.loading = false;
        if (data.success === false) {
          if (data.errcode) {
            this.authService.logout();
            this.router.navigate(['/errorpage']);
          }
          this.toastr.error(data.message);
        } else {
          this.toastr.success(data.message);
        }
        this.modalRef.hide();
    },
    err => {
      this.loading = false;
      this.toastr.error(err);
    });
  }

}
