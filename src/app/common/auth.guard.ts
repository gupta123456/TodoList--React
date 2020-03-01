import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private cookieService: CookieService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    var userCookies = this.cookieService.get('user');
    var user = sessionStorage.getItem('user');
    if (userCookies || user) {
      this.router.navigateByUrl('/hostel-info');
      return true;
    }
    this.router.navigateByUrl('/login');
  }
}
