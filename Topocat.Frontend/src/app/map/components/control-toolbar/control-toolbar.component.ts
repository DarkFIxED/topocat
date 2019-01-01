import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapStore } from '../../stores/map.store';
import { Place } from '../../../domain/map/place';
import { Coords } from '../../../domain/map/coords';

@Component({
    selector: 'tc-control-toolbar',
    templateUrl: './control-toolbar.component.html',
    styleUrls: ['./control-toolbar.component.css']
})
export class ControlToolbarComponent implements OnInit {

    public centerForm: FormGroup = new FormGroup({
        lat: new FormControl('', [Validators.required]),
        lng: new FormControl('', [Validators.required])
    });

    public zoomForm: FormGroup = new FormGroup({
        zoom: new FormControl('', [Validators.required])
    });

    constructor(private mapStore: MapStore) {
        this.mapStore.entity.centerChanged.subscribe(centerChangedEventArgs => {
            this.centerForm.setValue(centerChangedEventArgs.center);
        });

        this.mapStore.entity.zoomChanged.subscribe(zoomChangedEventArgs => {
            this.zoomForm.setValue({zoom: zoomChangedEventArgs.zoom});
        });

        this.centerForm.setValue(this.mapStore.entity.center);
        this.zoomForm.setValue({zoom: this.mapStore.entity.zoom});
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

    changeCenter() {
        this.mapStore.entity.setCenter(new Coords(+this.centerForm.value.lat, +this.centerForm.value.lng));
    }

    changeZoom() {
        this.mapStore.entity.setZoom(+this.zoomForm.value.zoom);
    }
}
