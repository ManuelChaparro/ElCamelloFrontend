import { Component } from '@angular/core';
import { NewscheduleComponent } from '../newschedule/newschedule.component';

@Component({
  selector: 'app-adminschedule',
  templateUrl: './adminschedule.component.html',
  styleUrls: ['./adminschedule.component.css']
})
export class AdminscheduleComponent {
  componentes = [
    { nombre: 'Componente 1', componente: NewscheduleComponent}
  ];
  indiceComponenteActual = 0;
  cambiarComponente(indice: number) {
    this.indiceComponenteActual = indice;
  }
}
