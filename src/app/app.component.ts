import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-ideaspark';

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
