import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

import { Storage } from '@capacitor/storage';
import { BehaviorSubject } from 'rxjs';
import { User } from '../main-layout/models/user.model';

interface AuthenticationResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  get userIsAuthenticated() {
    let user = this._user.value;
    if (user && (new Date() <= user.tokenExpirationDate))
      return !!user.token;
    else
      return false;
  }

  get getUserId() {
    let user = this._user.value;
    return user ? user.id : '';
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(email: string, password: string) {
    return this.http.post<AuthenticationResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseConfig.apiKey}`
      , { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthenticationResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`
      , { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
    Storage.remove({ key: 'authData' });
    this.router.navigateByUrl('/');
  }

  private setUserData(userData: AuthenticationResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
    this.router.navigateByUrl('/discover-places');
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Storage.set({ key: 'authData', value: data });
  }
}
