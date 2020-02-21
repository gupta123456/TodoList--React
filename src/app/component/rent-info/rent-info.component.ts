import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'app-rent-info',
  templateUrl: './rent-info.component.html',
  styleUrls: ['./rent-info.component.css']
})
export class RentInfoComponent implements OnInit {

  lblAddModalTitle = '';
  modalBackDrop = false;
  modalAddUpdate = false;
  rentForm: any;
  hostelData: any;
  customerData = [];
  customerBillForm: FormGroup;
  month: any;
  year: any;
  generateBillModal = false;
  payBillModal = false;
  customerName = '';
  rentAmount = 0;
  previousDue = 0;
  finalBillModal = false;
  electricityBill = 0;
  waterBill = 0;
  totalPayAmount = 0;
  roomData: any;
  payBill: any;
  customerID: any;
  billYear = 0;
  billMonth = 0;
  constructor(private service: CommonService, private spinner: NgxSpinnerService, private fb: FormBuilder) { }

  ngOnInit() {
    this.rentForm = new FormGroup({
      hostelID: new FormControl(
        '0',
        Validators.required
      ),
      customerID: new FormControl(
        '0',
        Validators.required
      ),
      billMonth: new FormControl(
        null,
        Validators.required
      ),
      billYear: new FormControl(
        null,
        Validators.required
      ),
      electricityBill: new FormControl(
        null
      ),
      waterBill: new FormControl(
        null
      )
    })
    this.customerBillForm = this.fb.group({
      customerID: [null, Validators.required],
      billMonth: [{ value: 0, disabled: true }, Validators.required],
      billYear: [{ value: 0, disabled: true }, Validators.required],
      electricityBill: [0],
      waterBill: [0],
      dueAmount: [0]
    })
    this.payBill = this.fb.group({
      billMonth: [{ value: 0, disabled: true }, Validators.required],
      billYear: [{ value: 0, disabled: true }, Validators.required],
      paidAmount: [0]
    })
    this.getHostel('');
    this.getMonth();
    this.getYear();
  }
  btnAddModal() {
    this.rentForm.reset();
    this.modalAddUpdate = true;
    this.modalBackDrop = true;
    this.lblAddModalTitle = 'Add';
  }
  openBillModal(customer) {
    this.customerName = customer.firstName + ' ' + customer.lastName;
    this.customerBillForm.patchValue({
      customerID: customer._id,
      billMonth: this.billMonth,
      billYear: this.billYear
    });
    this.rentAmount = customer.rentAmount;
    this.getDueAmount();
    this.generateBillModal = true;
    this.modalBackDrop = true;
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

  getCustomer(roomID) {
    this.spinner.show();
    var parameters = {
      'roomID': roomID,
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
  btnCloseModal() {
    this.generateBillModal = false;
    this.modalBackDrop = false;
  }
  getMonth() {
    this.month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
  getYear() {
    this.year = [2019, 2020, 2021, 2022]
  }
  generateBill() {
    this.spinner.show();
    var parameters = this.customerBillForm.value;
    this.service.Post('rent/addUpdate', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.spinner.hide();
          this.electricityBill = this.customerBillForm.value.electricityBill;
          this.waterBill = this.customerBillForm.value.waterBill;
          this.totalPayAmount = this.rentAmount + this.electricityBill + this.waterBill + this.previousDue;
          this.generateBillModal = false;
          this.finalBillModal = true;
        }
        else {
          console.log("error occured");
        }
      }
    );
  }
  getDueAmount() {
    var billMonth = this.billMonth;
    var billYear = this.billYear;
    if (billMonth != 0 && billYear != 0) {
      billYear = (billMonth == 1) ? billYear - 1 : billYear;
      billMonth = (billMonth == 1) ? 12 : billMonth;
      var parameters = {
        billMonth: billMonth,
        billYear: billYear
      }
      this.spinner.show();
      this.service.Post('rent/getAmount', parameters).subscribe(
        (x: any) => {
          if (x.IsSuccess) {
            this.previousDue = x.data[0].dueAmount == undefined ? 0 : x.data[0].dueAmount;
            this.spinner.hide();
            this.spinner.hide();
          }
          else {
            console.log("error occured");
          }
        }
      );
    }
  }
  btnClosefinalBillModal() {
    this.finalBillModal = false;
    this.modalBackDrop = false;
  }

  PayModal(item) {
    this.payBill.patchValue({
      billYear: this.billYear,
      billMonth: this.billMonth
    });
    console.log(item);
    this.customerName = item.firstName + ' ' + item.lastName;
    this.customerID = item._id;
    this.spinner.show();
    var parameters = {
      customerID: item._id,
      billYear: this.billYear,
      billMonth: this.billMonth
    }
    this.service.Post('rent/getAmount', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.totalPayAmount = x.data[0].paidAmount + x.data[0].electricityBill + x.data[0].waterBill;
          this.payBillModal = true;
          this.modalBackDrop = true;
          this.spinner.hide();
        }
        else {
          console.log("error occured");
          this.spinner.hide();
        }
      }
    );
  }
  btnClosePayBillModal() {
    this.payBillModal = false;
    this.modalBackDrop = false;
  }
  getRoom(hostelID) {
    this.spinner.show();
    //this.hostelID = hostelID;
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
  billPayment() {
    this.payBill.value.customerID = this.customerID;
    this.spinner.show();
    this.service.Post('rent/payRent', this.payBill.value).subscribe(
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
