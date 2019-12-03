import {Component, OnInit} from '@angular/core';
import {MapInstanceService} from '../../services/map-instance.service';
import {switchMap} from 'rxjs/operators';
import {iif, of} from 'rxjs';
import {MatRadioChange} from '@angular/material';
import {MapQuery} from '../../queries/map.query';
import {MapService} from '../../services/map.service';

// TODO: It is required to incapsulate type manipulations into some MapService.
@Component({
    selector: 'app-maps-settings',
    templateUrl: './maps-settings.component.html',
    styleUrls: ['./maps-settings.component.scss']
})
export class MapsSettingsComponent implements OnInit {

    MapTypeId = google.maps.MapTypeId;

    mapMode$ = this.mapQuery.mapMode$;

    constructor(private mapQuery: MapQuery,
                private mapService: MapService) {
    }

    ngOnInit() {
    }

    onMapTypeIdChange(event: MatRadioChange) {
        this.mapService.setMapMode(event.value);
    }
}
