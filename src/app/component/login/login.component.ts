import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  SigninForm: any;
  isSubmit= false;
  constructor(private spinner: NgxSpinnerService, private router : Router, private service: CommonService) { }

  ngOnInit() {
    this.SigninForm = new FormGroup({
      userName: new FormControl(
        null,
        Validators.required
      ),
      password: new FormControl(
        null,
        Validators.required
      )
    });
  }
  submit()
  {
    this.isSubmit = true;
    if(this.SigninForm.valid)
    {
      this.spinner.show();
      this.router.navigateByUrl('/hostel-info');
      this.service.Post('',this.SigninForm.value).subscribe(
        (x:any) =>{

          this.spinner.hide();
          this.isSubmit = false;
        }
      );
    }
  }
}
