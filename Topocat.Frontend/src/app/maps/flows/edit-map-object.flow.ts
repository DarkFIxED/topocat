import {Injectable} from '@angular/core';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {EditMapObjectComponent} from '../dialogs/edit-map-object/edit-map-object.component';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MapObjectsService} from '../services/map-objects.service';
import {MapsHttpService} from '../../auth-core/services/maps.http.service';
import {MapQuery} from '../queries/map.query';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {MapsSignalRService} from '../services/maps.signal-r.service';
import {MapObjectModel} from '../models/map-object.model';
import {DialogResult} from '../../core/models/dialog-result';
import {iif, Observable, of, Subject} from 'rxjs';
import {MapObjectsDrawingService} from '../services/map-objects-drawing.service';
import {DataFlow} from '../../core/services/data.flow';
import {MapObjectHelper} from '../helpers/map-object.helper';
import {EditObjectTypesActions} from '../models/edit-object-types-actions';
import {ConfirmationComponent} from '../../core/dialogs/confirmation/confirmation.component';

@Injectable()
export class EditMapObjectFlow extends BaseDestroyable implements DataFlow {

    private openEditDialog$ = new Subject<{ source: MapObjectModel, changed: MapObjectModel }>();
    private openRemoveConfirmationDialog$ = new Subject<{ source: MapObjectModel, changed: MapObjectModel }>();
    private startDraw$ = new Subject<{ source: MapObjectModel, changed: MapObjectModel }>();

    constructor(private mapObjectsQuery: MapObjectsQuery,
                private mapQuery: MapQuery,
                private matDialog: MatDialog,
                private mapObjectsService: MapObjectsService,
                private mapsHttpService: MapsHttpService,
                private mapsSignalRService: MapsSignalRService,
                private mapObjectsDrawingService: MapObjectsDrawingService) {
        super();
    }

    setUp() {
        this.mapObjectsQuery.select(state => state.editing)
            .pipe(
                filter(editing => !!editing),
                map(editing => editing.mapObjectId),
                filter(x => !!x),
                map(objectId => this.mapObjectsQuery.getEntity(objectId)),
                map(object => {
                    return {
                        source: object,
                        changed: MapObjectHelper.copy(object)
                    };
                }),
                tap(data => this.openEditDialog$.next(data))
            )
            .subscribe();

        this.openEditDialog$
            .pipe(
                switchMap(data => this.openEditDialog(data.changed, false)
                    .afterClosed()
                    .pipe(
                        map(dialogResult => {
                            return {
                                source: data.source,
                                dialogResult
                            };
                        })
                    )
                ),
                tap(data => {
                    if (data.dialogResult.isCancelled) {
                        this.cancelEdit(data.source);
                    }
                }),
                filter(data => !data.dialogResult.isCancelled),
                tap(data => {
                    if (data.dialogResult.data.action === EditObjectTypesActions.RedrawRequested) {
                        this.startDraw$.next({source: data.source, changed: data.dialogResult.data.data});
                    }
                    if (data.dialogResult.data.action === EditObjectTypesActions.RemoveRequested) {
                        this.openRemoveConfirmationDialog$.next({source: data.source, changed: data.dialogResult.data.data});
                    }
                }),
                filter(data => data.dialogResult.data.action === EditObjectTypesActions.Finished),
                switchMap(data => this.mapsHttpService.updateMapObject(this.getActualMapId(), data.dialogResult.data.data).pipe(
                    tap(() => {
                        this.mapObjectsService.stopEditMapObjectProcess();
                        this.onEditFinished(data.dialogResult.data.data);
                    })
                )),
                takeUntil(this.componentAlive$)
            )
            .subscribe();

        const drawFinished$ = this.mapObjectsQuery.select(state => state.drawing.isEnabled)
            .pipe(
                filter(enabled => !enabled),
                map(() => this.mapObjectsQuery.getValue().drawing.result)
            );

        this.startDraw$
            .pipe(
                tap(() => this.mapObjectsService.startObjectDrawingProcess()),
                switchMap(model => this.drawUntilConfirmedOrCancelled(model, drawFinished$)),
                tap(data => {
                    if (!data.isConfirmed) {
                        this.cancelEdit(data.source);
                    }
                }),
                filter(data => !!data.isConfirmed),
                map(data => {
                    return {
                        source: data.source,
                        changed: data.changed
                    };
                }),
                tap(data => this.openEditDialog$.next(data))
            ).subscribe();

        this.openRemoveConfirmationDialog$.pipe(
            switchMap(data => this.openRemoveConfirmationDialog().afterClosed()
                .pipe(
                    map(dialogResult => {
                        return {
                            ...data,
                            isCancelled: dialogResult.isCancelled
                        };
                    })
                )),
            switchMap(result => iif(() => result.isCancelled,
                of({source: result.source, changed: result.changed})
                    .pipe(
                        tap(data => this.openEditDialog$.next(data))
                    ),
                of({source: result.source, changed: result.changed}).pipe(
                    tap(() => this.mapObjectsService.stopEditMapObjectProcess()),
                    switchMap(data => this.mapsHttpService.deleteMapObject(this.getActualMapId(), data.source))
                )))
        ).subscribe();

        this.mapsSignalRService.objectUpdated$
            .pipe(
                tap(model => this.mapObjectsService.updateObject(model)),
                takeUntil(this.componentAlive$)
            ).subscribe();

        this.mapsSignalRService.objectRemoved$
            .pipe(
                tap(id => this.mapObjectsService.removeObject(id)),
                takeUntil(this.componentAlive$)
            ).subscribe();

        this.mapsSignalRService.objectAdded$
            .pipe(
                tap(model => this.mapObjectsService.addObject(model)),
                takeUntil(this.componentAlive$)
            ).subscribe();
    }

    private openEditDialog(model: MapObjectModel, isNewObject: boolean): MatDialogRef<EditMapObjectComponent, DialogResult<{ action: EditObjectTypesActions, data: MapObjectModel }>> {
        return this.matDialog.open(EditMapObjectComponent, {
            data: {model, isNewObject},
        });
    }

    private openRemoveConfirmationDialog(): MatDialogRef<ConfirmationComponent, DialogResult<any>> {
        return this.matDialog.open(ConfirmationComponent, {});
    }

    private drawUntilConfirmedOrCancelled(model: { source: MapObjectModel, changed: MapObjectModel }, drawFinished$: Observable<boolean>) {
        return new Promise<{ source: MapObjectModel, changed: MapObjectModel, isConfirmed: boolean }>(resolve => {
            const resultModel = {
                ...model,
                isConfirmed: false
            };

            this.mapObjectsDrawingService.changeFigure(model.changed).pipe(
                tap(newData => {
                    resultModel.changed = newData;
                }),
                takeUntil(drawFinished$)
            ).subscribe();

            const sub = drawFinished$.pipe(
                tap(isConfirmed => {
                    sub.unsubscribe();
                    resultModel.isConfirmed = isConfirmed;
                    this.mapObjectsDrawingService.stopChangeFigure(resultModel.changed);
                    resolve(resultModel);
                })
            ).subscribe();
        });
    }

    private getActualMapId(): string {
        return this.mapQuery.getAll()[0].id.toString();
    }

    private cancelEdit(sourceObject: MapObjectModel) {
        this.mapObjectsService.updateObject(sourceObject);
        this.mapObjectsService.stopEditMapObjectProcess();
        this.mapObjectsService.openPropertiesWindow(sourceObject.id);
    }

    private onEditFinished(modifiedObject: MapObjectModel) {
        this.mapObjectsService.openPropertiesWindow(modifiedObject.id);
    }
}
