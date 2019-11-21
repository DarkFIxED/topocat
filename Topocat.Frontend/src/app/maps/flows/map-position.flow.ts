import {DataFlow} from '../../core/services/data.flow';
import {Injectable} from '@angular/core';
import {MapInstanceService} from '../services/map-instance.service';
import {MapQuery} from '../queries/map.query';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {MapService} from '../services/map.service';

@Injectable()
export class MapPositionFlow extends BaseDestroyable implements DataFlow {

    constructor(private mapInstanceService: MapInstanceService,
                private mapQuery: MapQuery,
                private mapService: MapService) {
        super();
    }

    setUp() {
        this.mapInstanceService.mapInstance$.pipe(
            filter(mapInstance => !!mapInstance),
            tap(mapInstance => {
               const position = this.mapQuery.getValue().position;
               this.mapService.setPosition(position.lat, position.lng, position.zoom, true);
            }),
            tap(mapInstance => {
                mapInstance.addListener('idle', () => {
                    const latLng = mapInstance.getCenter();
                    const zoom = mapInstance.getZoom();
                    this.mapService.setPosition(latLng.lat(), latLng.lng(), zoom, false);
                });
            }),
            takeUntil(this.componentAlive$)
        ).subscribe();

        combineLatest(this.mapInstanceService.mapInstance$, this.mapQuery.position$).pipe(
            filter(results => !!results[0]),
            filter(results => results[1].setManually),
            tap(results => {
                const mapInstance = results[0];
                const newPosition = results[1];


                mapInstance.panTo({lat: newPosition.lat, lng: newPosition.lng});
                if (mapInstance.getZoom() !== newPosition.zoom) {
                    mapInstance.setZoom(newPosition.zoom);
                }
            }),
            takeUntil(this.componentAlive$)
        ).subscribe();
    }
}
