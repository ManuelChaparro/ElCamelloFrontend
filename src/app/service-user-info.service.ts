import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ServiceUserInfoService {
  public name: string = '';
  public surname: string = '';

  public setName(name: string) {
    this.name = name;
  }

  public setSurname(name: string) {
    this.surname = name;
  }

  public getName(): string{
    return this.name;
  }

  public getSurname(): string{
    return this.surname;
  }
}
