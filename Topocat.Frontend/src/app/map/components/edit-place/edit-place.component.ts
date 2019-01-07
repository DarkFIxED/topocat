import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Message, MessageBusService, SimpleMessage } from 'litebus';

import { MapService } from '../../services/map.service';
import { MapStore } from '../../stores/map.store';
import { Place } from '../../../domain/map/place';
import { MessageNames } from '../../../infrastructure/message-names';
import { MapObjectCoordsChangedEventArgs } from '../../models/map-object-coords-changed-event-args';

@Component({
    selector: 'tc-edit-place',
    templateUrl: './edit-place.component.html',
    styleUrls: ['./edit-place.component.css']
})
export class EditPlaceComponent implements OnInit, OnDestroy {

    public place: Place;

    public placeForm = new FormGroup({
        uuid: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', []),
        coords: new FormGroup({
            lat: new FormControl('', [Validators.required]),
            lng: new FormControl('', [Validators.required])
        })
    });

    private listeners = [];

    constructor(
        private mapService: MapService,
        private mapStore: MapStore,
        private route: ActivatedRoute,
        private router: Router,
        private messageBus: MessageBusService
    ) {
        this.route.data.subscribe(data => {
           if (data.newPlace) {
               this.place = new Place('', '');
           } else {
               // TODO: retrieve place.
           }
        });

        this.placeForm.setValue({
            uuid: this.place.uuid,
            title: this.place.title,
            description: this.place.description,
            coords: this.place.coords
        });
    }

    ngOnInit() {
        if (this.mapService.provider.mapReady) {
            this.initialize();
        } else {
            let listenerId = this.messageBus.listen([MessageNames.MapReady], (observable: Observable<SimpleMessage>) => {
                return observable.subscribe(() => {
                    this.initialize();

                    this.messageBus.stopListen([listenerId]);
                });
            });
        }
    }

    ngOnDestroy(): void {
        this.messageBus.stopListen(this.listeners);
    }

    dismiss() {
        this.close();
    }

    submit() {
        this.mapStore.entity.addPlace(this.place);

        this.close();
    }

    private initialize() {
        this.mapService.provider.setDrawnObjectsVisibility(false);

        this.placeForm.controls['title'].valueChanges.subscribe(newTitle => {
            this.place.title = newTitle
        });

        this.placeForm.controls['description'].valueChanges.subscribe(newDescription => {
            this.place.description = newDescription;
        });

        this.placeForm.controls['coords'].valueChanges.subscribe(newCoords => {
            this.place.coords.lat = +newCoords.lat;
            this.place.coords.lng = +newCoords.lng;
        });

        this.placeForm.valueChanges.subscribe(() => {
            if (this.placeForm.valid) {
                this.mapService.provider.addOrUpdatePhantom(this.place);
            }
        });

        this.mapService.provider.addOrUpdatePhantom(this.place);

        let listenerId = this.messageBus.listen([MessageNames.MapPhantomCoordsChanged],
            (observable: Observable<Message<MapObjectCoordsChangedEventArgs>>) => {
                return observable
                    .pipe(
                        filter(x => x.payload.uuid === this.place.uuid)
                    )
                    .subscribe(message => {
                        this.place.coords.lat = message.payload.lat;
                        this.place.coords.lng = message.payload.lng;

                        this.placeForm.patchValue({
                            coords: {
                                lat: message.payload.lat,
                                lng: message.payload.lng
                            }
                        }, {emitEvent: false});
                    });
            });

        this.listeners.push(listenerId);
    }

    private close() {
        this.mapService.provider.removePhantom(this.place);

        this.mapService.provider.setDrawnObjectsVisibility(true);

        this.router.navigate([''], {
            relativeTo: this.route.parent,
            queryParamsHandling: 'merge',
        });
    }

}
