import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from '../../common/common.service';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  selectedYear = 0;
  selectedMonth = 0;
  customerNo: any;
  monthName = '';
  selectedRoom = 0;
  chkDueAmount = false;
  monthForm: any;
  constructor(private service: CommonService, private spinner: NgxSpinnerService, private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document, private toastr: ToastrService) { }

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
      billMonth: [{ value: 0 }, Validators.required],
      billYear: [{ value: 0 }, Validators.required],
      electricityBill: [0],
      waterBill: [0],
      dueAmount: [0],
      comment: [null]
    })
    this.payBill = this.fb.group({
      billMonth: [{ value: 0 }, Validators.required],
      billYear: [{ value: 0 }, Validators.required],
      paidAmount: [0]
    })
    this.monthForm = this.fb.group({
      hostelID: [0, Validators.required],
      roomID: [0, Validators.required],
      billMonth: [0, Validators.required],
      billYear: [0, Validators.required],
      dueAmount: [false]
    })
    this.getHostel('');
    this.getMonth();
    this.getYear();
  }
  openBillModal(customer) {
    this.customerBillForm.reset();
    this.customerName = customer.firstName + ' ' + customer.lastName;
    this.customerNo = customer.customerNo;
    this.customerBillForm.patchValue({
      customerID: customer._id,
      billMonth: this.selectedMonth,
      billYear: this.selectedYear,
      electricityBill: 0,
      waterBill: 0
    });
    this.rentAmount = customer.rentAmount;
    this.getDueAmount(customer);
    this.generateBillModal = true;
    this.modalBackDrop = true;
    this.document.body.classList.add('modal-open');
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
  getCustomer() {
    this.spinner.show();
    this.selectedMonth = this.monthForm.value.billMonth;
    this.selectedYear = this.monthForm.value.billYear;
    this.selectedRoom = this.monthForm.value.roomID;
    this.chkDueAmount = this.monthForm.value.dueAmount
    var parameters = {
      'roomID': this.selectedRoom,
      'isActive': true
    }
    this.service.Post('rent/getCustomerListByMonth', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.customerData = [];
          if (this.chkDueAmount) {
            for (var i = 0; i < x.data.length; i++) {
              if (x.data[i].rentInfo && x.data[i].rentInfo.length > 0) {
                var selectedRentInfo = x.data[i].rentInfo.filter(x => x.billMonth == this.selectedMonth && x.billYear == this.selectedYear);
                if (selectedRentInfo.length > 0 && selectedRentInfo[0].dueAmount > 0)
                  this.customerData.push(x.data[i]);
                else if (selectedRentInfo.length < 1)
                  this.customerData.push(x.data[i]);
              }
              else {
                this.customerData.push(x.data[i]);
              }
            }
          }
          else {
            this.customerData = x.data;
          }
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
    this.document.body.classList.remove('modal-open');
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
          this.monthName = this.month[this.selectedMonth];
          this.toastr.success('Bill generated successfully', 'Customer');
        }
        else {
          console.log("error occured");
        }
      }
    );
  }
  getDueAmount(customer) {
    if (customer != undefined) {
      var billMonth = this.selectedMonth;
      var billYear = this.selectedYear;
      if (billMonth != 0 && billYear != 0) {
        billYear = (billMonth == 1) ? billYear - 1 : billYear;
        billMonth = (billMonth == 1) ? 12 : billMonth - 1;
        var parameters = {
          billMonth: billMonth,
          billYear: billYear,
          customerID: customer._id
        }
        this.spinner.show();
        this.service.Post('rent/getAmount', parameters).subscribe(
          (x: any) => {
            if (x.IsSuccess) {
              if (x.data.length > 0) {
                this.previousDue = x.data[0].dueAmount == undefined ? 0 : x.data[0].dueAmount;
              }
              this.spinner.hide();
            }
            else {
              console.log("error occured");
            }
          }
        );
      }
    }
  }
  btnClosefinalBillModal() {
    this.finalBillModal = false;
    this.modalBackDrop = false;
    this.document.body.classList.remove('modal-open');
  }
  PayModal(item) {
    this.payBill.patchValue({
      billYear: this.selectedYear,
      billMonth: this.selectedMonth,
      paidAmount: 0
    });
    console.log(item);
    this.customerName = item.firstName + ' ' + item.lastName;
    this.customerID = item._id;
    this.spinner.show();
    var parameters = {
      customerID: item._id,
      billYear: this.selectedYear,
      billMonth: this.selectedMonth
    }
    this.service.Post('rent/getTotalPaymentAmount', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          if (x.data) {
            this.totalPayAmount = item.rentAmount + x.data.electricityBill + x.data.waterBill + x.data.dueAmount;
            this.payBillModal = true;
            this.modalBackDrop = true;
          }
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
    var parameters = {
      billYear: this.payBill.value.billYear,
      billMonth: this.payBill.value.billMonth,
      customerID: this.payBill.value.customerID,
      paidAmount: this.payBill.value.paidAmount,
      dueAmount: this.totalPayAmount - this.payBill.value.paidAmount
    }
    this.spinner.show();
    this.service.Post('rent/payRent', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess) {
          this.btnClosePayBillModal();
          this.spinner.hide();
          this.toastr.success('Bill paid successfully!', 'Customer');
        }
        else {
          console.log("error occured");
        }
      }
    );
  }
  getDueDetail(value) {
    alert(value)
  }
  viewBill(item) {
    var parameters = {
      billYear: this.selectedYear,
      billMonth: this.selectedMonth,
      customerID: item._id
    }
    this.spinner.show();
    this.service.Post('rent/getAmount', parameters).subscribe(
      (x: any) => {
        if (x.IsSuccess && x.data.length > 0) {
          var billYear = (this.selectedMonth == 1) ? this.selectedYear - 1 : this.selectedYear;
          var billMonth = (this.selectedMonth == 1) ? 12 : this.selectedMonth - 1;
          var selectedCustomer = this.customerData.filter(x => x._id == item._id);
          var getPreviousMonthAmount = selectedCustomer[0].rentInfo.filter(x => x.billMonth == billMonth && x.billYear == billYear);
          var previousDueAmount = getPreviousMonthAmount.length > 0 ? getPreviousMonthAmount[0].dueAmount : 0
          this.electricityBill = x.data[0].electricityBill;
          this.waterBill = x.data[0].waterBill;
          this.totalPayAmount = item.rentAmount + x.data[0].electricityBill + x.data[0].waterBill + previousDueAmount;
          this.finalBillModal = true;
          this.monthName = this.month[this.selectedMonth];
          this.modalBackDrop = true;
          this.customerName = item.firstName + ' ' + item.lastName;
          this.rentAmount = item.rentAmount;
          this.customerNo = item.customerNo;
          this.previousDue = previousDueAmount;
          this.document.body.classList.add('modal-open');
        }
        else {
          this.toastr.warning('Please generate bill!', 'Bill generate');
        }
        this.spinner.hide();
      }
    );
  }
}
