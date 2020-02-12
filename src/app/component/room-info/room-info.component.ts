import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.css']
})
export class RoomInfoComponent implements OnInit {

  form: any;
  hostelData: any;
  modalAddUpdate = false;
  modalDelete = false;
  modalBackDrop = false;
  deleteId: any;
  lblAddModalTitle = '';

  constructor(private service: CommonService, private spinner: NgxSpinnerService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      _id:[null],
      hostelID: [null, Validators.required],
      name: [null, Validators.required]
    })
  }
  btnAddModal() {
    this.form.reset();
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Add';
  }
}
