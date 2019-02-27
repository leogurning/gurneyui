import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
// import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MsconfigService {
  private mainapihosturl = environment.mainApiHostUrl;

  constructor(private http: Http) { }

  getMsconfigbygroup(msconfiggroup) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${this.mainapihosturl}msconfigbygroup/${msconfiggroup}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getMsconfigactivecountries() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${this.mainapihosturl}msconfigactivecountries`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getMsconfigvalue(msconfigcode, msconfiggroup) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${this.mainapihosturl}msconfigvalue/${msconfigcode}?group=${msconfiggroup}`, options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getActiveprovince(country, oBodyParam) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.mainapihosturl}listactiveprovince/${country}`, JSON.stringify(oBodyParam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getActivecity(province, oBodyParam) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.mainapihosturl}listactivecity/${province}`, JSON.stringify(oBodyParam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  getActivedistrict(city, oBodyParam) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.mainapihosturl}listactivedistrict/${city}`, JSON.stringify(oBodyParam), options)
        .pipe(map((response: Response) => response.json()),
        catchError(this.handleError));
  }

  private handleError(error: Response) {
    const stdErrMsg = `Ooops sorry...a server error occured. Please try again shortly. <br>`;
    const errMsg = error.status ? `${stdErrMsg} ${'Error: &nbsp;' + error.status} - ${error.statusText}` : stdErrMsg;

    return throwError(errMsg);
  }
}
