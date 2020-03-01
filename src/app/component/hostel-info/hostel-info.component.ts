import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../common/common.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

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
  isSubmit = false;
  userInfo: any;

  constructor(private service: CommonService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private cookieService: CookieService) { }

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
    var user = sessionStorage.getItem('user');
    this.userInfo = JSON.parse(user);

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
    this.getHostel();
  }


  addUpdateHostel() {
    this.isSubmit = true;
    if (this.hostelForm.valid) {
      this.spinner.show();
      this.service.Post('hostel/addupdate', this.hostelForm.value).subscribe(
        (x: any) => {
          this.spinner.hide();
          this.isSubmit = false;
          if (x.IsSuccess) {
            if (this.hostelForm.value._id)
              this.toastr.success('Updated successfully!', 'Hostel');
            else {
              this.toastr.success('Added successfully!', 'Hostel');
              this.hostelForm.reset();
            }
          }
          else {
            console.log("error occured");
          }
        }
      );
    }
    else {
      this.toastr.error('Please fill mandatory fields!', 'Hostel');
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
          this.toastr.success('Deleted successfully!', 'Hostel');
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
