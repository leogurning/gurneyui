import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
// import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public jwtToken: string;
  private mainapihosturl = environment.mainApiHostUrl;

  constructor(private http: Http) {
    const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
    if (theUser) {
      this.jwtToken = theUser.token;
    }
  }

  registerClient(oUser) {
    const headers = new Headers ({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
     return this.http.post(this.mainapihosturl + 'registerClient', JSON.stringify(oUser), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  recvemailverification(hash) {
    const headers = new Headers ({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
     return this.http.get(this.mainapihosturl + `rcvemailverification?id=${hash}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  pageverification(hash) {
    const headers = new Headers ({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
     return this.http.get(this.mainapihosturl + `pgverification?id=${hash}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  sendResetPassword(oBodyparam) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `sendresetpwd`, JSON.stringify(oBodyparam), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  resetPassword(oBodyparam) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `resetpassword`, JSON.stringify(oBodyparam), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  getUser(userid) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.mainapihosturl + `user/${userid}`, options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  updateUser(userid, oUser) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `user/${userid}`, JSON.stringify(oUser), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  updatePhoto(userid, oUser) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `userphoto/${userid}`, JSON.stringify(oUser), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  updatePassword(userid, oUser) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `password/${userid}`, JSON.stringify(oUser), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  getUserAddressAgg(userid, oUser) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `listagguseraddress/${userid}`, JSON.stringify(oUser), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  saveUserAddress(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `useraddress/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  updateUserAddress(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `useraddress/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  deleteUserAddress(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `deluseraddress/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getUserAddress(addressid) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.mainapihosturl + `useraddress/${addressid}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getUserContactnoAgg(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `listaggusercontactno/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  saveUserContactno(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `usercontactno/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));

  }

  getUserContactno(contactid) {

     const headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', `${this.jwtToken}`);
     const options = new RequestOptions({ headers: headers });

     return this.http.get(this.mainapihosturl + `usercontactno/${contactid}`, options)
         .pipe(map((response: Response) => response.json()),
         catchError(this.handleError));
   }

   updateUserContactno(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `usercontactno/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  deleteUserContactno(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `delusercontactno/${userid}`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  changeUserphoto(userid, oBodyparam) {

      const headers = new Headers();
      headers.append('Authorization', `${this.jwtToken}`);
      const options = new RequestOptions({ headers: headers });

      return this.http.post(`${this.mainapihosturl}changeuserphoto/${userid}`, oBodyparam, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  private handleError(error: Response) {
    const stdErrMsg = `Ooops sorry...a server error occured. Please try again shortly. <br>`;
    const errMsg = error.status ? `${stdErrMsg} ${'Error: &nbsp;' + error.status} - ${error.statusText}` : stdErrMsg;

    return throwError(errMsg);
  }
}
