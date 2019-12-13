import {CanLoad, Route, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {MapProvidersHttpService} from '../services/map-providers.http.service';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class CanUseMapProviderGuard implements CanLoad {
    constructor(private mapProvidersHttpService: MapProvidersHttpService) {
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this.mapProvidersHttpService.canUseProvider(route.data.providerName)
            .pipe(
                map(response => response.isSuccessful)
            );
    }

}
