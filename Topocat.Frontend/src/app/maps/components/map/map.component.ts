import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute} from '@angular/router';
import {MapObjectsDrawer} from '../../services/map-objects.drawer';
import {MapsSignalRService} from '../../services/maps.signal-r.service';
import {filter, tap} from 'rxjs/operators';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [MapObjectsDrawer]
})
export class MapComponent implements OnInit {

    constructor(private mapService: MapService,
                private route: ActivatedRoute,
                private mapObjectsDrawer: MapObjectsDrawer,
                private mapsSignalRService: MapsSignalRService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const mapId = params.id;

            if (!mapId) {
                throw new Error();
            }

            this.mapService.load(mapId);
            this.mapsSignalRService.isConnected$.pipe(
                filter(isConnected => !!isConnected),
                tap(() => this.mapsSignalRService.initialize(mapId))
            ).subscribe();
        });
    }

    onMapReady(mapInstance: google.maps.Map) {
        this.mapObjectsDrawer.setMap(mapInstance);
    }
}
