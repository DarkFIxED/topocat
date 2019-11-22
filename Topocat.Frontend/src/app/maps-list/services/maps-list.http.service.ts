import {AuthHttpService} from '../../core/services/auth.http.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../core/models/api.response';
import {MapModel} from '../models/map.model';
import {Injectable} from '@angular/core';
import {NewMapModel} from '../models/new-map.model';

@Injectable()
export class MapsListHttpService {
    constructor(private authHttpService: AuthHttpService) {
    }

    getMapsList(): Observable<ApiResponse<{maps: MapModel[]}>> {
        return this.authHttpService.get<ApiResponse<{maps: MapModel[]}>>('maps');
    }

    createMap(newMapModel: NewMapModel): Observable<ApiResponse<any>> {
        return this.authHttpService.post<ApiResponse<any>>('maps', newMapModel);
    }

    updateMap(id: string, data: NewMapModel): Observable<ApiResponse<any>> {
        return this.authHttpService.put<ApiResponse<any>>(`maps/${id}`, data);
    }
}
