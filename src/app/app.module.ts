import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HomeComponent } from './home/home.component';
import { RecoverPassComponent } from './recover-pass/recover-pass.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { AdmincampusComponent } from './admincampus/admincampus.component';
import { AdminbookingsComponent } from './adminbookings/adminbookings.component';
import { AdminreportsComponent } from './adminreports/adminreports.component';
import { AdminscheduleComponent } from './adminschedule/adminschedule.component';
import { AdminstockComponent } from './adminstock/adminstock.component';
import { AdminusersComponent } from './adminusers/adminusers.component';
import { InfouserComponent } from './infouser/infouser.component';
import { CampuslistComponent } from './campuslist/campuslist.component';
import { NewcampusComponent } from './newcampus/newcampus.component';
import { StocklistComponent } from './stocklist/stocklist.component';
import { NewstockComponent } from './newstock/newstock.component';
import { BookingsComponent } from './bookings/bookings.component';
import { CampusComponent } from './campus/campus.component';
import { BookingslistComponent } from './bookingslist/bookingslist.component';
import { NewbookingComponent } from './newbooking/newbooking.component';
import { NewscheduleComponent } from './newschedule/newschedule.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const appRoutes:Routes=[
  {path:'login', component:LoginComponent},
  {path:'createUser', component:CreateUserComponent},
  {path:'home', component:HomeComponent},
  {path:'recoverPass', component:RecoverPassComponent},
  {path:'adminHome', component:AdminhomeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminhomeComponent,
    CreateUserComponent,
    HomeComponent,
    RecoverPassComponent,
    AdmincampusComponent,
    AdminbookingsComponent,
    AdminreportsComponent,
    AdminscheduleComponent,
    AdminstockComponent,
    AdminusersComponent,
    InfouserComponent,
    CampuslistComponent,
    NewcampusComponent,
    StocklistComponent,
    NewstockComponent,
    BookingsComponent,
    CampusComponent,
    BookingslistComponent,
    NewbookingComponent,
    NewscheduleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
