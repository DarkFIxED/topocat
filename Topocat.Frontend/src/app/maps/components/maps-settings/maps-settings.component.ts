import {Component, OnInit} from '@angular/core';
import {MatRadioChange} from '@angular/material';
import {MapQuery} from '../../queries/map.query';
import {MapService} from '../../services/map.service';
import {MapProviderService} from '../../services/map-provider.service';
import {filter, map, tap} from 'rxjs/operators';
import {BaseDestroyable} from '../../../core/services/base-destroyable';
import {Observable} from 'rxjs';
import {MapProvidersHttpService} from '../../services/map-providers.http.service';
import {SupportedMapTypes} from '../../providers/supported-map-types';
import {ActivatedRoute, Router} from '@angular/router';
import {MapObjectsQuery} from '../../queries/map-objects.query';

@Component({
    selector: 'app-maps-settings',
    templateUrl: './maps-settings.component.html',
    styleUrls: ['./maps-settings.component.scss']
})
export class MapsSettingsComponent extends BaseDestroyable implements OnInit {
    availableModes$: Observable<{ title: string, value: string }[]>;
    mapMode$ = this.mapQuery.mapMode$;
    providers$ = this.mapQuery.select(state => state.providers)
        .pipe(
            filter(providers => !!providers),
            map(providers => {
                return Object.getOwnPropertyNames(providers).map(property => {
                    return {
                        name: property,
                        isAvailable: providers[property]
                    };
                });
            })
        );

    currentProvider$ = this.mapProviderService.provider$.pipe(
        filter(provider => !!provider),
        map(provider => SupportedMapTypes[provider.getType()])
    );

    isEditing$ = this.mapObjectsQuery.select(state => state).pipe(
        map(state => state.drawing.isEnabled || !!state.editing.mapObjectId)
    );

    constructor(private mapQuery: MapQuery,
                private mapObjectsQuery: MapObjectsQuery,
                private mapService: MapService,
                private mapProviderService: MapProviderService,
                private router: Router,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.availableModes$ = this.mapProviderService.provider$
            .pipe(
                map(provider => provider.getAvailableMapModes()),
            );
    }

    onMapTypeIdChange(event: MatRadioChange) {
        this.mapService.setMapMode(event.value);
    }

    onProviderChange(event: MatRadioChange) {
        this.router.navigate(['.', event.value.toLowerCase()], {relativeTo: this.route});
    }
}
