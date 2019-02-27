import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../../common/toastr.service';
import { ClientsService } from '../../../../../services/clients.service';
import { AuthService } from '../../../../../services/auth.service';
import { MsconfigService } from '../../../../../services/msconfig.service';

@Component({
  selector: 'app-editclient',
  templateUrl: './editclient.component.html',
  styleUrls: ['./editclient.component.css']
})
export class EditclientComponent implements OnInit {
  title;
  result;
  clientid;
  client: any;
  inputForm: FormGroup;
  userObj: any;
  loading = false;
  activecountries: any[];
  sts: any[];
  province: any[];
  city: any[];
  district: any[];
  @ViewChild('inputcountryRef') inputcountryElementRef: ElementRef;
  @ViewChild('inputprovinceRef') inputprovinceElementRef: ElementRef;
  @ViewChild('inputcityRef') inputcityElementRef: ElementRef;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private clientsService: ClientsService,
    private msconfigService: MsconfigService,
    private router: Router,
    private toastr: ToastrService,
    public modalRef: BsModalRef) { }

  clientname = new FormControl('', [Validators.required]);
  clientemail = new FormControl('', [Validators.required, Validators.email]);
  contactnumber = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  address1 = new FormControl('', [Validators.required]);
  address2 = new FormControl('', [Validators.nullValidator]);
  districtid = new FormControl('', [Validators.required]);
  cityid = new FormControl('', [Validators.required]);
  provinceid = new FormControl('', [Validators.required]);
  countrycode = new FormControl('', [Validators.required]);
  status = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.userObj =  this.authService.currentUser;
    this.getMsconfigactivecountries((error, result) => {
      if (error) { this.activecountries = [{config_code: '', config_name: error}];
      } else { this.activecountries = result; }
    });

    this.getMsconfigbygroup('STSENT', (error, result) => {
      if (error) { this.sts = [{config_code: '', config_name: error}];
      } else { this.sts = result; }
    });

    this.getClient(this.clientid);

    this.inputForm = this.fb.group({
      clientname: this.clientname,
      clientemail: this.clientemail,
      contactnumber: this.contactnumber,
      address1: this.address1,
      address2: this.address2,
      districtid: this.districtid,
      cityid: this.cityid,
      provinceid: this.provinceid,
      countrycode: this.countrycode,
      status: this.status
    });
  }

  getClient(id) {
    this.loading = true;
    this.clientsService.getClient(id).subscribe(data => {
      if (data.success === true) {
        if (data.data) {
          this.client = data.data;
          const payload: any = {};
          payload.provincename = '';
          this.getProvince(this.client.country_code, payload, (error, result) => {
            if (error) { this.province = [{province_id: '', province_name: error}];
            } else { this.province = result; }
          });

          const payload1: any = {};
          payload1.cityname = '';
          this.getCity(this.client.province_id, payload1, (error, result) => {
            if (error) { this.city = [{city_id: '', city_name: error}];
            } else { this.city = result; }
          });

          const payload2: any = {};
          payload2.districtname = '';
          this.getDistrict(this.client.city_id, payload2, (error, result) => {
            if (error) { this.district = [{district_id: '', district_name: error}];
            } else { this.district = result; }
          });
          this.populateForm(data.data);
        } else {
          this.toastr.error('Client id is incorrect in the URL');
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
      clientname: data.client_name,
      clientemail: data.client_email,
      contactnumber: data.contact_number,
      address1: data.address_line_1,
      address2: data.address_line_2,
      districtid: data.district_id,
      cityid: data.city_id,
      provinceid: data.province_id,
      countrycode: data.country_code,
      status: data.client_status
    });
  }

  updateClient(formdata: any): void {
    this.loading = true;
    formdata.clientid = this.clientid;

    this.clientsService.updateClient(this.userObj.userid, formdata)
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

  getProvince(country, payload, cb) {
    this.msconfigService.getActiveprovince(country, payload).subscribe(data => {
      if (data.success === true) {
        if (data.data[0]) {
          cb(null, data.data);
        } else {
          cb('No province found', null);
        }
      } else {
        cb(data.message, null);
      }
    },
    err => {
      cb('Error get province list', null);
    });
  }

  getCity(prov, payload, cb) {
    this.msconfigService.getActivecity(prov, payload).subscribe(data => {
      if (data.success === true) {
        if (data.data[0]) {
          cb(null, data.data);
        } else {
          cb('No city found', null);
        }
      } else {
        cb(data.message, null);
      }
    },
    err => {
      cb('Error get city list', null);
    });
  }

  getDistrict(city, payload, cb) {
    this.msconfigService.getActivedistrict(city, payload).subscribe(data => {
      if (data.success === true) {
        if (data.data[0]) {
          cb(null, data.data);
        } else {
          cb('No district found', null);
        }
      } else {
        cb(data.message, null);
      }
    },
    err => {
      cb('Error get district list', null);
    });
  }

  getMsconfigactivecountries(cb) {
    this.msconfigService.getMsconfigactivecountries().subscribe(data => {
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

  countryChangeEvent(): void {
    // let idx = this.inputcountryElementRef.nativeElement.selectedIndex;
    // let countrySelected = this.inputcountryElementRef.nativeElement.options.item(idx);
    const countrySelected = this.inputcountryElementRef.nativeElement.value;
    // result is 1: <valueid>. Therefore need split
    const res = countrySelected.split(' ');
    this.province = [];
    this.city = [];
    this.district = [];
    const payload: any = {};
    payload.provincename = '';
    payload.cityname = '';
    payload.districtname = '';
    this.inputForm.get('provinceid').reset( );
    this.getProvince(res[1], payload, (error, result) => {
      if (error) {
        this.province = [{province_id: '', province_name: error}];
        this.city = [{city_id: '', city_name: error}];
        this.district = [{district_id: '', district_name: error}];
      } else {
        this.province = result;
        this.inputForm.get('provinceid').setValue(this.province[0].province_id);
        this.getCity(this.province[0].province_id, payload, (errorc, resultc) => {
          if (errorc) {
            this.city = [{city_id: '', city_name: errorc}];
            this.district = [{district_id: '', district_name: errorc}];
          } else {
            this.city = resultc;
            this.inputForm.get('cityid').setValue(this.city[0].city_id);
            this.getDistrict(this.city[0].city_id, payload, (errord, resultd) => {
              if (errord) {
                this.district = [{district_id: '', district_name: errord}];
              } else {
                this.district = resultd;
                this.inputForm.get('districtid').setValue(this.district[0].district_id);
              }
            });
          }
        });
      }
    });

  }

  provinceChangeEvent(): void {

    const provinceSelected = this.inputprovinceElementRef.nativeElement.value;
    // result is 1: <valueid>. Therefore need split
    const res = provinceSelected.split(' ');
    this.city = [];
    this.district = [];
    const payload: any = {};
    payload.cityname = '';
    payload.districtname = '';
    this.inputForm.get('cityid').reset( );
    this.getCity(res[1], payload, (error, result) => {
      if (error) {
        this.city = [{city_id: '', city_name: error}];
        this.district = [{district_id: '', district_name: error}];
      } else {
        this.city = result;
        this.inputForm.get('cityid').setValue(this.city[0].city_id);
        this.getDistrict(this.city[0].city_id, payload, (errord, resultd) => {
          if (errord) {
            this.district = [{district_id: '', district_name: errord}];
          } else {
            this.district = resultd;
            this.inputForm.get('districtid').setValue(this.district[0].district_id);
          }
        });
      }
    });

  }

  cityChangeEvent(): void {

    const citySelected = this.inputcityElementRef.nativeElement.value;
    // result is 1: <valueid>. Therefore need split
    const res = citySelected.split(' ');
    this.district = [];
    const payload: any = {};
    payload.districtname = '';
    this.inputForm.get('districtid').reset( );
    this.getDistrict(res[1], payload, (error, result) => {
      if (error) {
        this.district = [{district_id: '', district_name: error}];
      } else {
        this.district = result;
        this.inputForm.get('districtid').setValue(this.district[0].district_id);
      }
    });
  }
}
