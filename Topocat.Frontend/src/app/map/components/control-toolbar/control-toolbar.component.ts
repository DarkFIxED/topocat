import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapStore } from '../../stores/map.store';
import { Coords } from '../../../domain/map/coords';
import { MatSliderChange } from '@angular/material';
import { MapService } from '../../services/map.service';
import { MessageBusService } from '../../../infrastructure/message-bus/message-bus.service';
import { MessageNames } from '../../../infrastructure/message-bus/message-names';
import { Observable } from 'rxjs';
import { SimpleMessage } from '../../../infrastructure/message-bus/simple-message';

@Component({
    selector: 'tc-control-toolbar',
    templateUrl: './control-toolbar.component.html',
    styleUrls: ['./control-toolbar.component.css']
})
export class ControlToolbarComponent implements OnInit {

    public maxAllowedZoom = 0;

    public centerForm: FormGroup = new FormGroup({
        lat: new FormControl('', [Validators.required]),
        lng: new FormControl('', [Validators.required])
    });

    public zoomForm: FormGroup = new FormGroup({
        zoom: new FormControl('', [Validators.required])
    });

    constructor(private mapStore: MapStore,
                private mapService: MapService,
                private messageBus: MessageBusService) {
        this.mapStore.entity.centerChanged.subscribe(centerChangedEventArgs => {
            this.centerForm.setValue(centerChangedEventArgs.center, {emitEvent: false});
        });

        this.mapStore.entity.zoomChanged.subscribe(zoomChangedEventArgs => {
            this.zoomForm.setValue({zoom: zoomChangedEventArgs.zoom}, {emitEvent: false});
        });

        this.centerForm.setValue(this.mapStore.entity.center);
        this.zoomForm.setValue({zoom: this.mapStore.entity.zoom});

        this.zoomForm.valueChanges.subscribe(value => {
            this.mapStore.entity.setZoom(+value.zoom);
        });

        this.centerForm.valueChanges.subscribe(value => {
            let coords = new Coords(+value.lat, +value.lng);
            this.mapStore.entity.setCenter(coords);
        });

        this.messageBus.listen([MessageNames.MapReady],
            (observable: Observable<SimpleMessage>) => {
                return observable.subscribe(() => {
                    this.updateMapOptions();
                });
            });
    }

    ngOnInit() {
        if (this.mapService.hasProvider) {
            this.updateMapOptions();
        }
    }

    onZoomSliderChanged(event: MatSliderChange) {
        this.zoomForm.setValue({zoom: event.value});
    }

    private updateMapOptions() {
        this.maxAllowedZoom = this.mapService.provider.maxZoom;
    }
}
