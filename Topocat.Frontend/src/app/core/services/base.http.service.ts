import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseHttpService {

    constructor(private http: HttpClient) {
    }

    get<T>(relativeUrl: string, headers?: HttpHeaders): Observable<T> {
        return this.http.get<T>(`${environment.serverUrl}${relativeUrl}`, {headers});
    }

    post<T>(relativeUrl: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.http.post<T>(`${environment.serverUrl}${relativeUrl}`, body, {headers});
    }

    put<T>(relativeUrl: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.http.put<T>(`${environment.serverUrl}${relativeUrl}`, body, {headers});
    }

    delete<T>(relativeUrl: string, headers?: HttpHeaders): Observable<T> {
        return this.http.delete<T>(`${environment.serverUrl}${relativeUrl}`, {headers});
    }

    patch<T>(relativeUrl: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.http.patch<T>(`${environment.serverUrl}${relativeUrl}`, body, {headers});
    }
}
