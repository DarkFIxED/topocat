import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute} from '@angular/router';
import {MapObjectsDrawer} from '../../services/map-objects.drawer';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [MapObjectsDrawer]
})
export class MapComponent implements OnInit {

    constructor(private mapService: MapService,
                private route: ActivatedRoute,
                private mapObjectsDrawer: MapObjectsDrawer) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id)
                throw new Error();

            this.mapService.load(params.id);
        });
    }

    onMapReady(mapInstance: google.maps.Map) {
        this.mapObjectsDrawer.setMap(mapInstance);
    }
}
