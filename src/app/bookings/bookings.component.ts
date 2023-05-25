import { Component } from '@angular/core';
import { RoutesListService } from '../routes-list.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import jwt_decode from 'jwt-decode';
import { formatDate } from '@angular/common';

interface Booking{
  booking_id: number,
  space_id: number,
  client_id: number,
  date_booking: string,
  hour_start: string,
  hour_end: string,
  note: string
  value: number,
  state: string
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})

export class BookingsComponent {

  public bookingList: Array<Booking>;
  private bookingIdToDelete: number;
  public bookingToModify: Booking;
  public actualDate: string;
  public actualHour: string;

  constructor(private http: HttpClient, private routesList: RoutesListService){
    this.actualDate = this.getMinDate();
    this.actualHour = this.getMinHour();
    this.bookingList = [];
    this.bookingIdToDelete = -1;
    this.setList();
    this.bookingToModify = {
      booking_id: -1,
      space_id: -1,
      client_id: -1,
      date_booking: "",
      hour_start: "",
      hour_end: "",
      note: "",
      value: -1,
      state: ""
    };
  }

  public setSpace(event: any): void{
    const selectedOptionId = event.target.value;
    const selectedOption = document.querySelector(`[value="${selectedOptionId}"]`);
    if (selectedOption) {
      const optionId = selectedOption.getAttribute('id') as any;
      this.bookingToModify.space_id = optionId as number;
    }
  }

  public modalDelete(bookingId: number): void{
    const modal = document.querySelector('#modalDelete') as HTMLElement;
    const spanDelete = document.querySelector('#modalDeleteValue') as HTMLElement;
    spanDelete.innerHTML = bookingId.toString();
    this.bookingIdToDelete = bookingId;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
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

  public deleteBooking(): void{
    const url = this.routesList.getDeleteBooking();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const data = {
      booking_id: this.bookingIdToDelete
    }
    this.http.post(url, data, { headers }).subscribe((response) => {
      if('message' in response){
        if(response.message === '0'){
          this.bookingList = this.bookingList.filter((booking) => booking.booking_id != this.bookingIdToDelete);
          const notification = document.querySelector('#deleteBkngNtf') as HTMLElement;
          const notification_name = document.querySelector('#deleteBookingSpan') as HTMLSpanElement;
          notification_name.innerText = this.bookingIdToDelete.toString();
          notification.classList.add('show');
          setTimeout(() => {
            notification.classList.remove('show');
          }, 5000);
          this.bookingIdToDelete = -1;
        }
      }

    });
  }

  private setList(): void{
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('id_usuario' in infoUser[0]){
        const data ={
          client_id: infoUser[0].id_usuario
        }
        this.post(this.routesList.getBookingListWithIdClient(), data)
        .then(res => {
          const data = res as Array<any>;
          if(data){
            data.forEach(booking => {
              const toSend = {
                booking_id: booking.id_reserva
              }
              this.post(this.routesList.getSearchBill(), toSend).then(res => {
                const newBooking: Booking = {
                  booking_id: booking.id_reserva,
                  space_id: booking.id_espacio,
                  client_id: booking.id_usuario,
                  date_booking: booking.fecha.split("T")[0],
                  hour_start: booking.hora_entrada,
                  hour_end: booking.hora_salida,
                  note: booking.notas,
                  value: res[0].valor_pago,
                  state: res[0].estado
                }
                this.bookingList.push(newBooking);
              });
            });
          }
        })
        .catch(rej => {
          console.log(rej);
        });
      }
    }
  }

  public showModifyModal(booking: Booking): void{
    this.bookingToModify = booking;
    const modal = document.querySelector('#modifyModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

  public modifyBooking(): void{
    const data = {
      booking_id: this.bookingToModify.booking_id,
      space_id: this.bookingToModify.space_id,
      date_booking: this.bookingToModify.date_booking,
      hour_start: this.bookingToModify.hour_start,
      hour_end: this.bookingToModify.hour_end,
      note: this.bookingToModify.note
    }
    this.put(this.routesList.getModifyBooking(), data)
    .then(res => {
      if('message' in res){
        if(res.message == '0'){
          location.reload();
        }else{
          alert("Error al modificar la reserva")
        }
      }
    })
    .catch(rej => {
      console.log(rej);
    });
  }

  private post(url: string, data: Object):Promise<any>{
    return new Promise<any>((res, rej) => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.post(url, data, {headers}).subscribe(response => {
        if(response){
          res(response);
        }else{
          rej("Error al realizar la consulta");
        }
      });
    });
  }

  private put(url: string, data: Object):Promise<any>{
    return new Promise<any>((res, rej) => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.put(url, data, {headers}).subscribe(response => {
        if(response){
          res(response);
        }else{
          rej("Error al realizar la consulta");
        }
      });
    });
  }

}
