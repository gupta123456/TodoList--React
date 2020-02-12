import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../common/common.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {

  customerForm: any;
  modalAddUpdate = false;
  modalBackDrop = false;
  customerData: any;
  deleteId: any;
  modalDelete = false;
  hostelData: any;
  lblAddModalTitle = '';

  constructor(private service: CommonService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.customerForm = new FormGroup({
      hostelID: new FormControl(
        "0",
        Validators.required
      ),
      _id: new FormControl(
        null
      ),
      firstName: new FormControl(
        null,
        Validators.required
      ),
      lastName: new FormControl(
        null,
        Validators.required
      ),
      customerNo: new FormControl(
        null,
        Validators.required
      ),
      fatherName: new FormControl(
        null,
        Validators.required
      ),
      familyContactNo: new FormControl(
        null,
        Validators.required
      ),
      rentAmount: new FormControl(
        0,
        Validators.required
      ),
      securityAmount: new FormControl(
        null,
        Validators.required
      ),
      checkInDate: new FormControl(
        null,
        Validators.required
      ),
      checkOutDate: new FormControl(
        null
      )
    })

    this.getCustomer();
    this.getHostel();
  }

  btnAddModal() {
    this.customerForm.reset();
    this.customerForm.patchValue(
      {
        hostelId: "0"
      }
    )
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Add';
  }
  btnCloseModal() {
    this.modalAddUpdate = false;
    this.modalBackDrop = false;
  }
  addUpdateHostel() {
    if (this.customerForm.valid) {
      var parameters = {};
      if (this.customerForm.value._id) {
        parameters = {
          '_id': this.customerForm.value._id,
          'hostelID': this.customerForm.value.hostelID,
          'firstName': this.customerForm.value.firstName,
          'lastName': this.customerForm.value.lastName,
          'customerNo': this.customerForm.value.customerNo,
          'fatherName': this.customerForm.value.fatherName,
          'familyContactNo': this.customerForm.value.familyContactNo,
          'rentAmount': this.customerForm.value.rentAmount,
          'securityAmount': this.customerForm.value.securityAmount,
          'modifiedDate': new Date(),
          'checkInDate': this.customerForm.value.checkInDate,
          'checkOutDate': this.customerForm.value.checkOutDate,
          'isActive': true
        }
      }
      else {
        parameters = {
          'hostelID': this.customerForm.value.hostelID,
          'firstName': this.customerForm.value.firstName,
          'lastName': this.customerForm.value.lastName,
          'customerNo': this.customerForm.value.customerNo,
          'fatherName': this.customerForm.value.fatherName,
          'familyContactNo': this.customerForm.value.familyContactNo,
          'rentAmount': this.customerForm.value.rentAmount,
          'securityAmount': this.customerForm.value.securityAmount,
          'createdDate': new Date(),
          'checkInDate': this.customerForm.value.checkInDate,
          'checkOutDate': this.customerForm.value.checkOutDate,
          'isActive': true
        }
      }
      this.spinner.show();
      this.service.Post('customer/addupdate', parameters).subscribe(
        (x: any) => {
          if (x.IsSuccess) {
            this.modalAddUpdate = false;
            this.modalBackDrop = false;
            this.getCustomer();
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
  getCustomer(id = '') {
    this.spinner.show();
    var parameters = {
      'isActive': true
    }
    this.service.Post('customer/get', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.customerData = x.data;
          this.spinner.hide();
        }
        else {
          console.log("error occured");
        }
      }
    );
  }
  editCustomer(item) {
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Update';
    debugger
    this.customerForm.setValue(
      {
        '_id': item._id,
        'hostelID': item.hostelID,
        'firstName': item.firstName,
        'lastName': item.lastName,
        'customerNo': item.customerNo,
        'fatherName': item.fatherName,
        'familyContactNo': item.familyContactNo,
        'rentAmount': item.rentAmount,
        'securityAmount': item.securityAmount,
        'checkInDate': item.checkInDate,
        'checkOutDate': item.checkOutDate
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

  confirmDelete(item) {
    var parameters = {
      '_id': this.deleteId
    }
    this.spinner.show();
    this.service.Post('customer/delete', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.modalDelete = false;
          this.modalBackDrop = false;
          this.getCustomer();
        }
        else {
          console.log("error occured");
          this.spinner.hide();
        }
      }
    );
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
}
