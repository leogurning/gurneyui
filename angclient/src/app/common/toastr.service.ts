import { Injectable } from '@angular/core';
declare let toastr: any;

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor() {
    toastr.options = {
      // timeOut : 0,
      // extendedTimeOut : 100,
      // tapToDismiss : true,
      // debug : false,
      // fadeOut: 10,
      positionClass : 'toast-top-right',
      };
  }
  success(message: string, title?: string) {
    toastr.success(title, message);
  }
  info(message: string, title?: string) {
    toastr.info(title, message);
  }
  warning(message: string, title?: string) {
    toastr.warning(title, message);
  }
  error(message: string, title?: string) {
    toastr.error(title, message);

  }
}
