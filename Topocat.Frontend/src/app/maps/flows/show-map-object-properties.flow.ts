import {Injectable} from '@angular/core';
import {DataFlow} from '../../core/services/data.flow';
import {MapService} from '../services/map.service';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MapObjectModel} from '../models/map-object.model';
import {MapObjectPropertiesComponent} from '../dialogs/map-object-properties/map-object-properties.component';
import {DialogResult} from '../../core/models/dialog-result';
import {ShowPropertiesActions} from '../models/show-properties-actions';
import {ID} from '@datorama/akita';

@Injectable()
export class ShowMapObjectPropertiesFlow extends BaseDestroyable implements DataFlow {

    private openedDialog: MatDialogRef<MapObjectPropertiesComponent> = undefined;

    constructor(private mapObjectsQuery: MapObjectsQuery,
                private mapService: MapService,
                private dialog: MatDialog) {
        super();
    }

    setUp() {
        this.mapObjectsQuery.select(state => state.showPropertiesWindow.mapObjectId)
            .pipe(
                filter(mapObjectId => !!mapObjectId),
                map(mapObjectId => this.mapObjectsQuery.getEntity(mapObjectId)),
                map(mapObject => this.openPropertiesDialog(mapObject)),
                switchMap(dialogRef => dialogRef.afterClosed()),
                tap(() => this.mapService.closePropertiesWindow()),
                tap(dialogResult => {
                    if (dialogResult.data.result === ShowPropertiesActions.EditRequested) {
                        const mapObject = this.mapObjectsQuery.getEntity(dialogResult.data.mapObjectId);
                        this.mapService.editMapObject(mapObject);
                    }
                }),
                takeUntil(this.componentAlive$)
            ).subscribe();


        this.mapObjectsQuery.select(state => state.showPropertiesWindow.mapObjectId)
            .pipe(
                filter(mapObjectId => !mapObjectId),
                filter(() => !!this.openedDialog),
                tap(() => this.openedDialog.close(DialogResult.Interrupt())),
                takeUntil(this.componentAlive$)
            ).subscribe();
    }

    private openPropertiesDialog(mapObject: MapObjectModel): MatDialogRef<MapObjectPropertiesComponent, DialogResult<{ result: ShowPropertiesActions, mapObjectId: ID }>> {
        this.openedDialog = this.dialog.open(MapObjectPropertiesComponent, {
            data: {
                model: mapObject
            }
        });

        return this.openedDialog;
    }
}
