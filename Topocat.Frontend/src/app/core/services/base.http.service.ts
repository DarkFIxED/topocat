import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseHttpService {

    constructor(private http: HttpClient) {
    }

    get<T>(relativeUrl: string, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.http.get<T>(`${environment.serverUrl}${relativeUrl}`, {headers, params});
    }

    post<T>(relativeUrl: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.http.post<T>(`${environment.serverUrl}${relativeUrl}`, body, {headers, params});
    }

    put<T>(relativeUrl: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.http.put<T>(`${environment.serverUrl}${relativeUrl}`, body, {headers, params});
    }

    delete<T>(relativeUrl: string, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.http.delete<T>(`${environment.serverUrl}${relativeUrl}`, {headers, params});
    }

    patch<T>(relativeUrl: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.http.patch<T>(`${environment.serverUrl}${relativeUrl}`, body, {headers, params});
    }
}
