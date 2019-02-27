import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from '../../../common/toastr.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit, OnDestroy {

  navigationSubscription;

  constructor(private authService: AuthService,
              private router: Router,
              private toastr: ToastrService) {

      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });

    }

  ngOnInit() {
    this.authService.logout();
    this.toastr.success('You have been logged out.');
    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
