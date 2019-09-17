import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    constructor(private authService: AuthenticationService) {}

    login() {
      this.authService.getRequestToken().subscribe(res=>{
        console.log(`Token Received ${res}`);
        if (res && res.oauth_callback_confirmed){
          this.authService.login(res.oauth_token);
        }
      }, err=>console.log(err));
    }

}
