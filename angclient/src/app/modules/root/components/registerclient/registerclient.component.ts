import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { GeneralConfirmationComponent } from '../../../shared/components/general-confirmation/general-confirmation.component';

@Component({
  selector: 'app-registerclient',
  templateUrl: './registerclient.component.html',
  styleUrls: ['./registerclient.component.css']
})
export class RegisterclientComponent implements OnInit {

  inputForm: FormGroup;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  userid = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  firstname = new FormControl('', [Validators.nullValidator]);
  lastname = new FormControl('', [Validators.nullValidator]);
  role = new FormControl('', [Validators.nullValidator]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,20}$')]);
  retypepass = new FormControl('', [Validators.required]);

  ngOnInit() {

    this.inputForm = this.fb.group({
      userid: this.userid,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      role: this.role,
      passwordGroup: this.fb.group({
        password: this.password,
        retypepass: this.retypepass,
      }, {validator: comparePassword})
    });

  }

  addUserclient(formdata: any): void {

    if (this.inputForm.dirty && this.inputForm.valid) {
      const theForm = formdata;
      const thePass = formdata.passwordGroup.password;
      theForm.password = thePass;
      delete theForm.passwordGroup;
      this.loading = true;
      this.userService.registerClient(theForm)
      .subscribe(data => {
        if (data.success === false) {
          this.loading = false;
          this.toastr.error(data.message);

        } else {
          const emailto = data.data.email;
          this.loading = false;

          this.subscriptions.push(
            this.modalService.onHide.subscribe((reason: string) => {
              // reset form
              this.inputForm.reset();
              this.unsubscribe();
            })
          );

          this.modalRef = this.modalService.show(GeneralConfirmationComponent, {
            class: 'modal-dialog-centered',
            keyboard: false,
            backdrop: 'static',
            initialState: {
              title: 'User Registration success',
              data: { message: 'An email has been sent to your email address ' + emailto + '. Please confirm your registration.'}
            }
          });

        }

      },
      err => {
        this.loading = false;
        this.toastr.error(err);
      });
    }

  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onLogin(): void {
    this.router.navigate(['/login']);
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
