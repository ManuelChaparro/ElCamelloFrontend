import { Component } from '@angular/core';
import { BookingslistComponent } from '../bookingslist/bookingslist.component';
import { NewbookingComponent } from '../newbooking/newbooking.component';

@Component({
  selector: 'app-adminbookings',
  templateUrl: './adminbookings.component.html',
  styleUrls: ['./adminbookings.component.css']
})
export class AdminbookingsComponent {
  componentes = [
    { nombre: 'Componente 1', componente: BookingslistComponent},
    { nombre: 'Componente 2', componente: NewbookingComponent}
  ];
  indiceComponenteActual = 0;
  cambiarComponente(indice: number) {
    this.indiceComponenteActual = indice;
  }

}
