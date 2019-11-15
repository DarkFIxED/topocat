import {Injectable} from '@angular/core';
import {filter, switchMap, tap} from 'rxjs/operators';
import {EntityActions} from '@datorama/akita';
import {combineLatest} from 'rxjs';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {MapInstanceService} from './map-instance.service';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {MapRenderingService} from './map-rendering.service';
import {DataFlow} from '../../core/services/data.flow';

@Injectable()
export class ObjectsDrawingFlow extends BaseDestroyable implements DataFlow {

    private map$ = this.mapInstanceService.mapInstance$.pipe(
        filter(map => !!map)
    );

    constructor(private mapInstanceService: MapInstanceService,
                private mapObjectsQuery: MapObjectsQuery,
                private drawingService: MapRenderingService) {
        super();
    }

    setUp() {
        this.drawAddedObjects();
        this.drawSetObjects();
        this.redrawUpdatedObjects();
        this.drawInfoWindow();
    }

    private drawSetObjects() {
        const setEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Set)
            .pipe(
                switchMap(ids => this.mapObjectsQuery.selectMany(ids))
            );

        combineLatest(this.map$, setEntities$)
            .pipe(
                tap(() => this.drawingService.clearAll()),
                tap(results => this.drawingService.drawMany(results[0], results[1]))
            )
            .subscribe();
    }

    private drawAddedObjects() {
        const addedEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Add)
            .pipe(
                switchMap(ids => this.mapObjectsQuery.selectMany(ids))
            );

        combineLatest(this.map$, addedEntities$)
            .pipe(
                tap(results => this.drawingService.drawMany(results[0], results[1]))
            )
            .subscribe();
    }

    private redrawUpdatedObjects() {
        const updatedEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Update)
            .pipe(
                switchMap(ids => this.mapObjectsQuery.selectMany(ids))
            );

        combineLatest(this.map$, updatedEntities$)
            .pipe(
                tap(results => this.drawingService.updateMany(results[1]))
            )
            .subscribe();
    }

    private drawInfoWindow() {
        const active$ = this.mapObjectsQuery.selectActiveId().pipe(
            switchMap(id => this.mapObjectsQuery.selectEntity(id))
        );

        combineLatest(this.map$, active$)
            .pipe(
                filter(results => !!results[1]),
                tap(results => this.drawingService.showInfoWindow(results[0], results[1]))
            )
            .subscribe();
    }
}
