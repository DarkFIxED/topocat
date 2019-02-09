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
import { PhantomPlaceCoordsChangedEventArgs } from '../../models/phantom-place-coords-changed-event-args';
import { ConfirmationDialogService } from '../../../infrastructure/dialogs/confirmation-dialog/confirmation-dialog.service';

@Component({
    selector: 'tc-edit-place',
    templateUrl: './edit-place.component.html',
    styleUrls: ['./edit-place.component.scss']
})
export class EditPlaceComponent implements OnInit, OnDestroy {

    place: Place;

    caption = '';

    placeForm = new FormGroup({
        uuid: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', []),
        coords: new FormGroup({
            lat: new FormControl('', [Validators.required]),
            lng: new FormControl('', [Validators.required])
        })
    });

    isNewPlace = false;

    private listeners = [];

    constructor(
        private mapService: MapService,
        private mapStore: MapStore,
        private route: ActivatedRoute,
        private router: Router,
        private messageBus: MessageBusService,
        private confirmationDialog: ConfirmationDialogService
    ) {
        this.initializeModelAndForm();
    }

    ngOnInit() {
        if (this.mapService.provider.mapReady) {
            this.initialize();
        } else {
            this.messageBus.listenOnce([MessageNames.MapReady], (observable: Observable<SimpleMessage>) => {
                return observable.subscribe(() => {
                    this.initialize();
                });
            });
        }
    }

    ngOnDestroy(): void {
        this.messageBus.stopListen(this.listeners);
    }

    dismiss() {
        if (this.mapService.provider.isDrawingManually()) {
            this.mapService.provider.cancelManualDrawing();
        }

        this.close();
    }

    submit() {
        this.mapStore.entity.addOrUpdateObject(this.place);
        this.close();
    }

    delete() {
        this.confirmationDialog.call('Confirm deletion', 'Do you really want to delete place?')
            .subscribe(result => {
                if (result) {
                    this.mapStore.entity.deleteObject(this.place.uuid);
                }

                this.close();
            });
    }

    async draw() {
        this.mapService.provider.setPhantomsVisibility(false);

        let coords = await this.mapService.provider.drawCoordsManually();
        this.placeForm.patchValue({coords: coords.getLatLng()});

        this.mapService.provider.setPhantomsVisibility(true);
    }

    private initialize() {
        this.mapService.provider.setDrawnObjectsVisibility(false);

        this.setupFormChangeHandlers();

        this.mapService.provider.addOrUpdatePhantom(this.place);

        this.setupMapPhantomCoordsListener();
    }

    private close() {
        this.mapService.provider.deletePhantom(this.place.uuid);

        this.mapService.provider.setDrawnObjectsVisibility(true);

        this.messageBus.publish(new SimpleMessage(MessageNames.MapDeactivatePopup));
    }

    private setupMapPhantomCoordsListener() {
        let listenerId = this.messageBus.listen([MessageNames.MapPhantomPlaceCoordsChanged],
            (observable: Observable<Message<PhantomPlaceCoordsChangedEventArgs>>) => {
                return observable
                    .pipe(
                        filter(x => x.payload.uuid === this.place.uuid)
                    )
                    .subscribe(message => {
                        this.place.updateCoordsFromLatLng(message.payload.lat, message.payload.lng);

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

    private setupFormChangeHandlers() {
        this.placeForm.controls['title'].valueChanges.subscribe(newTitle => {
            this.place.title = newTitle
        });

        this.placeForm.controls['description'].valueChanges.subscribe(newDescription => {
            this.place.description = newDescription;
        });

        this.placeForm.controls['coords'].valueChanges.subscribe(newCoords => {
            this.place.updateCoordsFromLatLng(+newCoords.lat, +newCoords.lng);
        });

        this.placeForm.valueChanges.subscribe(() => {
            this.mapService.provider.addOrUpdatePhantom(this.place);
        });
    }

    private getCopyOfExistingPlace(uuid: string) {
        let originPlace = <Place>this.mapStore.entity.getObject(uuid);

        if (!originPlace) {
            throw new Error('Place not found');
        }

        let place = new Place();
        place.copy(originPlace);

        return place;
    }

    private initializeModelAndForm() {
        this.route.data.subscribe(data => {
            this.isNewPlace = !!data.newEntity;

            if (this.isNewPlace) {
                this.caption = 'New place';
                this.place = new Place('', '');
            } else {
                this.caption = 'Edit place';
                this.route.params.subscribe(params => {
                    this.place = this.getCopyOfExistingPlace(params['id']);
                });
            }
        });

        this.placeForm.setValue({
            uuid: this.place.uuid,
            title: this.place.title,
            description: this.place.description,
            coords: this.place.coords.getLatLng()
        });
    }
}
