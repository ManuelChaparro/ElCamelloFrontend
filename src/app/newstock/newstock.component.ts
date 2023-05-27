import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { RoutesListService } from '../routes-list.service';

interface stockObject{
  id: number,
  name: string,
  brand: string,
  type: string,
  description: string,
  price: number
}

@Component({
  selector: 'app-newstock',
  templateUrl: './newstock.component.html',
  styleUrls: ['./newstock.component.css']
})
export class NewstockComponent {

  public campus_list: Iterable<any> | null | undefined;
  public countObjs: number;
  public stockName: string;
  public stockType: string;
  public stockDescription: string;
  public stockBrand: string;
  public stockPrice: number | undefined;
  public listStock: Array<stockObject>;
  public campus_selected: string | null | undefined;
  public campus_selected_id: number | null | undefined;

  constructor(private http: HttpClient, private routesList: RoutesListService){
    this.countObjs = 1;
    this.stockName = '';
    this.stockType = 'Mueble';
    this.stockDescription = '';
    this.stockPrice = undefined;
    this.listStock = [];
    this.stockBrand = '';
    this.campus_selected = undefined;
    this.campus_list = undefined;
  }

  private ngOnInit(){
    this.initCampusList();
  }

  addObjToStock(){
    if(this.validations()){
      this.createProduct();
      this.listStock?.push({ id: this.countObjs,name: this.stockName, brand: this.stockBrand, type: this.stockType, description: this.stockDescription, price: this.stockPrice as number});
      this.countObjs++;
      this.showNotification(this.stockName);
      this.clearInputs();
    }else{
      const modal = document.querySelector('#myModal') as HTMLElement;
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  private showNotification(stockName: string): void{
    const notification = document.querySelector('#notification') as HTMLElement;
    const notification_name = document.querySelector('#notification_name') as HTMLSpanElement;
    notification_name.innerText = stockName;
    notification.classList.remove('d-none');
    setTimeout(() => {
      notification.classList.add('d-none');
    }, 5000);
  }

  private createProduct(): void{
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser = decode_token.infoUser as Array<object>;
      if('rol' in infoUser[0] && 'id_usuario' in infoUser[0]){
        const rol = infoUser[0].rol;
        const id_usuario = infoUser[0].id_usuario;
        const url = this.routesList.getCreateProduct();
        const data = {
          product_name: this.stockName,
          product_type: this.stockType,
          product_brand: this.stockBrand,
          product_description: this.stockDescription,
          product_value: this.stockPrice,
          inventary_id: this.campus_selected_id,
          space_id: null,
          id_user: id_usuario,
          rol: rol
        }
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        });
        this.http.post(url, data, { headers }).subscribe((data) => {});
      }
    }
  }

  private getInventoryId(){
    const url = this.routesList.getSearchInventory();
    const data = {
      headquarter_id: this.campus_selected
    }
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    this.http.post(url, data, { headers }).subscribe((data) => {
      const auxData = data as Array<string>;
      const xd = auxData[0] as Object;
      if('id_inventario' in xd){
        this.campus_selected_id = xd.id_inventario as number;
      }
    });
  }

  clearInputs(){
    const name = document.querySelector('#stock-name') as HTMLInputElement;
    const description = document.querySelector('#stock-description') as HTMLInputElement;
    const price = document.querySelector('#stock-price') as HTMLInputElement;
    name.value = '';
    description.value = '';
    price.value = '';
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
      if('id_sede' in ultimoElemento){
        this.campus_selected = ultimoElemento.id_sede;
        this.getInventoryId();
      }
    });
  }

  changeCampusSelect(){
    const selectCampus = document.querySelector('#select_campus') as HTMLSelectElement;
    this.campus_selected = selectCampus.value.split(' - ')[0];
    this.getInventoryId();
  }

  validations(): boolean{
    let toReturn: boolean = true;
    const labelName = document.querySelector('#warn-name') as HTMLElement;
    const labelDescription = document.querySelector('#warn-description') as HTMLElement;
    const labelPrice = document.querySelector('#warn-price') as HTMLElement;
    if(this.stockName == ''){
      labelName.style.display = '';
      toReturn = false;
    }
    if(this.stockDescription == ''){
      labelDescription.style.display = '';
      toReturn = false;
    }
    if(this.stockPrice == 0 || this.stockPrice === undefined){
      labelPrice.style.display = '';
      toReturn = false;
    }
    return toReturn;
  }

  deleteObjList(id: string){
    const newId = parseInt(id);
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('rol' in infoUser[0] && 'id_usuario' in infoUser[0]){
        const url = this.routesList.getDeleteProduct();
        const data = {
          id_user: infoUser[0].id_usuario,
          id_product: newId,
          rol: infoUser[0].rol,
        };
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        });
        this.http.post(url, data, {headers}).subscribe(response => {
          console.log(response);

          if('message' in response && response.message === '0'){
            let indice: number = this.listStock.findIndex(obj => obj.id == newId);
            if(indice != undefined){
              this.listStock.splice(indice, 1);
            }
            this.sortListStock();
          }else{
            alert("Error en eliminación");
          }
        });
      }
    }
  }

  verifyInput(value: number){
    const labelName = document.querySelector('#warn-name') as HTMLElement;
    const labelDescription = document.querySelector('#warn-description') as HTMLElement;
    const labelPrice = document.querySelector('#warn-price') as HTMLElement;
    const labelBrand = document.querySelector('#warn-brand') as HTMLElement;
    if(value === 0){
      if(this.stockName != ''){
        labelName.style.display = 'none';
      }
    }else if(value === 1){
      if(this.stockDescription != ''){
        labelDescription.style.display = 'none';
      }
    }else if(value === 3){
      if(this.stockBrand != ''){
        labelBrand.style.display = 'none';
      }
    }else if(value === 2){
      if(this.stockPrice != 0){
        labelPrice.style.display = 'none';
      }
    }
  }

  sortListStock(){
    this.listStock.sort((a, b) => a.id - b.id);
  }

  changeStockType(value:string): void{
    this.stockType = value;
  }
}
