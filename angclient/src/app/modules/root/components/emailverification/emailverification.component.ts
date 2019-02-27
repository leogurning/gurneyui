import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from '../../../../common/toastr.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.css']
})
export class EmailverificationComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  loading = true;

  username: string;
  firstname: string;
  email: string;
  lastname: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService ) { }

  ngOnInit() {
    this.loading = true;
    this.sub = this.route.queryParams.subscribe(
      params => {
        const hash = params['id'];
        this.userService.recvemailverification(hash)
        .subscribe(data => {
          if (data.success === false) {
            this.loading = false;
            this.router.navigate(['/errorpage']);
            this.toastr.error(data.message);
          } else {
            this.loading = false;
            this.username = data.data[0].user_id;
            this.firstname = data.data[0].first_name;
            this.lastname = data.data[0].last_name;
            this.email = data.data[0].email;
          }
        },
        err => {
          this.loading = false;
          this.router.navigate(['/errorpage']);
          this.toastr.error(err);
        });
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
