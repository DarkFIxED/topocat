import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseHttpService} from './base.http.service';
import {Injectable} from '@angular/core';
import {CredentialsStore} from '../stores/credentials.store';
import {map, switchMap, tap} from 'rxjs/operators';
import {TokensService} from './tokens.service';
import {ApiResponse} from '../models/api.response';
import {TokenPair} from '../models/token-pair';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpService {
    private readonly AuthHeader = 'Authorization';

    constructor(private http: BaseHttpService,
                private credentialsStore: CredentialsStore,
                private tokensService: TokensService) {
    }

    get<T>(relativeUrl: string, headers?: HttpHeaders): Observable<T> {
        return this.makeRequest(relativeUrl, undefined, headers,
            ((localRelativeUrl, localBody, localHeaders) => this.http.get<T>(localRelativeUrl, localHeaders)));
    }

    post<T>(relativeUrl: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.makeRequest(relativeUrl, body, headers,
            ((localRelativeUrl, localBody, localHeaders) => this.http.post<T>(localRelativeUrl, localBody, localHeaders)));
    }

    put<T>(relativeUrl: string, body: any, headers?: HttpHeaders): Observable<T> {
        return this.makeRequest(relativeUrl, body, headers,
            ((localRelativeUrl, localBody, localHeaders) => this.http.put<T>(localRelativeUrl, localBody, localHeaders)));
    }

    private makeRequest<T>(relativeUrl: string, body: any, headers: HttpHeaders,
                           func: (relativeUrl: string, body: any, headers: HttpHeaders) => Observable<T>): Observable<T> {
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
            return func(relativeUrl, body, headers);
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
                switchMap(() => func(relativeUrl, body, headers))
            );
    }
}
