import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { RoutesListService } from '../routes-list.service';

interface Booking{
  space_id: number,
  client_id: number,
  date_booking: string,
  hour_start: string,
  hour_end: string,
  note: string
}

@Component({
  selector: 'app-newbooking',
  templateUrl: './newbooking.component.html',
  styleUrls: ['./newbooking.component.css']
})
export class NewbookingComponent {

  public usersList: Array<any> | undefined;
  public campusList: Array<any> | undefined;
  public spacesList: Array<any> | undefined;
  public bookingData: Booking;
  public actualDate: string;
  public actualHour: string;

  constructor(private http: HttpClient, private routesList: RoutesListService){
    this.actualDate = this.getMinDate();
    this.actualHour = this.getMinHour();
    this.bookingData = {
      space_id: 0,
      client_id: 0,
      date_booking: "",
      hour_start: "",
      hour_end: "",
      note: ""
    }
  }

  ngOnInit(){
    this.initUsersList();
    this.initCampusList().then(res => this.initSpaceList(res).then(res => this.setSpaceAndUserOnInit(res)));
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

  private showNotification(): void{
    const notification = document.querySelector('#notification') as HTMLElement;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 5000);
  }

  public setSpace(event: any): void{
    const selectedOptionId = event.target.value;
    const selectedOption = document.querySelector(`[value="${selectedOptionId}"]`);
    if (selectedOption) {
      const optionId = selectedOption.getAttribute('id') as any;
      this.bookingData.space_id = optionId as number;
    }
  }

  public loadUser(event: any): void{
    const selectedOptionId = event.target.value as string;
    this.bookingData.client_id = parseInt(selectedOptionId.split(" |")[0]);
  }

  public async createBooking(): Promise<any>{
    if(this.bookingData.date_booking != "" && this.bookingData.hour_start != ""
    && this.bookingData.hour_end != ""){
      if(this.validateMinTime()){
        const url = this.routesList.getCreateBooking();
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        });
        const data = {
          space_id: this.bookingData.space_id,
          client_id: this.bookingData.client_id,
          date_booking: this.bookingData.date_booking,
          hour_start: this.bookingData.hour_start,
          hour_end: this.bookingData.hour_end,
          note: this.bookingData.note
        }
        console.log(data);

        this.http.post(url, data, { headers }).subscribe((data) => {
          if("message" in data){
            if(data.message === "3"){
              this.showNotificationError();
            }else if(data.message === "4"){
              alert("Error al crear la reserva")
            }else if(data.message === "0"){
              this.showNotification();
              this.clearInputs();
            }
          }
        });
      }else{
        this.showNotificationErrorTime();
      }
    }else{
      alert("Faltan datos")
    }
  }

  private clearInputs(): void{
    this.bookingData.date_booking = "";
    this.bookingData.hour_start = "";
    this.bookingData.hour_end = "";
    this.bookingData.note = "";
  }

  private validateMinTime(): boolean{
    const [horaInicio, minutoInicio] = this.bookingData.hour_start.split(':').map(Number);
    const [horaFin, minutoFin] = this.bookingData.hour_end.split(':').map(Number);
    const diferenciaMinutos = (horaFin - horaInicio) * 60 + (minutoFin - minutoInicio);
    return diferenciaMinutos >= 30;
  }

  private showNotificationError(): void{
    const notificationError = document.querySelector('#notification-error') as HTMLElement;
    const notification = document.querySelector('#notification') as HTMLElement;
    notification.classList.remove('show');
    notificationError.classList.add('show');
    setTimeout(() => {
      notificationError.classList.remove('show');
    }, 5000);
  }

  private showNotificationErrorTime(): void{
    const notificationError = document.querySelector('#notification-error-time') as HTMLElement;
    notificationError.classList.add('show');
    setTimeout(() => {
      notificationError.classList.remove('show');
    }, 5000);
  }

  private getMinDate(): string {
    const actualDate = new Date();
    return formatDate(actualDate, 'yyyy-MM-dd', 'en-US');
  }

  private getMinHour(): string {
    const actualDate = new Date();
    return actualDate.toISOString().substring(11, 16);
  }

  public loadSpaces(event: any): void{
    const selectedOptionId = event.target.value;
    const selectedOption = document.querySelector(`[value="${selectedOptionId}"]`);
    if (selectedOption) {
      const optionId = selectedOption.getAttribute('id') as string;

      this.initSpaceList(optionId);
    }
  }

  private async initSpaceList(id_campus: string): Promise<any>{
    return new Promise<any>((req, res) => {
      const url = this.routesList.getSpacesPerCampusList();
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      let data = {
        headquarter_id: id_campus
      }
      this.http.post(url, data, { headers }).subscribe((data) => {
        this.spacesList = data as Array<any>;
        this.bookingData.space_id = this.spacesList[0].id_espacio;
        req(true);
      });
    });
  }

  private setSpaceAndUserOnInit(res: any): void{
    if(this.spacesList){
      this.bookingData.space_id = this.spacesList[0].id_espacio;
    }
    if(this.usersList){
      this.bookingData.client_id = this.usersList[0].id_usuario;
    }
  }

  private async initUsersList(): Promise<any>{
    const url = this.routesList.getUserList();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    await this.http.get(url, { headers }).subscribe((data) => {
      const userResponse = data as Array<any>;
      this.usersList = userResponse.filter((user) => user.rol != "A");
    });
  }

  private initCampusList(): Promise<any>{
    return new Promise<any>((res, rej) => {
      const url = this.routesList.getCampusList();
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.get(url, { headers }).subscribe((data) => {
        this.campusList = data as Array<any>;
        res(this.campusList[0].id_sede);
      });
    });

  }

}
