import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import * as bootstrap from 'bootstrap';
import { ServiceUserInfoService } from '../service-user-info.service';
import { RoutesListService } from '../routes-list.service';

@Component({
  selector: 'app-infouser',
  templateUrl: './infouser.component.html',
  styleUrls: ['./infouser.component.css']
})
export class InfouserComponent {
  public name: string;
  public surname: string;
  public number: number|undefined;
  public email: string;
  public gender: string;
  public password: string;
  public confirm_pass: string;
  public document_type: string;
  public rol: string;
  public document: number|undefined;
  public birthdate: string;
  public usuarios: Iterable<any> | null | undefined;
  public emailToDelete: string;

  constructor(private router: Router, private http: HttpClient, private serviceInfoUser: ServiceUserInfoService,
    private routesList: RoutesListService){
    this.name = '';
    this.surname = '';
    this.number = undefined;
    this.email = '';
    this.gender = 'Masculino';
    this.password = '';
    this.confirm_pass= '';
    this.document_type = 'Cédula de Ciudadanía';
    this.document = undefined;
    this.birthdate = '';
    this.rol = '';
    this.usuarios = undefined;
    this.emailToDelete = '';
  }

  ngOnInit(){
    this.loadData();
  }

  loadData(){
    const url = this.routesList.getSearchUser();

    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('email' in infoUser[0]){
        const data = {
          email: infoUser[0].email,
        };
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        });
        this.http.post(url, data, {headers}).subscribe(response => {
          const data = response as Array<object>;
          const rol = document.querySelector("#rol") as HTMLSelectElement;
          const gender = document.querySelector("#rol") as HTMLSelectElement;
          const docType = document.querySelector("#rol") as HTMLSelectElement;
          if('nombres' in data[0] && 'apellidos' in data[0] && 'telefono' in data[0] && 'email' in data[0]
          && 'genero' in data[0] && 'tipo_documento' in data[0] && 'fecha_nacimiento' in data[0] && 'identificacion' in data[0]
          && 'rol' in data[0]){
            this.name = data[0].nombres as string;
            this.surname = data[0].apellidos as string;
            this.number = data[0].telefono as number;
            this.email = data[0].email as string;
            this.document = data[0].identificacion as number;
            this.birthdate =  data[0].fecha_nacimiento as string;
            const getDate = new Date(data[0].fecha_nacimiento as string);
            this.birthdate = getDate.toLocaleDateString(); // formatear la fecha como una cadena legible para los usuarios
            if(data[0].rol as string === 'A'){
              this.rol = 'Administrador';
            }else{
              this.rol = 'Cliente';
            }
            if(data[0].genero as string === 'Masculino'){
              gender.selectedIndex = 0;
            }else if(data[0].genero as string === 'Femenino'){
              gender.selectedIndex = 1;
            }else{
              gender.selectedIndex = 2;
            }
            if(data[0].tipo_documento as string === 'C.C'){
              docType.selectedIndex = 0;
            }else{
              docType.selectedIndex = 1;
            }
          }
        });
      }
    }
  }

  changeModify(option: boolean){
    const modify = document.querySelector("#cardModify") as HTMLElement;
    const info = document.querySelector("#cardInfo") as HTMLElement;
    if(option){
      modify.style.display = '';
      info.style.display = 'none';
    }else{
      modify.style.display = 'none';
      info.style.display = '';
    }
  }

  changePassword(email: string, actualPass: string, newPass: string){
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const data = {
        email: email,
        current_password: actualPass,
        new_password: newPass
      };
      const url = this.routesList.getChangePass();
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.put(url, data, {headers}).subscribe(response => {
        if('message' in response){
          if(response.message === '0'){
            const modalTwo = document.querySelector('#infoModal') as HTMLElement;
            const bootstrapModalInfo = new bootstrap.Modal(modalTwo);
            bootstrapModalInfo.show();
          }else if(response.message === '1'){
            alert("Error")
          }
          else{
            alert("No tiene permisos")
          }
        }
      });
    }
  }

  saveChanges(){
    const url = this.routesList.getModifyUser();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const data = {
      email: this.email,
      nombres: this.name,
      apellidos: this.surname,
      genero: this.gender,
      telefono: this.number
    };
    this.http.put(url, data, { headers }).subscribe((data) => {
      const modal = document.querySelector('#infoModal') as HTMLElement;
      const bootstrapModal = new bootstrap.Modal(modal);
      this.serviceInfoUser.setName(this.name);
      this.serviceInfoUser.setSurname(this.surname);
      bootstrapModal.show();
      this.changeModify(false);
    });
  }

  changeGender(value:string): void {
		this.gender = value;
	}

  changeRol(value:string): void {
		this.rol = value;
	}

  changeDocType(value:string): void {
		this.document_type = value;
	}

  deleteUser(){
    const modal = document.querySelector('#deleteModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

  changeUserPassword(){
    const modal = document.querySelector('#passModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

  deleteAccount(email: string, password: string){
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const data = {
        email: email,
        password: password
      };
      const url = this.routesList.getDeleteUser();
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.post(url, data, {headers}).subscribe(response => {
        if('message' in response){
          if(response.message === '0'){
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }else if(response.message === '1'){

          }else{
            alert("No tiene permisos")
          }
        }
      });
    }
  }

}
