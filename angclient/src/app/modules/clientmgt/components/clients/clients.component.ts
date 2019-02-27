import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { ClientsService } from '../../../../services/clients.service';
import { AuthService } from '../../../../services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { MsconfigService } from '../../../../services/msconfig.service';
import { AddclientComponent } from './addclient/addclient.component';
import { EditclientComponent } from './editclient/editclient.component';
import { DeleteclientComponent } from './deleteclient/deleteclient.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  totalpage: number;
  qpage: string;
  qsearchinput: string;
  qstatus: string;
  qsort: string;
  pgCounter: number;
  totalrows: number;
  clients: any;
  searchForm: FormGroup;
  userObj: any;
  loading = false;
  modalRef: BsModalRef;
  sts: any[];
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private clientsService: ClientsService,
    private msconfigService: MsconfigService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) { }

  searchinput = new FormControl('', [Validators.nullValidator]);
  status = new FormControl('', [Validators.nullValidator]);

  ngOnInit() {

    this.userObj =  this.authService.currentUser;
    this.searchForm = this.fb.group({
      searchinput: this.searchinput,
      status: this.status
    });

    this.route.queryParams.forEach((params: Params) => {
      this.qsearchinput = params['searchinput'] || '';
      this.qstatus = params['status'] || '';
      this.qpage = params['page'] || '1';
      this.qsort = params['sortby'] || '';

      this.getMsconfigbygroup('STSENT', (error, result) => {
        if (error) { this.sts = [{config_code: '', config_name: error}];
        } else { this.sts = result; }
      });

      this.refreshTable();

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

  getReport(formdata: any): void {
    if (this.searchForm.valid) {
        this.router.navigate(['/clientmgt/clients'],
        {
          queryParams: {
            searchinput: formdata.searchinput,
            status: formdata.status,
            page: 1,
            sortby: null }
        }
      );
    }
  }

  fetchReport(formval) {
    this.loading = true;
    this.clientsService.getClientAggList(formval)
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
        this.clients = data.data;
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

    this.router.navigate(['/clientmgt/clients'],
      {
        queryParams: {
          searchinput: this.qsearchinput,
          status: this.qstatus,
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

  sortClients(sortby): void {
    if (this.qsort === '') {
      this.qsort = sortby;
    } else if (this.qsort.indexOf('-') > -1 ) {
      this.qsort = sortby;
    } else {
      this.qsort = '-' + sortby;
    }

    this.setPage(this.qpage || '1');
  }

  goToAdd(): void {

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // This is to captured data from modal form
        // console.log(this.modalRef.content.result);
        // refresh table
        this.refreshTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(AddclientComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        title: 'Add client',
        data: {}
      }
    });

  }

  goToedit(id): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // refresh table
        this.refreshTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(EditclientComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        title: 'Edit client',
        clientid: id,
        data: {}
      }
    });
  }

  confirmDel(id, name): void {
    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        // refresh table
        this.refreshTable();
        this.unsubscribe();
      })
    );

    this.modalRef = this.modalService.show(DeleteclientComponent, {
      class: 'modal-dialog-centered',
      keyboard: false,
      backdrop: 'static',
      initialState: {
        clientid: id,
        clientname: name,
        data: {}
      }
    });
  }

  refreshTable(): void {
    const payload: any = {};
    payload.status = this.qstatus;
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
