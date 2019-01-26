import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Message, MessageBusService, SimpleMessage } from 'litebus';

import { MapService } from '../../services/map.service';
import { MapStore } from '../../stores/map.store';
import { Area } from '../../../domain/map/area';
import { MessageNames } from '../../../infrastructure/message-names';
import { ConfirmationDialogService } from '../../../infrastructure/dialogs/confirmation-dialog/confirmation-dialog.service';
import { PhantomAreaPathChangedEventArgs } from '../../models/phantom-area-path-changed-event-args';
import { Coords } from '../../../domain/map/coords';

@Component({
    selector: 'tc-edit-area',
    templateUrl: './edit-area.component.html',
    styleUrls: ['./edit-area.component.scss']
})
export class EditAreaComponent implements OnInit, OnDestroy {

    public caption = '';

    public areaForm = new FormGroup({
        uuid: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', []),
        path: new FormArray([])
    });
    public isNewArea = false;
    private area: Area;

    private listeners = [];

    constructor(private mapService: MapService,
                private mapStore: MapStore,
                private route: ActivatedRoute,
                private router: Router,
                private messageBus: MessageBusService,
                private confirmationDialog: ConfirmationDialogService) {
        this.route.data.subscribe(data => {
            this.isNewArea = !!data.newEntity;

            if (this.isNewArea) {
                this.caption = 'New area';
                this.area = new Area('', '');
            } else {
                this.caption = 'Edit area';
                this.route.params.subscribe(params => {
                    this.area = this.getCopyOfExistingArea(params['id']);
                    this.addMissingFormPathCoords(this.area.path);
                });
            }
        });

        this.areaForm.patchValue({
            uuid: this.area.uuid,
            title: this.area.title,
            description: this.area.description,
            path: this.area.path
        }, {emitEvent: false});

    }

    ngOnInit() {
        if (this.mapService.provider.mapReady) {
            this.initialize();
        } else {
            this.messageBus.listenOnce([MessageNames.MapReady],
                (observable: Observable<SimpleMessage>) => {
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
        this.close();
    }

    submit() {
        this.mapStore.entity.addOrUpdateArea(this.area);

        this.close();
    }

    delete() {
        this.confirmationDialog.call('Confirm deletion', 'Do you really want to delete place?')
            .subscribe(result => {
                if (result) {
                    this.mapStore.entity.deleteObject(this.area.uuid);
                }

                this.close();
            });
    }

    appendCoords() {
        let coords = new Coords(0,0);
        this.area.path.push(coords);
        this.appendCoordsToForm(coords);
    }

    removeCoord(index: number) {
        let path = <FormArray>this.areaForm.controls['path'];

        this.area.path.splice(index, 1);
        path.removeAt(index);
    }

    private appendCoordsToForm(coords: Coords) {
        let path = <FormArray>this.areaForm.controls['path'];

        let coord = new FormGroup({
            lat: new FormControl(coords.lat, [Validators.required]),
            lng: new FormControl(coords.lng, [Validators.required])
        });

        path.push(coord);

        let coordsIndex = path.length - 1;

        coord.valueChanges.subscribe(value => {
            this.area.path[coordsIndex].lat = +value.lat;
            this.area.path[coordsIndex].lng = +value.lng;
        });
    }


    private initialize() {
        this.mapService.provider.setDrawnObjectsVisibility(false);

        this.setupFormChangeHandlers();

        this.mapService.provider.addOrUpdatePhantom(this.area);

        this.setupMapPhantomCoordsListener();
    }

    private close() {
        this.mapService.provider.deletePhantom(this.area.uuid);

        this.mapService.provider.setDrawnObjectsVisibility(true);

        this.messageBus.publish(new SimpleMessage(MessageNames.MapDeactivatePopup));
    }


    private getCopyOfExistingArea(uuid: string): Area {
        let originArea = <Area>this.mapStore.entity.getObject(uuid);

        if (!originArea) {
            throw new Error('Area not found');
        }

        let area = new Area();
        area.copyFrom(originArea);

        return area;
    }

    private setupFormChangeHandlers() {
        this.areaForm.controls['title'].valueChanges.subscribe(newTitle => {
            this.area.title = newTitle
        });

        this.areaForm.controls['description'].valueChanges.subscribe(newDescription => {
            this.area.description = newDescription;
        });

        this.areaForm.valueChanges.subscribe(() => {
            if (this.areaForm.valid) {
                this.mapService.provider.addOrUpdatePhantom(this.area);
            }
        });
    }

    private setupMapPhantomCoordsListener() {
        let listenerId = this.messageBus.listen([MessageNames.MapPhantomAreaPathChanged],
            (observable: Observable<Message<PhantomAreaPathChangedEventArgs>>) => {
                return observable
                    .pipe(
                        filter(x => x.payload.uuid === this.area.uuid)
                    )
                    .subscribe(message => {
                        this.synchronizePaths(message.payload.path);
                    });
            });

        this.listeners.push(listenerId);
    }

    private removeExcessAreaPathCoords(amountOfRemovingItems: number) {
        for (let i = 0; i < amountOfRemovingItems; i++) {
            this.removeCoord(this.area.path.length - 1);
        }
    }

    private addMissingAreaPathCoords(amountOfMissingItems: number) {
        for (let i = 0; i < amountOfMissingItems; i++) {
            this.appendCoords();
        }
    }

    private updateModelPath(path: Coords[]) {
        path.forEach((value, index) => {
            this.area.path[index].lat = value.lat;
            this.area.path[index].lng = value.lng;

            let pathArray = <FormArray>this.areaForm.controls['path'];
            pathArray.at(index).patchValue(value, {emitEvent: false});
        });

        this.areaForm.patchValue({},{emitEvent: true});
    }

    private synchronizePaths(path: Coords[]) {
        if (path.length < this.area.path.length) {
            this.removeExcessAreaPathCoords(this.area.path.length - path.length);
        } else if (path.length > this.area.path.length) {
            this.addMissingAreaPathCoords(path.length - this.area.path.length);
        }

        this.updateModelPath(path);
    }

    private addMissingFormPathCoords(path: Coords[]) {
        let formPath = <FormArray>this.areaForm.controls['path'];
        for (let i = formPath.length; i<path.length; i++) {
            this.appendCoordsToForm(path[i]);
        }
    }

    async draw() {
        this.mapService.provider.setPhantomsVisibility(false);

        let path = await this.mapService.provider.drawPath();
        this.synchronizePaths(path);

        this.mapService.provider.setPhantomsVisibility(true);
    }
}
