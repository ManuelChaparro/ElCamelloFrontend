import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RoutesListService } from '../routes-list.service';

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.component.html',
  styleUrls: ['./recover-pass.component.css']
})
export class RecoverPassComponent {
  public email: string;
  public document: number | undefined;

  constructor(private http: HttpClient, private router: Router, private routesList: RoutesListService){
    this.email = '';
    this.document = undefined;
  }

  public sendRecovery(){
    if(this.validations()){
      const url = this.routesList.getRecoverPass();
      const data = {
        email: this.email,
        identificacion: this.document
      };
      this.http.post(url, data).subscribe(response => {
        if('message' in response){
          if(response.message == '0'){
            const div_info = document.querySelector('#div_info') as HTMLElement;
            const notice_recovery = document.querySelector('#notice_recovery') as HTMLElement;
            div_info.classList.add('d-none');
            notice_recovery.classList.remove('d-none');
            timer(1500).pipe(delay(1500)).subscribe(() => {
              const routing = document.querySelector('.routing') as HTMLElement;
              routing.innerHTML = '3';
              timer(0).pipe(delay(900)).subscribe(() => {
                routing.innerHTML = '2';
                timer(0).pipe(delay(900)).subscribe(() => {
                  routing.innerHTML = '1';
                  timer(0).pipe(delay(900)).subscribe(() => {
                    this.router.navigate(['/login']);
                  });
                });
              });
            });
          }else{
            console.log(response);
          }
        }
      });
    }
  }

  animationEmail(){
    const icon = document.querySelector('#email-icon') as HTMLElement;
    icon.classList.add('fa-spin');
  }

  animationDoc(){
    const icon = document.querySelector('#doc-icon') as HTMLElement;
    icon.classList.add('fa-spin');
  }

  public validations(){
    const warn_email = document.querySelector('.warn_email') as HTMLElement;
    const email_test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email_test.test(this.email)){
      warn_email.style.display = 'none';
      return true;
    }else{
      warn_email.style.display = 'flex';
      return false;
    }
  }

}
