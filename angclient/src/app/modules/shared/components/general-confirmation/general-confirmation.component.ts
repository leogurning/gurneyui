import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-general-confirmation',
  templateUrl: './general-confirmation.component.html',
  styleUrls: ['./general-confirmation.component.css']
})
export class GeneralConfirmationComponent implements OnInit {
  title;
  data;
  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }

}
