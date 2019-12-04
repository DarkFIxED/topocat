import {Component, OnInit} from '@angular/core';
import {MatRadioChange} from '@angular/material';
import {MapQuery} from '../../queries/map.query';
import {MapService} from '../../services/map.service';
import {MapProviderService} from '../../services/map-provider.service';
import {map, takeUntil} from 'rxjs/operators';
import {BaseDestroyable} from '../../../core/services/base-destroyable';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-maps-settings',
    templateUrl: './maps-settings.component.html',
    styleUrls: ['./maps-settings.component.scss']
})
export class MapsSettingsComponent extends BaseDestroyable implements OnInit {
    availableModes$ = new Subject<{ title: string, value: string }[]>();
    mapMode$ = this.mapQuery.mapMode$;

    constructor(private mapQuery: MapQuery,
                private mapService: MapService,
                private mapProviderService: MapProviderService) {
        super();
    }

    ngOnInit() {
        this.mapProviderService.provider$
            .pipe(
                map(provider => provider.getAvailableMapModes()),
                takeUntil(this.componentAlive$)
            ).subscribe();
    }

    onMapTypeIdChange(event: MatRadioChange) {
        this.mapService.setMapMode(event.value);
    }
}
