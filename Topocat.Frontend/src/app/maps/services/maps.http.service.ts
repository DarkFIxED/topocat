import {Injectable} from '@angular/core';
import {AuthHttpService} from '../../core/services/auth.http.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../core/models/api.response';
import {MapModel} from '../models/map.model';
import {MapObjectModel} from '../models/map-object.model';

@Injectable()
export class MapsHttpService {
    constructor(private authHttpService: AuthHttpService) {
    }

    getMap(mapId: string): Observable<ApiResponse<MapModel>> {
        return this.authHttpService.get<ApiResponse<MapModel>>(`maps/${mapId}`);
    }

    getMapObjects(mapId: string): Observable<ApiResponse<{mapObjects: MapObjectModel[]}>>{
        return this.authHttpService.get<ApiResponse<{mapObjects: MapObjectModel[]}>>(`maps/${mapId}/objects`);
    }
}
