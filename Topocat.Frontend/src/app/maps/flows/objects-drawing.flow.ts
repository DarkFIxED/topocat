import {Injectable} from '@angular/core';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {EntityActions} from '@datorama/akita';
import {combineLatest} from 'rxjs';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {MapRenderingService} from '../services/map-rendering.service';
import {DataFlow} from '../../core/services/data.flow';
import {MapProviderService} from '../services/map-provider.service';
import {DrawnObjectsStore} from '../stores/drawn-objects.store';
import {MapObjectsService} from '../services/map-objects.service';

@Injectable()
export class ObjectsDrawingFlow extends BaseDestroyable implements DataFlow {

    constructor(private mapObjectsQuery: MapObjectsQuery,
                private drawingService: MapRenderingService,
                private mapProviderService: MapProviderService,
                private drawnObjectsStore: DrawnObjectsStore,
                private mapObjectsService: MapObjectsService) {
        super();
    }

    setUp() {
        this.drawAddedObjects();
        this.redrawUpdatedObjects();
        this.clearRemovedObjects();
        this.drawInfoWindow();
        this.searchByTags();
    }

    private drawAddedObjects() {
        const addedEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Add)
            .pipe(
                map(ids => this.mapObjectsQuery.getAll().filter(model => ids.some(id => id === model.id)))
            );

        combineLatest(this.mapProviderService.provider$, addedEntities$)
            .pipe(
                tap(results => this.drawingService.drawMany(results[1]))
            )
            .subscribe();
    }

    private redrawUpdatedObjects() {
        const updatedEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Update)
            .pipe(
                map(ids => this.mapObjectsQuery.getAll().filter(model => ids.some(id => id === model.id)))
            );

        combineLatest(this.mapProviderService.provider$, updatedEntities$)
            .pipe(
                tap(results => this.drawingService.updateMany(results[1]))
            )
            .subscribe();
    }

    private clearRemovedObjects() {
        const removedEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Remove);

        combineLatest(this.mapProviderService.provider$, removedEntities$)
            .pipe(
                tap(results => this.drawingService.removeMany(results[1]))
            )
            .subscribe();
    }

    private drawInfoWindow() {
        this.mapProviderService.provider$.pipe(
            tap(provider => {
                provider.openDetailsRequired$
                    .pipe(
                        tap(id => this.mapObjectsService.openPropertiesWindow(id)),
                        takeUntil(this.componentAlive$)
                    ).subscribe();
            }),
            takeUntil(this.componentAlive$)
        ).subscribe();

        const active$ = this.mapObjectsQuery.selectActiveId().pipe(
            switchMap(id => this.mapObjectsQuery.selectEntity(id))
        );

        combineLatest(this.mapProviderService.provider$, active$)
            .pipe(
                filter(results => !!results[1]),
                tap(results => {
                    const provider = results[0];
                    const mapObject = results[1];

                    const unifiedMapObject = this.drawnObjectsStore.drawnObjects.find(x => x.id === mapObject.id);
                    provider.openInfoWindow(mapObject, unifiedMapObject);
                })
            )
            .subscribe();
    }

    private searchByTags() {
        this.mapProviderService.provider$.pipe(
            tap(provider => {
                provider.tagSearchRequired$
                    .pipe(
                        tap(tag => this.mapObjectsService.setSearchString(`#${tag}`)),
                        takeUntil(this.componentAlive$)
                    ).subscribe();
            }),
            takeUntil(this.componentAlive$)
        ).subscribe();
    }
}
