import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { RoutesListService } from '../routes-list.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  user: string = "";
  password: string = "";

  constructor(private router: Router, private http: HttpClient, private routesList: RoutesListService){}

  goToCreateUser(){
    this.router.navigate(['/createUser']);
  }

  goToRecoverPass(){
    this.router.navigate(['/recoverPass']);
  }

  validateLogin(){
    this.registerUser();
  }

  public registerUser() {
    const url = this.routesList.getLogin();
    const data = {
      email: this.user,
      password: this.password
    };
    this.http.post(url, data).subscribe(response => {
      if('message' in response){
        const div_email = document.querySelector('#warn_email') as HTMLElement;
        const div_pass = document.querySelector('#warn_pass') as HTMLElement;
        if(response.message == "Email incorrecto"){
          div_email.style.display = 'flex';
          div_pass.style.display = 'none';
        }else{
          div_email.style.display = 'none';
          div_pass.style.display = 'flex';
        }
      }else if('token' in response){
        const token: string = response.token as string;
        const decode_token: object = jwt_decode(JSON.stringify(token));
        localStorage.setItem('token', token);
        if('infoUser' in decode_token){
          const data = decode_token.infoUser as Array<object>;
          if('rol' in data[0]){
            if(data[0].rol == 'A'){
              this.router.navigate(['/adminHome']);
            }else{
              this.router.navigate(['/home']);
            }
          }
        }
      }
    });
  }
}
