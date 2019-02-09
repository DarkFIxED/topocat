import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { Observable } from 'rxjs';
import { MessageBusService, SimpleMessage } from 'litebus';
import { MapStore } from '../../stores/map.store';
import { Coords } from '../../../domain/map/coords';
import { MapService } from '../../services/map.service';
import { MessageNames } from '../../../infrastructure/message-names';
import { Router } from '@angular/router';

@Component({
    selector: 'tc-control-toolbar',
    templateUrl: './control-toolbar.component.html',
    styleUrls: ['./control-toolbar.component.scss']
})
export class ControlToolbarComponent implements OnInit {

    maxAllowedZoom = 0;

    centerForm: FormGroup = new FormGroup({
        lat: new FormControl('', [Validators.required]),
        lng: new FormControl('', [Validators.required])
    });

    zoomForm: FormGroup = new FormGroup({
        zoom: new FormControl('', [Validators.required])
    });

    constructor(private mapStore: MapStore,
                private mapService: MapService,
                private messageBus: MessageBusService,
                private router: Router) {
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

    addPlace() {
        this.router.navigate(['/map', 'places', 'new'], {
            queryParamsHandling: 'merge'
        });
    }

    private updateMapOptions() {
        this.maxAllowedZoom = this.mapService.provider.maxZoom;
    }


}
