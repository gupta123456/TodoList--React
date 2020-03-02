import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from '../../common/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.css']
})
export class RoomInfoComponent implements OnInit {

  form: any;
  roomData: any;
  modalAddUpdate = false;
  modalDelete = false;
  modalBackDrop = false;
  deleteId: any;
  lblAddModalTitle = '';
  hostelData: any;
  hostelID = '0';
  isSubmit = false;
  userInfo: any;
  constructor(private service: CommonService, private spinner: NgxSpinnerService, private fb: FormBuilder
    , private toastr: ToastrService) { }

  ngOnInit() {
    var user = sessionStorage.getItem('user');
    this.userInfo = JSON.parse(user);
    this.form = this.fb.group({
      _id: [null],
      hostelID: ['0', Validators.required],
      name: [null, Validators.required]
    })
    this.getHostel();
  }

  btnAddModal() {
    this.form.reset();
    this.form.patchValue({
      hostelID: this.hostelID
    })
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Add';
  }
  getRoom(hostelID) {
    if (hostelID != '0') {
      this.spinner.show();
      this.hostelID = hostelID;
      var parameters = {
        'isActive': true,
        'hostelID': hostelID
      }
      this.service.Post('room/get', parameters).subscribe(
        (x: any) => {
          if (x.IsSuccess) {
            this.roomData = x.data;
            this.spinner.hide();
          }
          else {
            console.log("error occured");
          }
        }
      );
    }
  }
  getHostel() {
    this.spinner.show();
    var parameters = {
      'isActive': true,
      'userID': this.userInfo._id
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
  btnCloseModal() {
    this.modalAddUpdate = false;
    this.modalBackDrop = false;
    this.getRoom(this.hostelID);
  }
  addUpdateRoom() {
    this.isSubmit = true;
    if (this.form.valid) {
      this.spinner.show();
      this.service.Post('room/addUpdate', this.form.value).subscribe(
        (x: any) => {
          this.spinner.hide();
          this.isSubmit = false;
          if (x.IsSuccess) {
            if (this.form.value._id)
              this.toastr.success('Updated successfully!', 'Room');
            else {
              this.toastr.success('Added successfully!', 'Room');
              this.form.patchValue({
                name: null
              })
            }
          }
          else {
            console.log("error occured");
          }
        }
      );
    }
    else {
      this.toastr.error('Please fill mandatory fields!', 'Room');
    }
  }
  editModel(item) {
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Update';
    this.form.setValue(
      {
        'hostelID': item.hostelID,
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
  deleteRoom() {
    var parameters = {
      '_id': this.deleteId
    }
    this.spinner.show();
    this.service.Post('room/delete', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.modalDelete = false;
          this.modalBackDrop = false;
          this.toastr.success('Deleted successfully!', 'Room');
          this.getRoom(this.hostelID);
        }
        else {
          console.log("error occured");
          this.spinner.hide();
        }
      }
    );
  }
}
