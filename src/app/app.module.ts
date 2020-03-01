import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { CustomerInfoComponent } from './component/customer-info/customer-info.component';
import { HostelInfoComponent } from './component/hostel-info/hostel-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatTableModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { DataTableModule } from 'ng-angular8-datatable';
import { RentInfoComponent } from './component/rent-info/rent-info.component';
import { RoomInfoComponent } from './component/room-info/room-info.component';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './component/login/login.component';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    CustomerInfoComponent,
    HostelInfoComponent,
    RentInfoComponent,
    RoomInfoComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    NgxSpinnerModule,
    DataTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000
    })
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
