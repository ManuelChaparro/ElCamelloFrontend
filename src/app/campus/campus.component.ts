import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import * as bootstrap from 'bootstrap';
import { RoutesListService } from '../routes-list.service';
import { formatDate } from '@angular/common';

interface Campus{
  name: string;
  description: string;
  quantity_spaces: number;
  address: string;
  campus_id: number;
  schedules: {
    day: string;
    first_open: string;
    first_close: string;
    second_open: string;
    second_close: string;
  }[];
}

interface Booking{
  space_id: number,
  client_id: number,
  date_booking: string,
  hour_start: string,
  hour_end: string,
  note: string
}

interface Space{
  id_space: number,
  name: string,
  fee: number,
  note: string
}

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent {

  public campus_list: Array<Campus>;
  public campus_id_list: Array<Iterable<any>> | undefined;
  public selectedCampus: Campus;
  public spacesList: Array<Space>;
  public selectedSpace: Space;
  public bookingData: Booking;
  public view: number;
  public actualDate: string;
  public actualHour: string;

  ngOnInit(){
    this.loadCampusOnDatabase();
  }

  constructor(private http: HttpClient, private routesList: RoutesListService){
    this.actualDate = this.getMinDate();
    this.actualHour = this.getMinHour();
    this.spacesList = [];
    this.campus_list = [];
    this.campus_id_list = [];
    this.selectedCampus = {
      name: "",
      description: "",
      quantity_spaces: -1,
      address: "",
      campus_id: -1,
      schedules: []
    };
    this.bookingData = {
      space_id: 0,
      client_id: 0,
      date_booking: "",
      hour_start: "",
      hour_end: "",
      note: ""
    }
    this.selectedSpace = {
      id_space: -1,
      name: "",
      fee: -1,
      note: ""
    };
    this.view = 0;
  }

  validateTime(event: Event) {
    const timeInput = event.target as HTMLInputElement;
    const selectedTime = timeInput.value.split(':');
    const minutes = parseInt(selectedTime[1]);
    if (minutes % 15 !== 0) {
      const validMinutes = Math.round(minutes / 15) * 15;
      selectedTime[1] = validMinutes.toString().padStart(2, '0');
      timeInput.value = selectedTime.join(':');
    }
  }

  private getMinDate(): string {
    const actualDate = new Date();
    return formatDate(actualDate, 'yyyy-MM-dd', 'en-US');
  }

  private getMinHour(): string {
    const actualDate = new Date();
    return actualDate.toISOString().substring(11, 16);
  }

  public setView(view: number): void{
    this.view = view;
  }

  public setSpace(event: any): void{
    const selectedOptionId = event.target.value;
    const selectedOption = document.querySelector(`[value="${selectedOptionId}"]`);
    if (selectedOption) {
      const optionId = selectedOption.getAttribute('id') as string;
      const toAssing =  this.spacesList.filter(space => space.id_space === Number(optionId));
      this.selectedSpace = {
        id_space: toAssing[0].id_space,
        name: toAssing[0].name,
        fee: toAssing[0].fee,
        note: toAssing[0].note
      };
    }
  }

  private validateInputs(): boolean {
    console.log(this.bookingData.date_booking);
    console.log(this.bookingData.hour_start);
    console.log(this.bookingData.hour_end);

    if(this.bookingData.date_booking === "" ||
      this.bookingData.hour_start === "" ||
      this.bookingData.hour_end === ""){
      const modal = document.querySelector('#infoModal') as HTMLElement;
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
      return false;
    }
    return true;
  }

  public createBooking(): void {
    if(this.validateInputs()){
      const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
      if('infoUser' in decode_token){
        const infoUser =  decode_token.infoUser as Array<object>;
        if('id_usuario' in infoUser[0]){
          const url = this.routesList.getCreateBooking();
          const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          });
          const data = {
            space_id: this.selectedSpace.id_space,
            client_id: infoUser[0].id_usuario,
            date_booking: this.bookingData.date_booking,
            hour_start: this.bookingData.hour_start,
            hour_end: this.bookingData.hour_end,
            note: this.bookingData.note
          }
          this.http.post(url, data, { headers }).subscribe((data) => {
            if('message' in data){
              if(data.message == "0"){
                this.view = 2;
              }else{
                alert("Error al realizar la reserva");
              }
            }

          });
        }
      }
    }
  }

  public doBooking(campus: Campus): void{
    this.view = 1;
    this.selectedCampus = campus;
    this.spacesList = [];
    this.initSpaceList();
  }

  private async initSpaceList(): Promise<any>{
    return new Promise<any>((req, res) => {
      const url = this.routesList.getSpacesPerCampusList();
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      let data = {
        headquarter_id: this.selectedCampus.campus_id
      }
      this.http.post(url, data, { headers }).subscribe((data) => {
        const dataArray = data as Array<any>;
        dataArray.forEach(space => {
          this.spacesList.push({
            id_space: space.id_espacio,
            name: space.nombre,
            fee: space.tarifa,
            note: space.descripcion,
          });
        });
        if(this.spacesList){
          this.selectedSpace = this.spacesList[0];
        }
        req(true);
      });
    });
  }

  loadCampusOnDatabase(){
    const url = this.routesList.getCampusList();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('rol' in infoUser[0]){
        const rol = infoUser[0].rol;
        this.http.get(url, {headers}).subscribe(response => {
          const campus = response as Array<string>;
          campus.forEach(n => {
              const info_campus = n as Object;
              if('nombre_sede' in info_campus && 'descripcion' in info_campus && 'direccion' in info_campus
              && 'id_sede' in info_campus){
                const url = this.routesList.getQuantitySpacesPerCampus();
                const data = {
                  headquarter_id: info_campus.id_sede,
                  rol: rol
                }
                this.http.post(url, data, {headers}).subscribe(res => {
                  const xd = res as Array<string>;
                  xd.forEach(j => {
                    const xdd = j as Object;
                    if('quantity' in xdd){
                      const newCampus: Campus = {
                        name: info_campus.nombre_sede as string,
                        description: info_campus.descripcion as string,
                        quantity_spaces: xdd.quantity as number,
                        address: info_campus.direccion as string,
                        campus_id: info_campus.id_sede as number,
                        schedules: []
                      }
                      this.loadIdCampus(newCampus as Campus);
                    }
                  });
                });
              }
          });
        });
      }
    }
  }

  loadIdCampus(newCampus: Campus){
    const url = this.routesList.getScheduleCampus();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const data = {
      id_headquarter: newCampus.campus_id
    };
    this.http.post(url, data, { headers }).subscribe((data) => {
      const campus_schedule = data as Array<any>;
      campus_schedule.forEach(n => {
        const hora_apertura_am = n.hora_apertura_am as string;
        const hora_cierre_am = n.hora_cierre_am as string;
        const hora_apertura_pm = n.hora_apertura_pm as string;
        const hora_cierre_pm = n.hora_cierre_pm as string;
        const newschedule = {
          day: n.dia,
          first_open: hora_apertura_am.slice(0, -3),
          first_close: hora_cierre_am.slice(0, -3),
          second_open: hora_apertura_pm.slice(0, -3),
          second_close: hora_cierre_pm.slice(0, -3),
        };
        newCampus.schedules.push(newschedule);
      });
      this.sortDays(newCampus);
    });
  }

  sortDays(newCampus: Campus){
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    newCampus.schedules.sort((a,b) => days.indexOf(a.day) - days.indexOf(b.day));
    this.campus_list.push(newCampus as Campus);
  }

  public showModal(): void{
    const modal = document.querySelector('#infoModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

}
