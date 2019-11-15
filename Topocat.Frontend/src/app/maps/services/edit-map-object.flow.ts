import {Injectable} from '@angular/core';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {EditMapObjectComponent} from '../dialogs/edit-map-object/edit-map-object.component';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MapService} from './map.service';
import {MapsHttpService} from './maps.http.service';
import {MapQuery} from '../queries/map.query';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {MapsSignalRService} from './maps.signal-r.service';
import {MapObjectModel} from '../models/map-object.model';
import {DialogResult} from '../../core/models/dialog-result';
import {iif, of} from 'rxjs';
import {NewMapObjectsDrawer} from './new-map-objects.drawer';
import {DataFlow} from '../../core/services/data.flow';

@Injectable()
export class EditMapObjectFlow extends BaseDestroyable implements DataFlow {

    private openedEditDialog: MatDialogRef<EditMapObjectComponent, DialogResult<MapObjectModel>>;

    constructor(private mapObjectsQuery: MapObjectsQuery,
                private mapQuery: MapQuery,
                private matDialog: MatDialog,
                private mapService: MapService,
                private mapsHttpService: MapsHttpService,
                private mapsSignalRService: MapsSignalRService,
                private newMapObjectsDrawer: NewMapObjectsDrawer) {
        super();
    }

    setUp() {

        this.mapObjectsQuery.select(state => state.editing)
            .pipe(
                filter(editing => !!editing),
                map(editing => editing.mapObjectId),
                filter(x => !!x),
                map(objectId => this.mapObjectsQuery.getEntity(objectId)),
                map(model => this.openDialog(model)),
                switchMap(dialog => dialog.afterClosed()),
                filter(dialogResult => !dialogResult.isInterrupted),
                tap(() => this.mapService.resetEditingMapObject()),
                switchMap(dialogResult => iif(() => dialogResult.isCancelled, of<MapObjectModel>(undefined), of(dialogResult.data))),
                filter(data => !!data),
                switchMap(data => this.mapsHttpService.updateMapObject(this.mapQuery.getAll()[0].id.toString(), data)),
                takeUntil(this.componentAlive$)
            )
            .subscribe();

        this.mapObjectsQuery.select(state => state.drawing)
            .pipe(
                filter(value => !!value),
                map(() => this.mapObjectsQuery.getValue().editing.mapObjectId),
                map(objectId => this.mapObjectsQuery.getEntity(objectId)),
                tap(() => this.openedEditDialog.close(DialogResult.Interrupt<MapObjectModel>())),
                switchMap(model => this.newMapObjectsDrawer.drawFigure(model)),
                tap(() => this.mapService.resetDrawingMode()),
                tap(model => this.mapService.updateObject(model)),
                tap(model => this.mapService.editMapObject(model))
            )
            .subscribe();

        this.mapsSignalRService.objectUpdated$.pipe(
            tap(model => this.mapService.updateObject(model)),
            takeUntil(this.componentAlive$)
        )
            .subscribe();
    }

    private openDialog(model: MapObjectModel): MatDialogRef<EditMapObjectComponent, DialogResult<MapObjectModel>> {
        this.openedEditDialog = this.matDialog.open(EditMapObjectComponent, {
            width: '450px',
            hasBackdrop: true,
            data: model,
            disableClose: true
        });

        return this.openedEditDialog;
    }
}
