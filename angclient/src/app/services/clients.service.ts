import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
// import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  public jwtToken: string;
  private mainapihosturl = environment.mainApiHostUrl;

  constructor(private http: Http) {
    const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
    if (theUser) {
      this.jwtToken = theUser.token;
    }
  }

  saveClient(userid, oBodyparam) {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.jwtToken}`);
        const options = new RequestOptions({ headers: headers });

        return this.http.post(this.mainapihosturl + `client/${userid}`, JSON.stringify(oBodyparam), options)
            .pipe(map((response: Response) => response.json()),
            catchError(this.handleError));
  }

  updateClient(userid, oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.mainapihosturl + `client/${userid}`, JSON.stringify(oBodyparam), options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  deleteClient(id) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.delete(this.mainapihosturl + `client/${id}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getClient(id) {

     const headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', `${this.jwtToken}`);
     const options = new RequestOptions({ headers: headers });

     return this.http.get(this.mainapihosturl + `client/${id}`, options)
         .pipe(map((response: Response) => response.json()),
         catchError(this.handleError));
   }

   getClientAggList(oBodyparam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainapihosturl + `listaggclients`, JSON.stringify(oBodyparam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getClientAgg(id) {

     const headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Authorization', `${this.jwtToken}`);
     const options = new RequestOptions({ headers: headers });

     return this.http.get(this.mainapihosturl + `getaggclient/${id}`, options)
         .pipe(map((response: Response) => response.json()),
         catchError(this.handleError));
  }

  getActiveclient(oBodyParam) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.mainapihosturl}listactiveclients`, JSON.stringify(oBodyParam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  private handleError(error: Response) {
    const stdErrMsg = `Ooops sorry...a server error occured. Please try again shortly. <br>`;
    const errMsg = error.status ? `${stdErrMsg} ${'Error: &nbsp;' + error.status} - ${error.statusText}` : stdErrMsg;

    return throwError(errMsg);
  }
}
