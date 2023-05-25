import { Component, HostListener, ViewChild } from '@angular/core';
import { AdmincampusComponent } from '../admincampus/admincampus.component';
import { AdminusersComponent } from '../adminusers/adminusers.component';
import { AdminbookingsComponent } from '../adminbookings/adminbookings.component';
import { AdminreportsComponent } from '../adminreports/adminreports.component';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { AdminstockComponent } from '../adminstock/adminstock.component';
import { Router } from '@angular/router';
import { InfouserComponent } from '../infouser/infouser.component';
import { ServiceUserInfoService } from '../service-user-info.service';
import { AdminscheduleComponent } from '../adminschedule/adminschedule.component';
import * as bootstrap from 'bootstrap';
import { RoutesListService } from '../routes-list.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent {
  public name: string;
  public surname: string;

  ngOnInit(){
    const interval = setInterval(() => {
      const url = this.routesList.getValidUser();
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.post(url, {headers}).subscribe(response => {
          if(!response){
            const modal = document.querySelector('#infoModal') as HTMLElement;
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
            localStorage.removeItem('token');
            clearInterval(interval);
            setTimeout(() => {
              bootstrapModal.dispose();
              bootstrapModal.hide();
              this.router.navigate(['/login']);
            }, 5000);

          }
      });
      }, 5000);
  }

  constructor(private http: HttpClient, private router: Router, private serviceInfoUser: ServiceUserInfoService, private routesList: RoutesListService){
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
          try{
            if('nombres' in data[0] && 'apellidos' in data[0]){
              const names = data[0].nombres as string
              const surnames = data[0].apellidos as string
              serviceInfoUser.setName(data[0].nombres as string);
              serviceInfoUser.setSurname(data[0].apellidos as string);
              this.name = serviceInfoUser.getName() as string;
              this.surname = serviceInfoUser.getSurname() as string;
            }
          }catch(error){
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        });
      }
    }
    this.name = '';
    this.surname = '';
  }

  mostrarVentana = false;
  ventanaEstilos = {};

  accion1() {
    console.log('Botón 1 presionado');
  }

  accion2() {
    console.log('Botón 2 presionado');
  }

  @HostListener('document:mousemove', ['$event'])
  actualizarPosicionVentana(event: MouseEvent) {
    this.ventanaEstilos = {
      top: `${event.clientY + 10}px`,
      left: `${event.clientX + 10}px`
    };
  }

  componentes = [
    { nombre: 'Componente 1', componente: AdmincampusComponent},
    { nombre: 'Componente 2', componente: AdminusersComponent},
    { nombre: 'Componente 3', componente: AdminbookingsComponent },
    { nombre: 'Componente 4', componente: AdminreportsComponent },
    { nombre: 'Componente 5', componente: AdminstockComponent },
    { nombre: 'Componente 6', componente: InfouserComponent },
    { nombre: 'Componente 7', componente: AdminscheduleComponent },
  ];
  indiceComponenteActual = 0;
  cambiarComponente(indice: number) {
    this.indiceComponenteActual = indice;
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
