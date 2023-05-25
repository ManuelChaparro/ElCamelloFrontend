import { Component } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import * as bootstrap from 'bootstrap';
import { RoutesListService } from '../routes-list.service';

interface Stock{
  name: string,
  listProducts: Product[]
}

interface Product{
  id: number,
  name: string,
  brand: string,
  type: string,
  price: number
}

@Component({
  selector: 'app-stocklist',
  templateUrl: './stocklist.component.html',
  styleUrls: ['./stocklist.component.css']
})
export class StocklistComponent {
  public stockList: Array<Stock>;
  private idProductDelete: number;
  private rol: string;
  private id_user: number;

  ngOnInit(){
    this.loadStockList();
  }

  constructor(private http: HttpClient, private routesList: RoutesListService){
    this.stockList = [];
    this.idProductDelete = 0;
    this.rol = '';
    this.id_user = 0;
  }

  private loadStockList(): void{
    const decode_token: object = jwt_decode(JSON.stringify(localStorage.getItem('token')));
    if('infoUser' in decode_token){
      const infoUser =  decode_token.infoUser as Array<object>;
      if('rol' in infoUser[0] && 'id_usuario' in infoUser[0]){
        const url = this.routesList.getInventaryList();
        this.rol = infoUser[0].rol as string
        this.id_user = infoUser[0].id_usuario as number;
        const data = {
          rol: this.rol,
        };
        const headers = new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        });
        this.http.post(url, data, {headers}).subscribe(response => {
          console.log(response);

          this.addListProducts(response as Array<any>);
        });
      }
    }

  }

  private addListProducts(stock: Array<any>): void{
      stock.forEach(stock => {
      const newStock: Stock = {name: stock.nombre_sede, listProducts: []};
      const url = this.routesList.getFilterProductByInventory();
      const data = {
        inventary_id: stock.id_inventario,
        rol: this.rol,
      };
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      this.http.post(url, data, {headers}).subscribe(response => {
        const products = response as Array<any>;
        products.forEach(product => {
          const newProduct: Product = {
            id: product.id_producto,
            name: product.nombre_producto,
            brand: product.marca,
            type: product.tipo_producto,
            price: product.valor_producto};
          newStock.listProducts.push(newProduct);
        });
        this.stockList?.push(newStock);
      });
    });

  }

  public confirmDeleteProduct(id_product: string): void{
    const modal = document.querySelector('#deleteModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    this.idProductDelete = parseInt(id_product);
  }

  public deleteProduct(): void{
    const url = this.routesList.getDeleteProduct();
    const data = {
      id_user: this.id_user,
      id_product: this.idProductDelete,
      rol: this.rol,
    };
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    this.http.post(url, data, {headers}).subscribe(response => {
      if('message' in response && response.message === '0'){
        this.stockList = [];
        this.loadStockList();
      }else{
        alert("Error en eliminación");
      }
    });
  }
}
