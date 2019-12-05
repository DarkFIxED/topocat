import {DataFlow} from '../../core/services/data.flow';
import {Injectable} from '@angular/core';
import {MapQuery} from '../queries/map.query';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {MapService} from '../services/map.service';
import {MapProviderService} from '../services/map-provider.service';

@Injectable()
export class MapPositionFlow extends BaseDestroyable implements DataFlow {

    constructor(private mapQuery: MapQuery,
                private mapService: MapService,
                private mapProviderService: MapProviderService) {
        super();
    }

    setUp() {
        this.mapProviderService.provider$.pipe(
            tap(() => {
               const position = this.mapQuery.getValue().position;
               this.mapService.setMapPosition(position.lat, position.lng, position.zoom, true);
            }),
            tap(mapProvider => {
                combineLatest(mapProvider.position$, mapProvider.zoom$).pipe(
                    tap(results => {
                        this.mapService.setMapPosition(results[0].lat, results[0].lng, results[1], false);
                    }),
                    takeUntil(this.componentAlive$)
                ).subscribe();
            }),
            takeUntil(this.componentAlive$)
        ).subscribe();

        combineLatest(this.mapProviderService.provider$, this.mapQuery.position$).pipe(
            filter(results => results[1].setManually),
            tap(results => {
                const mapProvider = results[0];
                const newPosition = results[1];

                mapProvider.panTo({lat: newPosition.lat, lng: newPosition.lng}, newPosition.zoom);
            }),
            takeUntil(this.componentAlive$)
        ).subscribe();
    }
}
