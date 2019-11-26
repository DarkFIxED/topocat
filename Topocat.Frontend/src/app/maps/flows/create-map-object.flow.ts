import {BaseDestroyable} from '../../core/services/base-destroyable';
import {DataFlow} from '../../core/services/data.flow';
import {Injectable} from '@angular/core';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {Subject} from 'rxjs';
import {MapObjectModel} from '../models/map-object.model';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DialogResult} from '../../core/models/dialog-result';
import {SelectNewObjectTypeComponent} from '../dialogs/select-new-object-type/select-new-object-type.component';
import {MapObjectHelper} from '../helpers/map-object.helper';
import {MapService} from '../services/map.service';
import {MapObjectsDrawingService} from '../services/map-objects-drawing.service';
import {EditMapObjectComponent} from '../dialogs/edit-map-object/edit-map-object.component';
import {EditObjectTypesActions} from '../models/edit-object-types-actions';
import {WktService} from '../services/wkt.service';
import {MapsHttpService} from '../../auth-core/services/maps.http.service';
import {MapQuery} from '../queries/map.query';

@Injectable()
export class CreateMapObjectFlow extends BaseDestroyable implements DataFlow {

    constructor(private mapObjectsQuery: MapObjectsQuery,
                private matDialog: MatDialog,
                private mapService: MapService,
                private mapObjectsDrawingService: MapObjectsDrawingService,
                private wktService: WktService,
                private mapsHttpService: MapsHttpService,
                private mapQuery: MapQuery
                ) {
        super();
    }

    private startDrawing$ = new Subject<{type: string, model: MapObjectModel}>();

    setUp() {
        this.mapObjectsQuery.select(state => state.adding)
            .pipe(
                filter(value => !!value),
                map(() => this.openTypeDialog()),
                switchMap(dialog => dialog.afterClosed()),
                tap(dialogResult => {
                   if (dialogResult.isInterrupted || dialogResult.isCancelled)
                       this.mapService.stopAddNewMapObject();
                }),
                filter(dialogResult => !dialogResult.isCancelled && !dialogResult.isInterrupted),
                map(dialogResult => dialogResult.data),
                map(objectType => {
                    return {type: objectType, model: MapObjectHelper.createNew()};
                }),
                tap(model => this.startDrawing$.next(model)),
                takeUntil(this.componentAlive$)
            ).subscribe();

        this.startDrawing$.pipe(
            switchMap(model => this.mapObjectsDrawingService.drawFigure(model.type, model.model)),
            map(model => this.openEditDialog(model, true)),
            switchMap(dialogRef => dialogRef.afterClosed()),
            tap(dialogResult => {
                if (dialogResult.isCancelled || dialogResult.isInterrupted) {
                    this.mapService.stopAddNewMapObject();
                }
            }),
            filter(dialogResult => !dialogResult.isCancelled && !dialogResult.isCancelled),
            tap(dialogResult => {
                if (dialogResult.data.action === EditObjectTypesActions.RedrawRequested) {
                    this.startDrawing$.next({
                        model: dialogResult.data.data,
                        type: this.wktService.getWktType(dialogResult.data.data.wktString)});
                }
            }),
            filter(dialogResult => dialogResult.data.action !== EditObjectTypesActions.RedrawRequested),
            map(dialogResult => dialogResult.data.data),
            switchMap(mapObjectModel => this.mapsHttpService.createMapObject(this.mapQuery.getAll()[0].id.toString(), mapObjectModel)),
            tap(() => this.mapService.stopAddNewMapObject())
        ).subscribe();
    }

    private openTypeDialog(): MatDialogRef<SelectNewObjectTypeComponent, DialogResult<string>> {
        return this.matDialog.open(SelectNewObjectTypeComponent, {});
    }

    private openEditDialog(model: MapObjectModel, isNewObject: boolean): MatDialogRef<EditMapObjectComponent, DialogResult<{action: EditObjectTypesActions, data: MapObjectModel}>> {
        return this.matDialog.open(EditMapObjectComponent, {
            data: {model, isNewObject}
        });
    }
}
