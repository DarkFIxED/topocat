import {Injectable} from '@angular/core';
import {google} from 'google-maps';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {EntityActions} from '@datorama/akita';
import {combineLatest, Subject} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {MapObjectModel} from '../models/map-object.model';
import {UnifiedMapObjectsFactory} from '../models/unified-map-objects.factory';
import {UnifiedMapObject} from '../models/unified-map-object';

@Injectable()
export class MapObjectsDrawer {

    private drawnObjects: UnifiedMapObject[] = [];

    private mapInstance$: Subject<google.maps.Map> = new Subject<google.maps.Map>();

    private unifiedMapObjectsFactory: UnifiedMapObjectsFactory = new UnifiedMapObjectsFactory();

    constructor(private mapObjectsQuery: MapObjectsQuery) {
        this.drawSetObjects();
        this.drawAddedObjects();
        this.redrawUpdatedObjects();
    }

    setMap(mapInstance: google.maps.Map) {
        this.mapInstance$.next(mapInstance);
    }

    private drawSetObjects() {
        const setEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Set)
            .pipe(
                switchMap(ids => this.mapObjectsQuery.selectMany(ids))
            );

        combineLatest(this.mapInstance$, setEntities$)
            .pipe(
                tap(() => this.clearAll()),
                tap(results => this.drawMany(results[0], results[1]))
            )
            .subscribe();
    }

    private drawAddedObjects() {
        const addedEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Add)
            .pipe(
                switchMap(ids => this.mapObjectsQuery.selectMany(ids))
            );

        combineLatest(this.mapInstance$, addedEntities$)
            .pipe(
                tap(results => this.drawMany(results[0], results[1]))
            )
            .subscribe();
    }

    private redrawUpdatedObjects() {
        const updatedEntities$ = this.mapObjectsQuery.selectEntityAction(EntityActions.Update)
            .pipe(
                switchMap(ids => this.mapObjectsQuery.selectMany(ids))
            );

        combineLatest(this.mapInstance$, updatedEntities$)
            .pipe(
                tap(results => this.updateMany(results[1]))
            )
            .subscribe();
    }

    private updateMany(mapObjects: MapObjectModel[]) {
        mapObjects.forEach(object => this.update(object));
    }

    private drawMany(map: google.maps.Map, objects: MapObjectModel[]) {
        objects.forEach(object => this.draw(map, object));
    }

    private clearAll() {
        if (this.drawnObjects.length === 0) {
            return;
        }

        this.drawnObjects.forEach(object => object.clear());
        this.drawnObjects.splice(0, this.drawnObjects.length);
    }

    private draw(map: google.maps.Map, object: MapObjectModel) {
        const unifiedMapObject = this.unifiedMapObjectsFactory.build(map, object);
        this.drawnObjects.push(unifiedMapObject);
    }

    private update(object: MapObjectModel) {
        const foundObject = this.drawnObjects.find(x => x.id === object.id);
        if (!foundObject) {
            throw new Error();
        }

        foundObject.update(object);
    }
}
