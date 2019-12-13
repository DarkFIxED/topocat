import {Component, NgZone, OnInit} from '@angular/core';
import {MapProviderService} from '../../../maps/services/map-provider.service';
import {GoogleMapProvider} from '../../provider/google/google-map-provider';
import {WktService} from '../../../maps/services/wkt.service';

@Component({
    selector: 'app-google-map-container',
    templateUrl: './google-map-container.component.html',
    styleUrls: ['./google-map-container.component.scss']
})
export class GoogleMapContainerComponent implements OnInit {

    constructor(private mapProviderService: MapProviderService,
                private zone: NgZone,
                private wktService: WktService) {
    }

    ngOnInit() {
    }

    onMapReady(mapInstance: google.maps.Map) {
        this.mapProviderService.setProvider(new GoogleMapProvider(mapInstance, this.zone, this.wktService));
    }
}
