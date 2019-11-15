import {BaseDestroyable} from '../../core/services/base-destroyable';
import {DataFlow} from '../../core/services/data.flow';
import {Injectable} from '@angular/core';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {Subject} from 'rxjs';
import {MapObjectModel} from '../models/map-object.model';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material';
import {EditMapObjectComponent} from '../dialogs/edit-map-object/edit-map-object.component';
import {DialogResult} from '../../core/models/dialog-result';
import {SelectNewObjectTypeComponent} from '../dialogs/select-new-object-type/select-new-object-type.component';
import {MapObjectHelper} from '../helpers/map-object.helper';
import {MapService} from '../services/map.service';

@Injectable()
export class CreateMapObjectFlow extends BaseDestroyable implements DataFlow {

    constructor(private mapObjectsQuery: MapObjectsQuery,
                private matDialog: MatDialog,
                private mapService: MapService) {
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
            tap(model => console.log(model))
        ).subscribe();
    }

    private openTypeDialog(): MatDialogRef<SelectNewObjectTypeComponent, DialogResult<string>> {
        return this.matDialog.open(SelectNewObjectTypeComponent, {
            width: '450px',
            hasBackdrop: true,
            disableClose: true
        });
    }
}
