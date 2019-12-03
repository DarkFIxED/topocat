import {Injectable} from '@angular/core';
import {DataFlow} from '../../core/services/data.flow';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {MapService} from '../services/map.service';
import {MapInstanceService} from '../services/map-instance.service';
import {MapQuery} from '../queries/map.query';
import {combineLatest} from 'rxjs';
import {LocalPreferencesService} from '../../core/services/local-preferences.service';
import {filter, takeUntil, tap} from 'rxjs/operators';

@Injectable()
export class MapModeFlow extends BaseDestroyable implements DataFlow {

    private readonly key = 'map-mode';

    constructor(private mapService: MapService,
                private mapInstanceService: MapInstanceService,
                private mapQuery: MapQuery,
                private localPreferencesService: LocalPreferencesService) {
        super();
    }

    setUp() {
        const instance$ = this.mapInstanceService.mapInstance$.pipe(
            filter(map => !!map)
        );

        const mode$ = this.mapQuery.mapMode$.pipe(
            filter(mode => !!mode)
        );

        combineLatest(instance$, mode$)
            .pipe(
                tap(results => this.localPreferencesService.setValue(this.key, results[1])),
                tap(results => {
                    const currentMapMode = results[0].getMapTypeId();
                    if (!!currentMapMode && currentMapMode !== results[1])
                        results[0].setMapTypeId(results[1]);
                }),
                takeUntil(this.componentAlive$)
            ).subscribe();

        instance$.pipe(
            tap(mapInstance => {
                let value = this.localPreferencesService.getValue(this.key);

                if (!value) {
                    value = mapInstance.getMapTypeId();
                    this.localPreferencesService.setValue(this.key, value);
                }

                this.mapService.setMapMode(value);
            }),
            takeUntil(this.componentAlive$)
        ).subscribe();
    }
}
