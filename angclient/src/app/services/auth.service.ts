import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
// import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private mainapihosturl = environment.mainApiHostUrl;
  public currentUser: any;

  constructor(private http: Http) { }

  isLoggedIn(): boolean {
    try {
        const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
        /* var theUser: any;
        setTimeout( theUser = JSON.parse(localStorage.getItem('currentUser')), 100);  */
        if (theUser) {
            this.currentUser = theUser.user;
        }
    } catch (e) {
        return false;
    }
    return !!this.currentUser;
  }

  login(oUser) {
    const headers = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.mainapihosturl + 'login', JSON.stringify(oUser), options)
    .pipe(tap((response: Response) => {
        if (response.json().success) {
            this.currentUser = response.json().message;
            const userObj: any = {};
            userObj.user = response.json().message;
            userObj.token = response.json().token;

            localStorage.setItem('currentUser', JSON.stringify(userObj));
        }
        response.json();
    }), catchError(this.handleError));
  }

  logout(): void {
    this.currentUser = null;
    // setTimeout(localStorage.removeItem('currentUser'),100);
    localStorage.removeItem('currentUser');
    // Clear storage after specific time
    // var logoutTimer = setTimeout(localStorage.clear(), 100);
    localStorage.clear();
  }

  private handleError(error: Response) {
    const stdErrMsg = `Ooops sorry...a server error occured. Please try again shortly. <br>`;
    const errMsg = error.status ? `${stdErrMsg} ${'Error: &nbsp;' + error.status} - ${error.statusText}` : stdErrMsg;

    return throwError(errMsg);
  }
}
