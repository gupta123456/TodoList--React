import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../common/common.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  roomData: any;
  hostelID = '0';
  roomID = '0';
  isSubmit = false;
  constructor(private service: CommonService, private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document, private toastr: ToastrService) { }

  ngOnInit() {
    this.customerForm = new FormGroup({
      hostelID: new FormControl(
        "0",
        Validators.required
      ),
      roomID: new FormControl('0', Validators.required),
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

    //this.getCustomer();
    this.getHostel();
  }
  btnAddModal() {
    this.document.body.classList.add('modal-open');
    this.customerForm.reset();
    this.customerForm.patchValue(
      {
        hostelID: this.hostelID,
        roomID: this.roomID
      }
    )
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Add';
  }
  btnCloseModal() {
    if (this.roomID != '0')
      this.getCustomer(this.roomID);
    this.modalAddUpdate = false;
    this.modalBackDrop = false;
    this.document.body.classList.remove('modal-open');
  }
  addUpdateHostel() {
    this.isSubmit = true;
    if (this.customerForm.valid) {
      this.spinner.show();
      this.service.Post('customer/addupdate', this.customerForm.value).subscribe(
        (x: any) => {
          this.spinner.hide();
          this.isSubmit = false;
          if (x.IsSuccess) {
            if (this.customerForm.value._id)
              this.toastr.success('Updated successfully!', 'Customer');
            else {
              this.toastr.success('Added successfully!', 'Customer');
              this.customerForm.reset();
              this.customerForm.patchValue({
                hostelID: this.hostelID,
                roomID: this.roomID
              })
            }
            // this.modalAddUpdate = false;
            // this.modalBackDrop = false;
            // this.getCustomer(this.roomID);
          }
          else {
            console.log("error occured");
          }
        }
      );
    }
    else {
      this.toastr.error('Please fill mandatory fields!', 'Customer');
    }
  }
  getCustomer(roomID) {
    this.spinner.show();
    var parameters = {
      'isActive': true,
      'roomID': roomID
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
    this.customerForm.patchValue(
      {
        '_id': item._id,
        'hostelID': item.hostelID,
        'roomID': item.roomID,
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
          this.getCustomer(this.roomID);
          this.toastr.success('Deleted successfully!', 'Customer');
        }
        else {
          console.log("error occured");
          this.spinner.hide();
        }
      }
    );
  }
  getHostel() {
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
  getRoom(hostelID) {
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
          this.roomID = '0';
          this.spinner.hide();
        }
        else {
          console.log("error occured");
        }
      }
    );
  }
}
