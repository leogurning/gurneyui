import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  navigationSubscription;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) {

      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });

  }

  userid = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  loginForm: FormGroup = this.fb.group({
    userid: this.userid,
    password: this.password,
  });

  ngOnInit() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  loginUser(formdata: any): void {
    this.authService.logout();
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.loading = true;
      this.authService.login(formdata)
        .subscribe(data => {
          if (data.json().success === false) {
            this.loading = false;
            this.toastr.error(data.json().message);
          } else {
            this.loading = false;
            this.toastr.success('Login successful.');
            this.router.navigate(['dashboard']);
          }
          this.loginForm.reset();
        },
      err => {
        this.loading = false;
        this.toastr.error(err);
      });
    }
  }

}
