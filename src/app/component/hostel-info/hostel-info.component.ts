import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../common/common.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-hostel-info',
  templateUrl: './hostel-info.component.html',
  styleUrls: ['./hostel-info.component.css']
})
export class HostelInfoComponent implements OnInit {

  hostelForm: any;
  hostelData: any;
  modalAddUpdate = false;
  modalDelete = false;
  modalBackDrop = false;
  deleteId: any;
  lblAddModalTitle = '';

  constructor(private service: CommonService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.hostelForm = new FormGroup({
      name: new FormControl(
        null,
        Validators.required
      ),
      _id: new FormControl(
        null
      )
    });

    this.getHostel();
  }

  btnAddModal() {
    this.hostelForm.reset();
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Add';
  }

  btnCloseModal() {
    this.modalAddUpdate = false;
    this.modalBackDrop = false;
  }


  addUpdateHostel() {
    if (this.hostelForm.valid) {
      this.spinner.show();
      this.service.Post('hostel/addupdate', this.hostelForm.value).subscribe(
        (x: any) => {
          if (x.IsSuccess) {
            this.modalAddUpdate = false;
            this.modalBackDrop = false;
            this.getHostel();
          }
          else {
            console.log("error occured");
          }
        }
      );
    }
    else {

    }
  }

  getHostel(id = '') {
    this.spinner.show();
    var parameters = {
      'isActive': true
    }
    this.service.Post('hostel/get', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.hostelData = x.data;
          this.spinner.hide();
        }
        else {
          console.log("error occured");
        }
      }
    );
  }

  deleteHostel(item) {
    var parameters = {
      '_id': this.deleteId
    }
    this.spinner.show();
    this.service.Post('hostel/delete', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.modalDelete = false;
          this.modalBackDrop = false;
          this.getHostel();
        }
        else {
          console.log("error occured");
          this.spinner.hide();
        }
      }
    );
  }
  editHostel(item) {
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Update';
    this.hostelForm.setValue(
      {
        'name': item.name,
        '_id': item._id
      }
    )
  }
  deleteModal(item) {
    this.deleteId = item._id;
    this.modalDelete = true;
    this.modalBackDrop = true;
  }
  btnCloseDeleteModal() {
    this.modalDelete = false;
    this.modalBackDrop = false;
  }
}
