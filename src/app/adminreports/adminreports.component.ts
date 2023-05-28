import { Component, AfterViewInit  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RoutesListService } from '../routes-list.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-adminreports',
  templateUrl: './adminreports.component.html',
  styleUrls: ['./adminreports.component.css']
})
export class AdminreportsComponent{

  campusList: Array<any> | undefined;
  frame: number;
  data: any[];

  //Grafico de Pastel
  view: [number, number];
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  titleGraphic: string;

  //Grafico de barras
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';

  //Compartidas
  gradient = false;
  showLegend = true;

  constructor(private routesList: RoutesListService,
    private http: HttpClient) {
    this.titleGraphic = "";
    this.frame = 0;
    this.data = [];
    this.view = [100,100]
    Object.assign(this.data);
    this.initCampusList();
  }

  onSelect(data: any): void {}

  onActivate(data: any): void {}

  onDeactivate(data: any): void {}

  public inventaryValuePerHeadquarter():void{
    this.frame = 1;
    this.getFetch(this.routesList.getInventaryValuePerHeadquarter())
    .then(res => this.data = res)
    .catch(rej => console.log(rej)
    );
    this.titleGraphic = "Valor de Inventarios";
    this.xAxisLabel = "Sedes"
    this.yAxisLabel = "Valor"
    this.getSizeGraphic(1);
  }

  public quantityBillState():void{
    this.frame = 1;
    this.getFetch(this.routesList.getQuantityBillState())
    .then(res => {this.data = res; console.log(this.data);
    })
    .catch(rej => console.log(rej)
    );
    this.titleGraphic = "Estado de Facturas";
    this.getSizeGraphic(0);
  }

  public getBookingPerMonth(): void{
    this.frame = 1;
    this.getFetch(this.routesList.getBookingPerMonth())
    .then(res => this.data = res)
    .catch(rej => console.log(rej)
    );
    this.getSizeGraphic(1);
    this.titleGraphic = "Reservas por Mes";
    this.xAxisLabel = "Meses"
    this.yAxisLabel = "Reservas"
  }

  public avgPerUsersAge():void{
    this.frame = 1;
    this.getFetch(this.routesList.getAvgPerUsersAge())
    .then(res => this.data = res)
    .catch(rej => console.log(rej)
    );
    this.titleGraphic = "Promedio de Edades";
    this.xAxisLabel = 'Edades';
    this.yAxisLabel = 'Personas';
    this.getSizeGraphic(1);
  }

  public moneyPerCampus(): void{
    this.frame = 1;
    this.getFetch(this.routesList.getMoneyPerHeadquarter())
    .then(res => this.data = res)
    .catch(rej => console.log(rej)
    );
    this.titleGraphic = "Ganancias por Sede";
    this.getSizeGraphic(0);
  }

  public modalSpacesPerCampus(){
    const modal = document.querySelector('#infoModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
  }

  public spacesPerCampus(): void{
    const select = document.querySelector('#campus') as HTMLSelectElement;
    const headquarter_id = select.value as string;
    const data = {
      headquarter_id: headquarter_id.split(" - ")[0]
    }
    this.frame = 1;
    this.postFetch(this.routesList.getSpacesPerHeadquarter(), data)
    .then(res => this.data = res)
    .catch(rej => console.log(rej)
    );
    this.titleGraphic = "Espacios por Sede";
    this.getSizeGraphic(0);
  }

  public getClientQuantityPerHeadquarter(): void{
    this.frame = 1;
    this.getFetch(this.routesList.getClientQuantityPerHeadquarter())
    .then(res => this.data = res)
    .catch(rej => console.log(rej)
    );
    this.titleGraphic = "Clientes por Sede";
    this.getSizeGraphic(0);
  }

  private getSizeGraphic(option: number): void{
    setTimeout(() => {
      const container = document.querySelector('#container') as HTMLElement;
      if(container){
        this.view = [container.offsetWidth-20, container.offsetHeight-20]
        const loading = document.querySelector('#loading') as HTMLElement;
        loading.style.display = 'none';
        const graphicPie = document.querySelector('#graphic-pie') as HTMLElement;
        const graphicBar = document.querySelector('#graphic-bar') as HTMLElement;
        if(option === 0){
          graphicPie.classList.remove('d-none');
          graphicBar.classList.add('d-none');
        }else{
          graphicPie.classList.add('d-none');
          graphicBar.classList.remove('d-none');
        }
      }else{}
    }, 2000);
  }

  async getFetch(url: string): Promise<Array<any>>{
    return new Promise<Array<any>>((res, rej) => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.get(url, { headers }).subscribe((response) => {
        if('message' in response){
          rej("Ocurrio un error al cargar los datos...");
        }else{
          res(response as Array<any>);
        }
      });
    });
  }

  async postFetch(url: string, data: Object): Promise<Array<any>>{
    return new Promise<Array<any>>((res, rej) => {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.post(url, data, { headers }).subscribe((response) => {
        if('message' in response){
          rej("Ocurrio un error al cargar los datos...");
        }else{
          res(response as Array<any>);
        }
      });
    });
  }

  private initCampusList(): void{
    const url = this.routesList.getCampusList();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    this.http.get(url, { headers }).subscribe((data) => {
      this.campusList = data as Array<any>;
    });
  }

  setFrame(frame: number): void{
    this.frame = frame;
  }
}
