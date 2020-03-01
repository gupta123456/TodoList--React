import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerInfoComponent } from './component/customer-info/customer-info.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { HostelInfoComponent } from './component/hostel-info/hostel-info.component';
import { RentInfoComponent } from './component/rent-info/rent-info.component';
import { RoomInfoComponent } from './component/room-info/room-info.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './common/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'hostel-info', canActivate: [AuthGuard], component: HostelInfoComponent },
      { path: 'room-info', canActivate: [AuthGuard], component: RoomInfoComponent },
      { path: 'customer-info', canActivate: [AuthGuard], component: CustomerInfoComponent },
      { path: 'rent-info', canActivate: [AuthGuard], component: RentInfoComponent }
    ]
  },
  { path: '**', redirectTo: 'hostel-info', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
