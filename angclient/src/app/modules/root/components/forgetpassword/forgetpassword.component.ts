import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { GeneralConfirmationComponent } from '../../../shared/components/general-confirmation/general-confirmation.component';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  inputForm: FormGroup;
  loading = false;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

  emailto = new FormControl('', [Validators.email, Validators.required]);

  ngOnInit() {

    this.inputForm = this.fb.group({
      emailto: this.emailto
    });

  }

  sendEmail(formdata: any): void {

    if (this.inputForm.dirty && this.inputForm.valid) {
      this.loading = true;
      this.userService.sendResetPassword(formdata)
      .subscribe(data => {
        if (data.success === false) {
          this.loading = false;
          this.toastr.error(data.message);

        } else {
          const pemailto = data.data.email;
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
              title: 'Reset Password request success',
              data: { message: 'An email has been sent to your email address ' + pemailto + '. Please perform your Password reset.'}
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
