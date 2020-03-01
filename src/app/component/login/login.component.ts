import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  SigninForm: any;
  isSubmit = false;
  constructor(private spinner: NgxSpinnerService, private router: Router, private service: CommonService,
    private toastr: ToastrService, private cookieService: CookieService) { }

  ngOnInit() {
    this.SigninForm = new FormGroup({
      userName: new FormControl(
        null,
        Validators.required
      ),
      password: new FormControl(
        null,
        Validators.required
      ),
      rememberUser: new FormControl(
        null
      )
    });
  }
  submit() {
    this.isSubmit = true;
    if (this.SigninForm.valid) {
      this.spinner.show();
      this.service.Post('login/verifyUser', this.SigninForm.value).subscribe(
        (x: any) => {
          this.spinner.hide();
          this.isSubmit = false;
          if (x.IsSuccess && x.data) {
            if (this.SigninForm.value.rememberUser) {
              this.cookieService.set('user', JSON.stringify(x.data));
            }
            else {
              sessionStorage.setItem('user', JSON.stringify(x.data));
            }
            this.router.navigateByUrl('/hostel-info');
          }
          else {
            this.toastr.error('Invalid User or password!', 'Login');
          }
        }
      );
    }
    else {
      this.toastr.error('Please fill mandatory fields!', 'Login');
    }
  }
}
