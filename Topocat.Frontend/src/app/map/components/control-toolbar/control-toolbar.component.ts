import { Component, OnInit } from '@angular/core';
import { MapStore } from '../../stores/map.store';
import { Place } from '../../../domain/map/place';
import { Coords } from '../../../domain/map/coords';

@Component({
    selector: 'tc-control-toolbar',
    templateUrl: './control-toolbar.component.html',
    styleUrls: ['./control-toolbar.component.css']
})
export class ControlToolbarComponent implements OnInit {

    constructor(private mapStore: MapStore) {
    }

    ngOnInit() {
    }

    createMarker() {
        let place = new Place();
        place.coords = new Coords();
        place.coords.lng = 84;
        place.coords.lat = 56;

        this.mapStore.entity.addPlace(place);
    }

    createPolygon() {

    }

    cancel() {

    }
}
