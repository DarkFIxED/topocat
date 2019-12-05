import {HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseHttpService} from './base.http.service';
import {Injectable} from '@angular/core';
import {CredentialsStore} from '../stores/credentials.store';
import {map, switchMap, tap} from 'rxjs/operators';
import {JwtTokensService} from './jwt-tokens.service';
import {ApiResponse} from '../models/api.response';
import {TokenPair} from '../models/token-pair';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpService {
    private readonly AuthHeader = 'Authorization';

    constructor(private http: BaseHttpService,
                private credentialsStore: CredentialsStore,
                private tokensService: JwtTokensService) {
    }

    get<T>(relativeUrl: string, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.makeRequest(relativeUrl, undefined, headers, params,
            ((localRelativeUrl, localBody, localHeaders, localParams) => this.http.get<T>(localRelativeUrl, localHeaders, localParams)));
    }

    post<T>(relativeUrl: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.makeRequest(relativeUrl, body, headers, params,
            ((localRelativeUrl, localBody, localHeaders, localParams) => this.http.post<T>(localRelativeUrl, localBody, localHeaders, localParams)));
    }

    put<T>(relativeUrl: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.makeRequest(relativeUrl, body, headers, params,
            ((localRelativeUrl, localBody, localHeaders, localParams) => this.http.put<T>(localRelativeUrl, localBody, localHeaders, localParams)));
    }

    delete<T>(relativeUrl: string, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.makeRequest(relativeUrl, undefined, headers, params,
            ((localRelativeUrl, localBody, localHeaders, localParams) => this.http.delete<T>(localRelativeUrl, localHeaders, localParams)));
    }

    patch<T>(relativeUrl: string, body: any, headers?: HttpHeaders, params?: HttpParams): Observable<T> {
        return this.makeRequest(relativeUrl, body, headers, params,
            ((localRelativeUrl, localBody, localHeaders, localParams) => this.http.patch<T>(localRelativeUrl, localBody, localHeaders)));
    }

    private makeRequest<T>(relativeUrl: string, body: any, headers: HttpHeaders, params: HttpParams,
                           func: (relativeUrl: string, body: any, headers: HttpHeaders, params: HttpParams) => Observable<T>): Observable<T> {
        if (!headers) {
            headers = new HttpHeaders();
        }

        const tokenPair = this.credentialsStore.tokenPair;
        if (!tokenPair) {
            // TODO: redirect to login
            throw new Error();
        }

        if (!this.tokensService.isTokenExpired(tokenPair.accessToken)) {
            headers = headers.set(this.AuthHeader, `Bearer ${tokenPair.accessToken}`);
            return func(relativeUrl, body, headers, params);
        }

        if (this.tokensService.isTokenExpired(tokenPair.refreshToken)) {
            // TODO: redirect to login
            throw new Error();
        }

        return this.http.post<ApiResponse<TokenPair>>('authenticate/renew', {refreshToken: tokenPair.refreshToken})
            .pipe(
                map(obtainedTokenPair => {
                    if (!obtainedTokenPair.isSuccessful) {
                        // TODO: redirect to login
                        throw new Error();
                    }

                    this.credentialsStore.updateTokenPair(obtainedTokenPair.data);
                    return obtainedTokenPair.data.accessToken;
                }),
                tap(accessToken => {
                    headers = headers.set(this.AuthHeader, `Bearer ${accessToken}`);
                }),
                switchMap(() => func(relativeUrl, body, headers, params))
            );
    }
}
