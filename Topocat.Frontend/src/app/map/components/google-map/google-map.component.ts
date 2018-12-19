import { Component, OnInit } from '@angular/core';
import { GoogleMapProvider } from '../../map-providers/google-map-provider';
import { LatLngLiteral, MapTypeId } from '@agm/core/services/google-maps-types';
import { Coord } from '../../../domain/map/coord';
import { GoogleMapConfigurationStore } from '../../stores/google-map-configuration.store';
import { GoogleMapConfigurationModel } from '../../models/google-map-configuration.model';

@Component({
    selector: 'tc-google-map',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.css'],
    providers: [GoogleMapProvider, GoogleMapConfigurationStore]
})
export class GoogleMapComponent implements OnInit {

    public configuration: GoogleMapConfigurationModel;

    constructor(private mapProvider: GoogleMapProvider,
                public configurationStore: GoogleMapConfigurationStore) {
        this.configuration = JSON.parse(JSON.stringify(configurationStore.model));
    }

    ngOnInit() {
    }

    public onMapReady($event: any) {
        this.mapProvider.setup($event);
    }

    public onZoomChange($event: number) {
        let model = this.configurationStore.model;
        model.zoomLevel = $event;
        this.configurationStore.update(model);
    }

    public onCenterChange($event: LatLngLiteral) {
        let model = this.configurationStore.model;
        model.coord = new Coord($event.lat, $event.lng);
        this.configurationStore.update(model);
    }

    public onMapTypeIdChanged($event: MapTypeId) {
        let model = this.configurationStore.model;
        model.mapTypeId = $event;
        this.configurationStore.update(model);
    }
}
