import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingsComponent } from '../bookings/bookings.component';
import { Router } from '@angular/router';
import { InfouserComponent } from '../infouser/infouser.component';
import { RoutesListService } from '../routes-list.service';
import { CampusComponent } from '../campus/campus.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
  public name: string | unknown;
  public surname: string;
  public number: number | undefined;
  public rol: string | unknown;

  constructor(private http: HttpClient, private router: Router, private routesList: RoutesListService){
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('email' in infoUser[0]){
        const url = routesList.getSearchUser();
        const token_email = infoUser[0].email;
        const data = {
          email: token_email as string,
        };
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        });
        this.http.post(url, data, {headers}).subscribe(response => {
          const data = response as Array<object>;
          if('nombres' in data[0] && 'apellidos' in data[0]){
            const names = data[0].nombres as string
            const surnames = data[0].apellidos as string
            this.name = names.split(" ")[0];
            this.surname = surnames.split(" ")[0];
          }
        });
      }
    }
    this.name = '';
    this.surname = '';
  }

  public logout(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  componentes = [
    { nombre: 'Componente 1', componente: CampusComponent},
    { nombre: 'Componente 2', componente: BookingsComponent},
    { nombre: 'Componente 3', componente: InfouserComponent}
  ];
  indiceComponenteActual = 0;
  cambiarComponente(indice: number) {
    const notification = document.querySelector('#notification') as HTMLElement;
    notification.classList.add('d-none');
    this.indiceComponenteActual = indice;
  }

  showOptions(): void{
    const notification = document.querySelector('#notification') as HTMLElement;
    notification.classList.remove('d-none');
    setTimeout(() => {
      notification.classList.add('d-none');
    }, 5000);
  }
}

