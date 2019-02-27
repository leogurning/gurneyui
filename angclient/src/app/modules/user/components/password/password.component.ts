import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit, AfterViewInit {
  inputForm: FormGroup;
  userObj: any;
  loading = false;
  @ViewChild('inputoldpasswordRef') inputoldpasswordRef: ElementRef;
  constructor(private fb: FormBuilder,
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService ) { }

  oldpassword = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,20}$')]);
  retypepass = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.userObj =  this.authService.currentUser;
    this.inputForm = this.fb.group({
      oldpassword: this.oldpassword,
      passwordGroup: this.fb.group({
        password: this.password,
        retypepass: this.retypepass,
      }, {validator: comparePassword})
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputoldpasswordRef.nativeElement.focus();
    }, 600);
  }

  updatePassword(formdata: any): void {
    if (this.inputForm.dirty && this.inputForm.valid) {
      const theForm = formdata;
      const thePass = theForm.passwordGroup.password;
      theForm.password = thePass;
      delete theForm.passwordGroup;
      this.loading = true;
      this.userService.updatePassword(this.userObj.userid, theForm)
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
          this.inputForm.reset();
      },
      err => {
        this.loading = false;
        this.toastr.error(err);
      });
    }
  }
  onBack(): void {
    this.router.navigate(['/dashboard']);
  }

}

function comparePassword(c: AbstractControl): {[key: string]: boolean} | null {
  const passwordControl = c.get('password');
  const confirmControl = c.get('retypepass');

  if (passwordControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (passwordControl.value === confirmControl.value) {
      return null;
  }
  return { 'mismatchedPassword': true };
}
