import {AuthHttpService} from '../../core/services/auth.http.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../core/models/api.response';
import {MapModel} from '../models/map.model';
import {Injectable} from '@angular/core';

@Injectable()
export class MapsListHttpService {
    constructor(private authHttpService: AuthHttpService) {
    }

    getMapsList(): Observable<ApiResponse<{maps: MapModel[]}>> {
        return this.authHttpService.get<ApiResponse<{maps: MapModel[]}>>('maps');
    }
}
