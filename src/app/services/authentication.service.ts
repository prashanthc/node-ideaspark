import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

const SERVICE_URL = 'http://localhost:8080/api/v1';
const LOGIN_URL = 'https://api.twitter.com/oauth/authenticate';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<any>

  public currentUserObject: Observable<any>;

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUserObject = this.currentUserSubject.asObservable();
  }

  getRequestToken(): Observable<any> {
    return this.http.post(`${SERVICE_URL}/auth/twitter/reverse`, {});
  }

  login(token) {
    window.open(`${LOGIN_URL}?oauth_token=${token}`, 'myWindow');//, "_blank", "left=500,width=600,height=700"

  }
}
