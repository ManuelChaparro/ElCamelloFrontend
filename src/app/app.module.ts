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
    RecoverPassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
