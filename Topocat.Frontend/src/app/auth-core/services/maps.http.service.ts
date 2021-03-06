import {Injectable} from '@angular/core';
import {AuthHttpService} from '../../core/services/auth.http.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../core/models/api.response';
import {MapModel} from '../../maps/models/map.model';
import {MapObjectModel} from '../../maps/models/map-object.model';
import {HttpParams} from '@angular/common/http';

@Injectable()
export class MapsHttpService {
    constructor(private authHttpService: AuthHttpService) {
    }

    getMap(mapId: string): Observable<ApiResponse<{ map: MapModel }>> {
        return this.authHttpService.get<ApiResponse<{ map: MapModel }>>(`maps/${mapId}`);
    }

    getMapObjects(mapId: string): Observable<ApiResponse<{ mapObjects: MapObjectModel[] }>> {
        return this.authHttpService.get<ApiResponse<{ mapObjects: MapObjectModel[] }>>(`maps/${mapId}/objects`);
    }

    updateMapObject(mapId: string, data: MapObjectModel): Observable<ApiResponse<any>> {
        return this.authHttpService.put<ApiResponse<any>>(`maps/${mapId}/objects/${data.id}`, {
            title: data.title,
            description: data.description,
            wktString: data.wktString,
            tags: data.tags
        });
    }

    createMapObject(mapId: string, data: MapObjectModel): Observable<ApiResponse<any>> {
        return this.authHttpService.post<ApiResponse<any>>(`maps/${mapId}/objects`, {
            title: data.title,
            description: data.description,
            wktString: data.wktString,
            tags: data.tags
        });
    }

    deleteMapObject(mapId: string, data: MapObjectModel): Observable<ApiResponse<any>> {
        return this.authHttpService.delete<ApiResponse<any>>(`maps/${mapId}/objects/${data.id}`);
    }

    searchTags(mapId: string, searchString: string): Observable<ApiResponse<{result: string[]}>> {
        const queryParams = new HttpParams()
            .set('search', searchString);

        return this.authHttpService.get<ApiResponse<{result: string[]}>>(`maps/${mapId}/objects/tags`, undefined, queryParams);
    }
}
