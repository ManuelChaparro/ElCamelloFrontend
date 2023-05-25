import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RoutesListService } from '../routes-list.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent {
  public name: string;
  public surname: string;
  public number: number|undefined;
  public email: string;
  public gender: string;
  public password: string;
  public confirm_pass: string;
  public document_type: string;
  public document: number|undefined;
  public birthdate: string;
  public view: number;

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
    this.view = 0;
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
    }else{
      const modal = document.querySelector('#myModal') as HTMLElement;
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  public validateInputs(){
    if(this.name != '' && this.surname != ''
    && this.number != undefined && this.document != undefined){
      return true;
    }else{
      alert("inputs");
      return false;
    }
  }

  public validationBirthdate(){
    const actualDate: Date = new Date();
    actualDate.setFullYear(actualDate.getFullYear() - 16 );
    if(this.birthdate != '' && new Date(this.birthdate).getTime() <= actualDate.getTime()){
      return true;
    }else{
      alert("cumple");
      return false;
    }
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
      rol: "C",
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
          this.view = 1;
          timer(2500).pipe(delay(2500)).subscribe(() => {
            this.router.navigate(['/login']);
          });
        }else if(response.message == '1'){
          alert("El email ya se encuentra registrado");
        }else{
          console.log(response);
        }
      }
    });
  }

  public validationEmail(){
    const email_test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email_test.test(this.email)){
      return true;
    }else{
      alert("Email");
      return false;
    }
  }

  public validationPass(){
    if(this.password.length >= 8 && this.password == this.confirm_pass){
      return true;
    }else{
      alert("Contraseña");
      return false;
    }
  }

  changeGender(value:string): void {
		this.gender = value;
	}

  changeDocType(value:string): void {
		this.document_type = value;
	}

  validateUser(){
    this.registerUser();
  }

}

