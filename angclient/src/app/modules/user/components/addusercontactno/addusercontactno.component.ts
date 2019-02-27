import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { MsconfigService } from '../../../../services/msconfig.service';

@Component({
  selector: 'app-addusercontactno',
  templateUrl: './addusercontactno.component.html',
  styleUrls: ['./addusercontactno.component.css']
})
export class AddusercontactnoComponent implements OnInit {

  title;
  result;
  inputForm: FormGroup;
  userObj: any;
  loading = false;
  ctype: any[];

  constructor(private fb: FormBuilder,
    public authService: AuthService,
    private userService: UserService,
    private msconfigService: MsconfigService,
    private router: Router,
    private toastr: ToastrService,
    public modalRef: BsModalRef) { }

    contactnotype = new FormControl('', [Validators.required]);
    contactnovalue = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);

  ngOnInit() {

    this.userObj =  this.authService.currentUser;

    this.getMsconfigbygroup('CNCTTP', (error, result) => {
      if (error) { this.ctype = [{config_code: '', config_name: error}];
      } else { this.ctype = result; }
    });

    this.inputForm = this.fb.group({
      contactnotype: this.contactnotype,
      contactnovalue: this.contactnovalue
    });

  }

  addUsercontactno(formdata: any): void {

    this.loading = true;
    this.userService.saveUserContactno(this.userObj.userid, formdata)
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
      this.modalRef.hide();
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
