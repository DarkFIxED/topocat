import {Injectable} from '@angular/core';
import {AuthHttpService} from '../../core/services/auth.http.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../core/models/api.response';

@Injectable()
export class MapProvidersHttpService {
    constructor(private authHttp: AuthHttpService) {
    }

    getAvailableProviders(): Observable<ApiResponse<{providers: any}>> {
        return this.authHttp.get<ApiResponse<{providers: any}>>(`map-providers`);
    }

    canUseProvider(providerName: string): Observable<ApiResponse<any>> {
        return this.authHttp.get<ApiResponse<any>>(`map-providers/${providerName}`);
    }
}
