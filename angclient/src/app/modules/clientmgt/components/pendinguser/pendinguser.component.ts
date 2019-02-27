import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { PendingusercliService } from '../../../../services/pendingusercli.service';
import { AuthService } from '../../../../services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { ApproveComponent } from './approve/approve.component';
import { RejectComponent } from './reject/reject.component';

@Component({
  selector: 'app-pendinguser',
  templateUrl: './pendinguser.component.html',
  styleUrls: ['./pendinguser.component.css']
})
export class PendinguserComponent implements OnInit {

  totalpage: number;
  qpage: string;
  qsearchinput: string;
  qsort: string;
  pgCounter: number;
  totalrows: number;
  users: any;
  searchForm: FormGroup;
  userObj: any;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private pendingUsercliService: PendingusercliService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) { }
  searchinput = new FormControl('', [Validators.nullValidator]);

  ngOnInit() {

    this.userObj =  this.authService.currentUser;
    this.searchForm = this.fb.group({
      searchinput: this.searchinput,
    });

    this.route.queryParams.forEach((params: Params) => {
      this.qsearchinput = params['searchinput'] || '';
      this.qpage = params['page'] || '1';
      this.qsort = params['sortby'] || '';

      this.refreshTable();
    });

  }

  getReport(formdata: any): void {
    if (this.searchForm.valid) {

        this.router.navigate(['/clientmgt/pendingusercli'],
        {
          queryParams: {
            searchinput: formdata.searchinput,
            page: 1,
            sortby: null }
        }
      );
    }
  }

  fetchReport(formval) {
    this.loading = true;
    this.pendingUsercliService.getPendingusercliAggList(formval)
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
        this.users = data.data;
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

  setPage(page): void {

    this.router.navigate(['/clientmgt/pendingusercli'],
      {
        queryParams: {
          searchinput: this.qsearchinput,
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

  sortUsers(sortby): void {
    if (this.qsort === '') {
      this.qsort = sortby;
    } else if (this.qsort.indexOf('-') > -1 ) {
      this.qsort = sortby;
    } else {
      this.qsort = '-' + sortby;
    }

    this.setPage(this.qpage || '1');
  }

  goToedit(id): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // This is to captured data from modal form
        // console.log(this.modalRef.content.result);
        // refresh table
        this.refreshTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(ApproveComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        title: 'Assign Client',
        userid: id,
        data: {}
      }
    });
  }

  confirmReject(id, name): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // refresh table
        this.refreshTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(RejectComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        userid: id,
        firstname: name,
        data: {}
      }
    });
  }

  refreshTable(): void {
    const payload: any = {};
    payload.searchinput = this.qsearchinput;
    payload.page = this.qpage;
    payload.sortby = this.qsort;
    this.fetchReport(payload);
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
}
