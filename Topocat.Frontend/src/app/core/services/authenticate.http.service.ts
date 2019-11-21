import {Injectable} from '@angular/core';
import {BaseHttpService} from './base.http.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api.response';
import {TokenPair} from '../models/token-pair';

@Injectable({
    providedIn: 'root'
})
export class AuthenticateHttpService {
    constructor(private baseHttpService: BaseHttpService) {

    }

    public login(authData: {email: string, password: string}): Observable<ApiResponse<TokenPair>> {
        return this.baseHttpService.post<ApiResponse<TokenPair>>('authenticate', authData);
    }

    public restorePasswordRequest(data: {email: string}): Observable<ApiResponse<any>> {
        return this.baseHttpService.post<ApiResponse<any>>('restore-password-request', data);
    }

    public resetPassword(data: {token: string, email: string, password: string}): Observable<ApiResponse<any>> {
        return this.baseHttpService.post<ApiResponse<any>>('reset-password', data);
    }

    public signUp(data: {email: string, password: string}): Observable<ApiResponse<any>> {
        return this.baseHttpService.post<ApiResponse<any>>(`users/sign-up`, data);
    }
}
