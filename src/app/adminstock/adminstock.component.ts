import { Component } from '@angular/core';
import { StocklistComponent } from '../stocklist/stocklist.component';
import { NewstockComponent } from '../newstock/newstock.component';


@Component({
  selector: 'app-adminstock',
  templateUrl: './adminstock.component.html',
  styleUrls: ['./adminstock.component.css']
})
export class AdminstockComponent {
  componentes = [
    { nombre: 'Componente 1', componente: StocklistComponent},
    { nombre: 'Componente 2', componente: NewstockComponent}
  ];
  indiceComponenteActual = 0;
  cambiarComponente(indice: number) {
    this.indiceComponenteActual = indice;
  }
}
