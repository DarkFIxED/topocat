import {Component, OnInit} from '@angular/core';
import {MapInstanceService} from '../../services/map-instance.service';
import {switchMap} from 'rxjs/operators';
import {iif, of} from 'rxjs';
import {MatRadioChange} from '@angular/material';

// TODO: It is required to incapsulate type manipulations into some MapService.
@Component({
    selector: 'app-maps-settings',
    templateUrl: './maps-settings.component.html',
    styleUrls: ['./maps-settings.component.scss']
})
export class MapsSettingsComponent implements OnInit {

    MapTypeId = google.maps.MapTypeId;

    mapMode$ = this.mapInstanceService.mapInstance$.pipe(
        switchMap(mapInstance => iif(() => !!mapInstance, of(mapInstance.getMapTypeId()), of(undefined)))
    );

    private mapInstance: google.maps.Map;

    constructor(private mapInstanceService: MapInstanceService) {
        this.mapInstanceService.mapInstance$.subscribe(mapInstance => {
            this.mapInstance = mapInstance;
        });
    }

    ngOnInit() {
    }

    onMapTypeIdChange(event: MatRadioChange) {
        this.mapInstance.setMapTypeId(event.value);
    }
}
