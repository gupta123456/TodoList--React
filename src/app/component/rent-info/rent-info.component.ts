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
  customerName = '';
  rentAmount = 0;
  previousDue = 0;
  finalBillModal = false;
  electricityBill = 0;
  waterBill = 0;
  totalPayAmount = 0;
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
      billMonth: ['0', Validators.required],
      billYear: ['0', Validators.required],
      electricityBill: [0],
      waterBill: [0],
      dueAmount: [0]
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
    this.generateBillModal = true;
    this.modalBackDrop = true;
    this.customerName = customer.firstName + ' ' + customer.lastName;
    this.customerBillForm.patchValue({
      customerID: customer._id
    });
    this.rentAmount = customer.rentAmount;
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

  getCustomer(hostelID) {
    this.spinner.show();
    var parameters = {
      'hostelID': hostelID,
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
    var billMonth = this.customerBillForm.value.billMonth;
    var billYear = this.customerBillForm.value.billYear;
    if (billMonth != '0' && billYear != '0') {
      billYear = (billMonth == 1) ? billYear - 1 : billYear;
      billMonth = (billMonth == 1) ? 12 : (billMonth - 1);
      var parameters = {
        billMonth: billMonth,
        billYear: billYear
      }
      this.spinner.show();
      this.service.Post('rent/getDueAmount', parameters).subscribe(
        (x: any) => {
          if (x.IsSuccess) {
            this.previousDue = x.data[0].dueAmount;
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
}
