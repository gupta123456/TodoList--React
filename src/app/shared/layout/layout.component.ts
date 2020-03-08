import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private cookieService: CookieService) { }

  ngOnInit() {
    debugger
    var userCookies = this.cookieService.get('user');
    var userSession = sessionStorage.getItem('user');
    if (userCookies && !userSession) {
      sessionStorage.setItem('user', userCookies);
    }
  }

}
