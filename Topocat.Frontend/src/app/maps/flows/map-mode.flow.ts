import {Injectable} from '@angular/core';
import {DataFlow} from '../../core/services/data.flow';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {MapQuery} from '../queries/map.query';
import {combineLatest} from 'rxjs';
import {LocalPreferencesService} from '../../core/services/local-preferences.service';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {MapService} from '../services/map.service';
import {MapProviderService} from '../services/map-provider.service';

@Injectable()
export class MapModeFlow extends BaseDestroyable implements DataFlow {

    private readonly key = 'map-mode';

    constructor(private mapService: MapService,
                private mapQuery: MapQuery,
                private localPreferencesService: LocalPreferencesService,
                private mapProviderService: MapProviderService) {
        super();
    }

    setUp() {
        const mode$ = this.mapQuery.mapMode$.pipe(
            filter(mode => !!mode)
        );

        combineLatest(this.mapProviderService.provider$, mode$)
            .pipe(
                tap(results => this.localPreferencesService.setValue(this.key, results[1])),
                tap(results => {
                    const currentMapMode = results[0].getMapMode();
                    const supportedModes = results[0].getAvailableMapModes();

                    if (!!currentMapMode && currentMapMode !== results[1] && supportedModes.some(mode => mode.value === results[1]))
                        results[0].setMapMode(results[1]);
                }),
                takeUntil(this.componentAlive$)
            ).subscribe();

        this.mapProviderService.provider$.pipe(
            tap(mapProvider => {
                let value = this.localPreferencesService.getValue(this.key);

                if (!value || !mapProvider.getAvailableMapModes().some(availableMode => availableMode.value === value)) {
                    value = mapProvider.getMapMode();
                    this.localPreferencesService.setValue(this.key, value);
                }

                this.mapService.setMapMode(value);
            }),
            takeUntil(this.componentAlive$)
        ).subscribe();
    }
}
