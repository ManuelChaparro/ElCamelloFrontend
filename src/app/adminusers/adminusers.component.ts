import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import * as bootstrap from 'bootstrap';
import { RoutesListService } from '../routes-list.service';

@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.css']
})
export class AdminusersComponent {
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

  constructor(private router: Router, private http: HttpClient, private routesList: RoutesListService){
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
    this.rol = 'Cliente';
    this.usuarios = undefined;
    this.emailToDelete = '';
  }

  ngOnInit() {
    this.loadUserList();
  }

  public saveChanges(){
    const url = this.routesList.getModifyUser();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const data = {
      email: this.email,
      nombres: this.name,
      apellidos: this.surname,
      genero: this.gender.charAt(0),
      telefono: this.number
    };
    this.http.put(url, data, { headers }).subscribe((data) => {
      const body = document.querySelector('#modal-body') as HTMLElement;
      const modal = document.querySelector('#infoModal') as HTMLElement;
      const bootstrapModal = new bootstrap.Modal(modal);
      body.innerHTML = 'El usuario ha sido modificado exitosamente ! ';
      bootstrapModal.show();
      this.changeOption(1);
      this.loadUserList();
    });

  }

  public loadUserList(){
    const url = this.routesList.getUserList();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    this.http.get(url, { headers }).subscribe((data) => {
      this.usuarios = data as Iterable<any>;
    });

  }

  public deleteUser(){
      const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
      if('infoUser' in decode_token){
        const infoUser =  decode_token.infoUser as Array<object>;
        if('rol' in infoUser[0] && 'id_usuario' in infoUser[0]){
          const data = {
            email: this.emailToDelete,
            rol: infoUser[0].rol,
            id_user: infoUser[0].id_usuario
          };
          const url = this.routesList.getDeleteUserAdmin();
          const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          });
          this.http.post(url, data, {headers}).subscribe(response => {
            if('message' in response){
              if(response.message == '0'){
                location.reload();
              }else{
                alert("No se pudo eliminar")
              }
            }
          });
        }

    }
  }

  public confirmDelete(email: string){
    const modal = document.querySelector('#deleteModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    this.emailToDelete = email;
  }

  public changeOption(option: number){
    const div_create = document.querySelector('#create-user') as HTMLElement;
    const div_list = document.querySelector('#table-user') as HTMLElement;
    const div_modify = document.querySelector('#modify-user') as HTMLElement;
    if(option===0){
      this.cleanData();
      div_create.classList.remove('d-none');
      div_list.classList.add('d-none');
      div_modify.classList.add('d-none');
    }else if(option === 1){
      div_create.classList.add('d-none');
      div_list.classList.remove('d-none');
      div_modify.classList.add('d-none');
    }else{
      div_create.classList.add('d-none');
      div_list.classList.add('d-none');
      div_modify.classList.remove('d-none');
    }
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

  public httpPostRequest(){
    const url = this.routesList.getCreateUser();
    const data = {
      nombres: this.name,
      apellidos: this.surname,
      fecha_nacimiento: this.birthdate,
      email: this.email,
      genero: this.gender.charAt(0),
      tipo_documento: this.document_type,
      identificacion: this.document,
      telefono: this.number,
      rol: this.rol.charAt(0),
      password: this.password
    };

    if(data.tipo_documento == 'Cédula de Ciudadanía'){
      data.tipo_documento = 'C.C';
    }else if(data.tipo_documento == 'Tarjeta de Identidad'){
      data.tipo_documento = 'T.I';
    }else{
      data.tipo_documento = 'C.E';
    }
    this.http.post(url, data).subscribe(response => {
      if('message' in response){
        if(response.message == '0'){
          this.cleanData();
          this.changeOption(1);
          this.loadUserList();
        }else if(response.message == '1'){
          alert("El email ya se encuentra registrado");
        }else{
          console.log(response);
        }
      }
    });
  }

  public cleanData(){
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
    this.rol = 'Cliente';
  }

  public modifyUser(email: string){
    this.loadData(email);
  }

  public loadData(email: string){
    const url = this.routesList.getSearchUser();
    const data = {
      email: email,
    };
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    this.http.post(url, data, {headers}).subscribe(response => {
      const data = response as Array<object>;
      if('nombres' in data[0] && 'apellidos' in data[0] && 'telefono' in data[0] && 'email' in data[0]
      && 'genero' in data[0]){
        this.name = data[0].nombres as string;
        this.surname = data[0].apellidos as string;
        this.number = data[0].telefono as number;
        this.gender = data[0].genero as string;
        this.email = data[0].email as string;
        this.changeOption(2);
      }
    });
  }

  public registerUser() {
    this.validations();
  }

  public validations(){
    const v_email = this.validationEmail();
    const v_pass = this.validationPass();
    const v_birthdate = this.validationBirthdate();
    const v_data_empty = this.validateInputs();
    if(v_email && v_pass && v_birthdate && v_data_empty){
      this.httpPostRequest();
    }
  }

  public validateInputs(){
    const warn_name = document.querySelector('#warn_name') as HTMLElement;
    const warn_surname = document.querySelector('#warn_surname') as HTMLElement;
    const warn_phone = document.querySelector('#warn_phone') as HTMLElement;
    const warn_doc = document.querySelector('#warn_doc') as HTMLElement;
    if(this.name == ''){
      warn_name.classList.remove('d-none');
    }else{
      warn_name.classList.add('d-none');
      if(this.surname == ''){
        warn_surname.classList.remove('d-none');
      }else{
        warn_surname.classList.add('d-none');
        if(this.number == undefined){
          warn_phone.classList.remove('d-none');
        }else{
          warn_phone.classList.add('d-none');
          if(this.document == undefined){
            warn_doc.classList.remove('d-none');
          }else{
            warn_doc.classList.add('d-none');
            return true;
          }
        }
      }
    }
    return false;
  }

  public validationBirthdate(){
    const warn_birth = document.querySelector('#warn_birth') as HTMLElement;
    const warn_birth_more = document.querySelector('#warn_birth_more') as HTMLElement;
    if(this.birthdate == ''){
      warn_birth.classList.remove('d-none');
      return false;
    }else{
      warn_birth.classList.add('d-none');
      const actualDate: Date = new Date();
      actualDate.setFullYear(actualDate.getFullYear() - 16 );
      if(new Date(this.birthdate).getTime() <= actualDate.getTime()){
        warn_birth_more.classList.add('d-none');
        return true;
      }else{
        warn_birth_more.classList.remove('d-none');
      }
    }
    return false;
  }

  public validationEmail(){
    const warn_email = document.querySelector('#warn_email') as HTMLElement;
    const email_test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email_test.test(this.email)){
      warn_email.classList.add('d-none')
      return true;
    }else{
      warn_email.classList.remove('d-none')
      return false;
    }
  }

  public validationPass(){
    const warn_pass = document.querySelector('#warn_pass') as HTMLElement;
    const warn_con_pass = document.querySelector('#warn_con_pass') as HTMLElement;
    if(this.password.length < 8){
      warn_pass.classList.remove('d-none');
    }else{
      warn_pass.classList.add('d-none');
      if(this.password != this.confirm_pass){
        warn_con_pass.classList.remove('d-none');
      }else{
        warn_con_pass.classList.add('d-none');
        return true;
      }
    }
    return false;
  }

}
