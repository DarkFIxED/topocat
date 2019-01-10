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
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../infrastructure/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'tc-edit-place',
    templateUrl: './edit-place.component.html',
    styleUrls: ['./edit-place.component.scss']
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

    public isNewPlace = false;

    private listeners = [];

    constructor(
        private mapService: MapService,
        private mapStore: MapStore,
        private route: ActivatedRoute,
        private router: Router,
        private messageBus: MessageBusService,
        public dialog: MatDialog
    ) {
        this.route.data.subscribe(data => {
            this.isNewPlace = !!data.newPlace;

            if (this.isNewPlace) {
                this.place = new Place('', '');
            } else {
                this.route.params.subscribe(params => {
                    let uuid = params['id'];
                    let originPlace = <Place>this.mapStore.entity.getObject(uuid);

                    if (!originPlace) {
                        throw new Error('Place not found');
                    }

                    this.place = new Place();
                    this.place.copyFrom(originPlace);
                });
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
        this.mapStore.entity.addOrUpdatePlace(this.place);

        this.close();
    }

    delete() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: 1,
            title: 'Confirm deletion',
            content: 'Do you really want to delete place?'
        };

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

        dialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.mapStore.entity.deleteObject(this.place.uuid);
                }

                this.close();
            });
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

        this.messageBus.publish(new SimpleMessage(MessageNames.MapDeactivatePopup));
    }
}
