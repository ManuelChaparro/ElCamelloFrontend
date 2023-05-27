import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import * as bootstrap from 'bootstrap';
import { RoutesListService } from '../routes-list.service';

@Component({
  selector: 'app-newschedule',
  templateUrl: './newschedule.component.html',
  styleUrls: ['./newschedule.component.css']
})
export class NewscheduleComponent {

  public campus_list: Iterable<any> | null | undefined;
  public campus_schedule: Iterable<any> | null | undefined;
  public campus_selected: string | null | undefined;
  public id_schedule_delete: number | undefined;

  constructor(private http: HttpClient, private routesList: RoutesListService){
    this.campus_list = undefined;
    this.campus_selected = undefined;
    this.campus_schedule = undefined;
    this.id_schedule_delete = undefined;
  }

  ngOnInit(){
    this.initCampusList();
  }

  initCampusList(){
    const url = this.routesList.getCampusList();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    this.http.get(url, { headers }).subscribe((data) => {
      this.campus_list = data as Iterable<any>;
      const campus_array = Array.from(this.campus_list);
      const ultimoElemento = campus_array.pop();
      if('nombre_sede' in ultimoElemento){
        this.campus_selected = ultimoElemento.nombre_sede;
        this.updateByCampus(true, ultimoElemento.id_sede);
      }
    });
  }

  updateByCampus(init: boolean, id_campus?: number){
    const campus = document.querySelector('#select_campus') as HTMLSelectElement;
    let data = {};
    if(!init){
      this.campus_selected = campus.value.split(" - ")[1];
      data = {
        id_headquarter: campus.value.split(" - ")[0]
      };
    }
    if(id_campus){
      data = {
        id_headquarter: id_campus
      };
    }
    const url = this.routesList.getScheduleCampus();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    this.http.post(url, data, { headers }).subscribe((data) => {
      const result = data as Array<string>;
      this.campus_schedule = [];
      if(result.length == 0){
        const modal = document.querySelector('#infoModal') as HTMLElement;
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
      }else{
        this.campus_schedule = data as Iterable<any>;
      }
    });

  }

  deleteSchedule(){
    const url = this.routesList.getDeleteSchedule();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('rol' in infoUser[0] && 'id_usuario' in infoUser[0]){
        const data = {
          schedule_id: this.id_schedule_delete,
          rol: infoUser[0].rol,
          id_user: infoUser[0].id_usuario,
        };
        this.http.post(url, data, { headers }).subscribe((data) => {
          const modal = document.querySelector('#deleteScheduleModal') as HTMLElement;
          const bootstrapModal = new bootstrap.Modal(modal);
          bootstrapModal.hide();
          this.updateByCampus(false);
        });
      };
    };

  }

  showDeleteSchedule(id_schedule_delete: number){
    this.id_schedule_delete = id_schedule_delete;
    const modal = document.querySelector('#deleteScheduleModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

  saveSchedule(day: string, firstOpen: string, firstClose:string, secondOpen:string, secondClose:string){
    const url = this.routesList.getCreateSchedule();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('rol' in infoUser[0] && 'id_usuario' in infoUser[0]){
        const campus = document.querySelector('#select_campus') as HTMLSelectElement;
        const data = {
          headquarter_id: campus.value.split(" - ")[0],
          working_day: day,
          opening_time_am: firstOpen,
          closing_time_am: firstClose,
          opening_time_pm: secondOpen,
          closing_time_pm: secondClose,
          rol: infoUser[0].rol,
          id_user: infoUser[0].id_usuario,
        };
        this.http.post(url, data, { headers }).subscribe((data) => {
          if('message' in data ){
            if(data.message == '2'){
              const modal = document.querySelector('#errorScheduleModal') as HTMLElement;
              const bootstrapModal = new bootstrap.Modal(modal);
              bootstrapModal.show();
            }else{
              this.updateByCampus(false);
            }
          }
        });
      };
    };
  }
}
