import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutesListService {

  //Ruta principal
  private route = 'https://elcamellobackend-production.up.railway.app';

  //Cuenta
  private login = this.route+'/api/user/login';
  private changePass = this.route+'/api/user/changepass';
  private recoverPass = this.route+'/api/user/recovery';

  //Usuarios
  private createUser = this.route+'/api/user/register';
  private deleteUser = this.route+'/api/user/delete';
  private deleteUserAdmin = this.route+'/api/user/ad/delete';
  private modifyUser = this.route+'/api/user/modify';
  private validUser = this.route+'/api/user/validUser';
  private searchUser = this.route+'/api/user/search';
  private userList = this.route+'/api/user/list';

  //Sedes
  private createCampus = this.route+'/api/headquearters/create';
  private deleteCampus = this.route+'/api/headquarters/delete';
  private campusList = this.route+'/api/headquarters/list';
  private modifyCampus = this.route+'/api/headquarters/modify';
  private departments = this.route+'/api/headquarters/departments/list';
  private cities = this.route+'/api/headquearters/cities/search';

  //Inventario
  private inventaryList = this.route+'/api/inventary/list';
  private createInventory = this.route+'/api/inventary/create';
  private searchInventory = this.route+'/api/inventary/search';
  private createProduct = this.route+'/api/inventary/product/add';
  private productList = this.route+'/api/inventary/product/list';
  private deleteProduct = this.route+'/api/inventary/product/delete';
  private filterProductByInventory = this.route+'/api/inventary/product/filter';

  //Espacios
  private createSpace = this.route+'/api/spaces/add';
  private quantitySpacesPerCampus = this.route+'/api/headquarters/spaces/quantity';
  private spacesPerCampusList = this.route+'/api/spaces/list/headquarter';

  //Horarios
  private createSchedule = this.route+'/api/schedules/createSchedule';
  private deleteSchedule = this.route+'/api/schedules/deleteSchedule';
  private scheduleCampus = this.route+'/api/headquarters/searchSchedules';

  //Reservas
  private modifyBooking = this.route+'/api/booking/modify';
  private deleteBooking = this.route+'/api/booking/delete';
  private createBooking = this.route+'/api/booking/make';
  private bookingList = this.route+'/api/booking/list';
  private bookingListWithIdClient = this.route+'/api/booking/list/me';
  private changeBillState = this.route+'/api/booking/bill/pay';

  //Facturas
  private searchBill = this.route+'/api/booking/bill/search';

  //Reportes
  private clientQuantityPerHeadquarter = this.route+'/api/reports/1';
  private moneyPerHeadquarter = this.route+'/api/reports/2';
  private bookingPerMonth = this.route+'/api/reports/3';
  private spacesPerHeadquarter = this.route+'/api/reports/4';
  private avgPerUsersAge = this.route+'/api/reports/5';
  private quantityBillState = this.route+'/api/reports/6';
  private inventaryValuePerHeadquarter = this.route+'/api/reports/7';

  getChangeBillState(): string{
    return this.changeBillState;
  }

  getSearchBill(): string{
    return this.searchBill;
  }

  getBookingListWithIdClient(): string{
    return this.bookingListWithIdClient;
  }

  getInventaryValuePerHeadquarter(): string{
    return this.inventaryValuePerHeadquarter;
  }

  getQuantityBillState(): string{
    return this.quantityBillState;
  }

  getAvgPerUsersAge(): string{
    return this.avgPerUsersAge;
  }

  getBookingPerMonth(): string{
    return this.bookingPerMonth;
  }

  getClientQuantityPerHeadquarter(): string{
    return this.clientQuantityPerHeadquarter;
  }

  getSpacesPerHeadquarter(): string{
    return this.spacesPerHeadquarter;
  }

  getMoneyPerHeadquarter(): string{
    return this.moneyPerHeadquarter;
  }

  getModifyBooking(): string{
    return this.modifyBooking;
  }

  getDeleteBooking(): string{
    return this.deleteBooking;
  }

  getBookingList(): string{
    return this.bookingList;
  }

  getFilterProductByInventory(): string{
    return this.filterProductByInventory;
  }

  getInventaryList(): string{
    return this.inventaryList;
  }

  getRecoverPass(): string{
    return this.recoverPass;
  }

  getDeleteProduct(): string{
    return this.deleteProduct;
  }

  getSearchInventory(): string{
    return this.searchInventory;
  }

  getCreateProduct(): string{
    return this.createProduct;
  }

  getCreateSchedule(): string{
    return this.createSchedule;
  }

  getDeleteSchedule(): string{
    return this.deleteSchedule;
  }

  getCreateInventory(): string{
    return this.createInventory;
  }

  getCreateSpace(): string{
    return this.createSpace;
  }

  getCreateCampus(): string{
    return this.createCampus;
  }

  getCities(): string{
    return this.cities;
  }

  getProductList(): string{
    return this.productList;
  }

  getDepartments(): string{
    return this.departments;
  }

  getLogin(): string{
    return this.login;
  }

  getDeleteUser(): string{
    return this.deleteUser;
  }

  getChangePass(): string{
    return this.changePass;
  }

  getDeleteCampus(): string{
    return this.deleteCampus;
  }

  getScheduleCampus(): string{
    return this.scheduleCampus;
  }

  getQuantitySpacesPerCampus(): string{
    return this.quantitySpacesPerCampus;
  }

  getModifyCampus(): string{
    return this.modifyCampus;
  }

  getCreateUser(): string{
    return this.createUser;
  }

  getDeleteUserAdmin(): string{
    return this.deleteUserAdmin;
  }

  getModifyUser(): string{
    return this.modifyUser;
  }

  getSearchUser(): string{
    return this.searchUser;
  }

  getValidUser(): string{
    return this.validUser;
  }

  getSpacesPerCampusList(): string{
    return this.spacesPerCampusList;
  }

  getUserList(): string{
    return this.userList;;
  }

  getCampusList(): string{
    return this.campusList;
  }

  getCreateBooking(): string{
    return this.createBooking;
  }
}
