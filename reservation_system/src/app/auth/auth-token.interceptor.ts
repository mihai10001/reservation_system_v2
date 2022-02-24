import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Storage } from '@capacitor/storage';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handle(request, next));
  }

  async handle(request: HttpRequest<any>, next: HttpHandler) {
    const { value } = await Storage.get({ key: 'authData' });
    const authRequest = request.clone({
      setHeaders: {
        // RandomAuthorization: "Bearer " + JSON.parse(value).token
      }
    });
    return next.handle(authRequest).toPromise()
  }
}