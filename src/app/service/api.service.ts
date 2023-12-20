import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, of, throwError } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable({
    providedIn: 'root',
  })
  export class ApiService {

    constructor(private http: HttpClient) {}
  
    // Node/Express API
    REST_API: string = 'http://localhost:5000/api';
    // Http Header
    httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  
    // User Login
    authentication(userName: string, password: string): Observable<any> {
      let API_URL = `${this.REST_API}/auth`;
      let obj = Object.assign({});
      // password = this.encryptUsingAES256(password);
      obj.userName = userName;
      obj.password = password;
      return this.http.post<any>(API_URL, obj);
    }
  
    // Post Data
    getApiData(id: number): Observable<any> {
      let API_URL = `${this.REST_API}/data/${id}`;

      return this.http.get(API_URL).pipe(
        map((res: any) => {
          return res || {};
        })
        // catchError(this.handleError)
      );
    }
  
    private handleError(error: HttpErrorResponse) {
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, body was: `,
          error.error
        );
      }
      // Return an observable with a user-facing error message.
      return throwError(
        () => new Error('Something bad happened; please try again later.')
      );
    }
  }