import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
// import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FiletransferService {
  public jwtToken: string;
  private mainapihosturl = environment.mainApiHostUrl;

  constructor(private http: Http) {
    const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
    if (theUser) {
      this.jwtToken = theUser.token;
    }
  }

  uploadInputFile(oBodyparam) {

    const headers = new Headers();
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.mainapihosturl}inputfileupload`, oBodyparam, options)
      .pipe(map((response: Response) => response.json()),
      catchError(this.handleError));
  }

  deleteInputFile(oBodyparam) {

    const headers = new Headers();
    headers.append('Authorization', `${this.jwtToken}`);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.mainapihosturl}inputfiledelete`, oBodyparam, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  private handleError(error: Response) {
    const stdErrMsg = `Ooops sorry...a server error occured. Please try again shortly. <br>`;
    const errMsg = error.status ? `${stdErrMsg} ${'Error: &nbsp;' + error.status} - ${error.statusText}` : stdErrMsg;

    return throwError(errMsg);
  }
}
