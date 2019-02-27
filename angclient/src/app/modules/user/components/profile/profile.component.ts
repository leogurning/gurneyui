import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AdduseraddressComponent } from '../adduseraddress/adduseraddress.component';
import { EdituseraddressComponent } from '../edituseraddress/edituseraddress.component';
import { DeleteuseraddressComponent } from '../deleteuseraddress/deleteuseraddress.component';
import { AddusercontactnoComponent } from '../addusercontactno/addusercontactno.component';
import { EditusercontactnoComponent } from '../editusercontactno/editusercontactno.component';
import { DeleteusercontactnoComponent } from '../deleteusercontactno/deleteusercontactno.component';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MsconfigService } from '../../../../services/msconfig.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  totalpage: number;
  qpage: string;
  useraddressid: any;
  maxfilesize: number;
  quserid: string;
  qsort: string;
  pgCounter: number;
  totalrows: number;
  totalrowscn: number;
  useraddress: any;
  usercontactno: any;
  profileForm: FormGroup;
  userObj: any;
  user: any;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  private displayImg: string;
  private filesToUpload: File[];
  private photoname: string;
  private profileuploadpath = environment.profileUploadpath;

  constructor(private fb: FormBuilder,
      public authService: AuthService,
      private userService: UserService,
      private msconfigService: MsconfigService,
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      private modalService: BsModalService) { }

  firstname = new FormControl('', [Validators.nullValidator]);
  lastname = new FormControl('', [Validators.nullValidator]);
  role = new FormControl('', [Validators.nullValidator]);
  email = new FormControl({value: '', disabled: true}, [Validators.email]);

  ngOnInit() {

    this.userObj =  this.authService.currentUser;
    this.getMsconfigvalue('PRIMGS', 'FLSIZE', (error, result) => {
      if (error) { this.maxfilesize = 0;
      } else { this.maxfilesize = result[0].config_name; }
    });
    this.profileForm = this.fb.group({
      firstname: this.firstname,
      lastname: this.lastname,
      role: this.role,
      email: this.email
    });

    if (this.userObj.photopath && this.userObj.photopath !== '') {
      this.displayImg = this.userObj.photopath;
    } else {
      this.displayImg = 'assets/images/default_profile.jpg';
    }

    this.userService.getUser(this.userObj.userid).subscribe(data => {
      if (data.success === false) {
        if (data.errcode) {
          this.authService.logout();
          this.router.navigate(['/errorpage']);
        }
        this.toastr.error(data.message);
      } else {
        this.photoname = data.data.photoname;
        this.user = data.data;
        this.populateForm(this.user);
      }
    },
    err => {
      this.toastr.error(err);
    });

    this.route.queryParams.forEach((params: Params) => {
      this.qpage = params['page'] || '1';
      this.qsort = params['sortby'] || '';

      const payload: any = {};
      payload.page = this.qpage;
      payload.sortby = this.qsort;
      this.fetchReport(this.userObj.userid, payload);
    });
    const payload1: any = {};
    this.fetchReportContactno(this.userObj.userid, payload1);
  }

  populateForm(data): void {
    this.profileForm.patchValue({
      firstname: data.firstname,
      lastname: data.lastname,
      role: data.role,
      email: data.email
    });
  }

  getMsconfigvalue(code, group, cb) {

    this.msconfigService.getMsconfigvalue(code, group).subscribe(data => {
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

  updateUser(formdata: any): void {
    if (this.profileForm.dirty && this.profileForm.valid) {
      this.loading = true;
      this.userService.updateUser(this.userObj.userid, formdata)
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
            const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
            if (!formdata.firstname || formdata.firstname === '') {
              theUser.user.firstname = this.userObj.userid;
            } else {
              theUser.user.firstname = formdata.firstname;
            }
            localStorage.setItem('currentUser', JSON.stringify(theUser));
          }
        },
          err => {
            this.loading = false;
            this.toastr.error(err);
          });
    }
  }

  fileChangeEvent(fileInput: any): void {
    const files: Array<File> = <Array<File>>fileInput.target.files;

    // if (~files[0].type.indexOf('image/') ) { --> bitwise operation ~, isnot allowed
    if (files[0].type.indexOf('image/') >= 0) {
      if (files[0].size <= +this.maxfilesize) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        this.updateUserphoto();
      } else {
        const mfsize = +this.maxfilesize / 1000000 ;
        alert(`Error file size. File size is maximum ${mfsize} Mb`);
      }
    } else  {
      alert('Error file type. You must input image file type.');
    }
  }

  updateUserphoto(): void {
    this.loading = true;
    const files: Array<File> = this.filesToUpload;
    const lformData: FormData = new FormData();

    lformData.append('fileinputsrc', files[0], files[0]['name']);
    lformData.append('uploadpath', this.profileuploadpath);
    lformData.append('photoname', this.photoname);

    this.userService.changeUserphoto(this.userObj.userid, lformData)
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
        this.displayImg = data.newphotopath;
        const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
        theUser.user.photopath = data.newphotopath;
        this.photoname = data.newphotoname;
        localStorage.setItem('currentUser', JSON.stringify(theUser));
      }
    },
    err => {
      this.loading = false;
      this.toastr.error(err);
    });

  }

  fetchReport(userid, formval) {
    this.loading = true;
    this.userService.getUserAddressAgg(userid, formval)
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
        this.useraddress = data.data;
        this.totalrows = +data.totalcount;
        this.totalpage = data.npage;
        this.pgCounter = Math.floor((this.totalrows + 10 - 1) / 10);
      }
    },
    err => {
      this.loading = false;
      this.toastr.error(err);
    });
  }

  fetchReportContactno(userid, formval) {
    this.userService.getUserContactnoAgg(userid, formval)
    .subscribe(data => {
      if (data.success === false) {
        if (data.errcode) {
          this.authService.logout();
          this.router.navigate(['/errorpage']);
        }
        this.toastr.error(data.message);
      } else {
        this.usercontactno = data.data;
        this.totalrowscn = +data.totalcount;

      }
    },
    err => {
      this.toastr.error(err);
    });
  }

  setPage(page): void {
    this.router.navigate([`user`],
      {
        queryParams: {
          page: page,
          sortby: this.qsort }
      }
    );
  }

  prevPage(): void {
    const currpage = parseInt(this.qpage, 10) - 1;
    this.setPage(currpage);
  }

  nextPage(): void {
    const currpage = parseInt(this.qpage, 10) + 1;
    this.setPage(currpage);
  }

  createPager(number) {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  sortAddress(sortby): void {
    if (this.qsort === '') {
      this.qsort = sortby;
    } else if (this.qsort.indexOf('-') > -1 ) {
      this.qsort = sortby;
    } else {
      this.qsort = '-' + sortby;
    }
    this.setPage(this.qpage || '1');
  }

  onBack(): void {
    this.router.navigate(['/dashboard']);
  }

  refreshUserAddressTable(): void {
    const payload: any = {};
    payload.page = this.qpage;
    payload.sortby = this.qsort;
    this.fetchReport(this.userObj.userid, payload);
  }

  goToaddAddress(): void {
   if (this.totalrows < 5) {
      this.subscriptions.push(
        this.modalService.onHide.subscribe((reason: string) => {
          // This is to captured data from modal form
          // console.log(this.modalRef.content.result);
          // refresh table
          this.refreshUserAddressTable();
          this.unsubscribe();
        })
      );

      this.modalRef = this.modalService.show(AdduseraddressComponent, {
        class: 'modal-dialog-centered',
        keyboard: false,
        backdrop: 'static',
        initialState: {
          title: 'Add address',
          data: {}
        }
      });
    } else {
      this.toastr.error('The number of addresses must be maximum at 5.');
    }

  }

  goToeditAddress(id): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // refresh table
        this.refreshUserAddressTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(EdituseraddressComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        title: 'Edit address',
        addressid: id,
        data: {}
      }
    });
  }

  confirmDel(addressid, districtname): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // refresh table
        this.refreshUserAddressTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(DeleteuseraddressComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        addressid: addressid,
        districtname: districtname,
        data: {}
      }
    });
  }

  refreshContactnoTable(): void {
    const payload: any = {};
    payload.page = this.qpage;
    payload.sortby = this.qsort;
    this.fetchReportContactno(this.userObj.userid, payload);
  }

  goToaddContactno(): void {
    if (this.totalrowscn < 5) {
      this.subscriptions.push(
        this.modalService.onHide.subscribe((reason: string) => {
          // refresh table
          this.refreshContactnoTable();
          this.unsubscribe();
        })
      );

      this.modalRef = this.modalService.show(AddusercontactnoComponent, {
        class: 'modal-dialog-centered',
        keyboard: false,
        backdrop: 'static',
        initialState: {
          title: 'Add Contact No',
          data: {}
        }
      });
    } else {
      this.toastr.error('The number of contact number must be maximum at 5.');
    }

  }

  goToeditContactno(id): void {

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // refresh table
        this.refreshContactnoTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(EditusercontactnoComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        title: 'Edit Contact No',
        contactid: id,
        data: {}
      }
    });
  }

  confirmDelContact(id, type): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // refresh table
        this.refreshContactnoTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(DeleteusercontactnoComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        contactid: id,
        type: type,
        data: {}
      }
    });
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
}
