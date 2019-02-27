import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../../common/toastr.service';
import { ClientsService } from '../../../../../services/clients.service';
import { AuthService } from '../../../../../services/auth.service';
import { MsconfigService } from '../../../../../services/msconfig.service';

@Component({
  selector: 'app-addclient',
  templateUrl: './addclient.component.html',
  styleUrls: ['./addclient.component.css']
})
export class AddclientComponent implements OnInit {

  title;
  result;
  inputForm: FormGroup;
  userObj: any;
  loading = false;
  activecountries: any[];
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

  ngOnInit() {
    this.userObj =  this.authService.currentUser;
    this.getMsconfigactivecountries((error, result) => {
      if (error) {
        this.activecountries = [{config_code: '', config_name: error}];
        this.province = [{province_id: '', province_name: error}];
        this.city = [{city_id: '', city_name: error}];
        this.district = [{district_id: '', district_name: error}];
      } else {
        this.province = [];
        this.city = [];
        this.district = [];
        this.activecountries = result;
        const payload: any = {};
        payload.provincename = '';
        payload.cityname = '';
        payload.districtname = '';
        this.inputForm.get('countrycode').setValue(this.activecountries[0].config_code);
        this.getProvince(this.activecountries[0].config_code, payload, (errorp, resultp) => {
          if (errorp) {
            this.province = [{province_id: '', province_name: errorp}];
            this.city = [{city_id: '', city_name: errorp}];
            this.district = [{district_id: '', district_name: errorp}];
          } else {
            this.province = resultp;
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
    });

    this.inputForm = this.fb.group({
      clientname: this.clientname,
      clientemail: this.clientemail,
      contactnumber: this.contactnumber,
      address1: this.address1,
      address2: this.address2,
      districtid: this.districtid,
      cityid: this.cityid,
      provinceid: this.provinceid,
      countrycode: this.countrycode
    });
  }

  addClient(formdata: any): void {

    this.loading = true;
    this.clientsService.saveClient(this.userObj.userid, formdata)
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
