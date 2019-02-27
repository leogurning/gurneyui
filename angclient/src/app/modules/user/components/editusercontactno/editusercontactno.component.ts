import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { MsconfigService } from '../../../../services/msconfig.service';

@Component({
  selector: 'app-editusercontactno',
  templateUrl: './editusercontactno.component.html',
  styleUrls: ['./editusercontactno.component.css']
})
export class EditusercontactnoComponent implements OnInit {
  title;
  result;
  contactid;
  inputForm: FormGroup;
  userObj: any;
  usercontactno: any;
  loading = false;
  ctype: any[];
  sts: any[];

  constructor(private fb: FormBuilder,
    public authService: AuthService,
    private userService: UserService,
    private msconfigService: MsconfigService,
    private router: Router,
    private toastr: ToastrService,
    public modalRef: BsModalRef) { }

    contactnotype = new FormControl('', [Validators.required]);
    contactnovalue = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
    status = new FormControl('', [Validators.required]);

  ngOnInit() {

    this.userObj =  this.authService.currentUser;
    this.getMsconfigbygroup('CNCTTP', (error, result) => {
      if (error) { this.ctype = [{config_code: '', config_name: error}];
      } else { this.ctype = result; }
    });

    this.getMsconfigbygroup('STSENT', (error, result) => {
      if (error) { this.sts = [{config_code: '', config_name: error}];
      } else { this.sts = result; }
    });

    this.getContactno(this.contactid);
    this.inputForm = this.fb.group({
      contactnotype: this.contactnotype,
      contactnovalue: this.contactnovalue,
      status: this.status
    });

  }

  getContactno(id) {
    this.loading = true;
    this.userService.getUserContactno(id).subscribe(data => {
      if (data.success === true) {
        if (data.data) {
          this.usercontactno = data.data;
          this.populateForm(data.data);
        } else {
          this.toastr.error('Contact id is incorrect in the URL');
        }
      } else {
        this.toastr.error(data.message);
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
      contactnotype: data.contact_no_type,
      contactnovalue: data.contact_no_value,
      status: data.contact_no_status
    });
  }

  updateUsercontactno(formdata: any): void {
    this.loading = true;
    formdata.contactnoid = this.contactid;
    this.userService.updateUserContactno(this.userObj.userid, formdata)
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

  getMsconfigbygroup(group, cb) {

    this.msconfigService.getMsconfigbygroup(group).subscribe(data => {
      if (data.success === true) {
        if (data.data[0]) {
          cb(null, data.data);
        } else {
          cb('No config found', null);
        }
      } else {
        cb(data.message, null);
      }
    },
    err => {
      cb('Error ms config list', null);
    });
  }

}
