import {Injectable} from '@angular/core';
import {google} from 'google-maps';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {EntityActions, ID} from '@datorama/akita';
import {combineLatest, Subject, Subscription} from 'rxjs';
import {filter, switchMap, tap} from 'rxjs/operators';
import {MapObjectModel} from '../models/map-object.model';
import {UnifiedMapObjectsFactory} from '../models/unified-map-objects.factory';
import {UnifiedMapObject} from '../models/unified-map-object';
import {MapService} from './map.service';
import {formatDate} from '@angular/common';

@Injectable()
export class MapObjectsDrawer {

    private drawnObjects: UnifiedMapObject[] = [];
    private drawnObjectsSubscriptions: { id: ID, subscriptions: Subscription[] }[] = [];

    private mapInstance$: Subject<google.maps.Map> = new Subject<google.maps.Map>();
    private infoWindowInstance$: Subject<google.maps.InfoWindow> = new Subject<google.maps.InfoWindow>();

    constructor(private mapObjectsQuery: MapObjectsQuery,
                private mapService: MapService,
                private unifiedMapObjectsFactory: UnifiedMapObjectsFactory) {
        this.drawSetObjects();
        this.drawAddedObjects();
        this.redrawUpdatedObjects();
        this.drawInfoWindow();
    }

    setMap(mapInstance: google.maps.Map) {
        this.mapInstance$.next(mapInstance);

        const infoWindow = new google.maps.InfoWindow();
        infoWindow.addListener('closeclick', () => this.mapService.clearActive());
        this.infoWindowInstance$.next(infoWindow);
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

    private drawInfoWindow() {
        const active$ = this.mapObjectsQuery.selectActiveId().pipe(
            switchMap(id => this.mapObjectsQuery.selectEntity(id))
        );

        combineLatest(this.mapInstance$, this.infoWindowInstance$, active$)
            .pipe(
                filter(results => !!results[2]),
                tap(results => this.showInfoWindow(results[0], results[1], results[2]))
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

        const ids = this.drawnObjects.map(x => x.id);
        ids.forEach(id => this.removeObjectsFromDrawnAndRemoveSubs(id));
    }

    private draw(map: google.maps.Map, object: MapObjectModel) {
        const unifiedMapObject = this.unifiedMapObjectsFactory.build(map, object);
        this.addObjectToDrawn(unifiedMapObject);
    }

    private update(object: MapObjectModel) {
        const foundObject = this.drawnObjects.find(x => x.id === object.id);
        if (!foundObject) {
            throw new Error();
        }

        foundObject.update(object);
    }

    private showInfoWindow(map: google.maps.Map, infoWindow: google.maps.InfoWindow, active: MapObjectModel) {
        const unifiedMapObject = this.drawnObjects.find(x => x.id === active.id);

        const content =
            `<span>Title:&nbsp;${active.title}</span><br>` +
             `<span>Created at:&nbsp;${formatDate(active.createdAt, 'hh:mm dd-MM-yyyy', 'en-US')}</span><br>` +
             `<span>Last modified at:&nbsp;${formatDate(active.lastModifiedAt, 'hh:mm dd-MM-yyyy', 'en-US')}</span>`;

        infoWindow.setContent(content);
        infoWindow.setPosition(unifiedMapObject.getInfoWindowPosition());
        infoWindow.open(map);
    }

    private addObjectToDrawn(unifiedMapObject: UnifiedMapObject) {
        this.drawnObjects.push(unifiedMapObject);
        this.drawnObjectsSubscriptions.push({
            id: unifiedMapObject.id,
            subscriptions: [
                unifiedMapObject.click$.subscribe(id => this.mapService.setActive(id))
            ]
        });
    }

    private removeObjectsFromDrawnAndRemoveSubs(id: ID) {
        const subs = this.drawnObjectsSubscriptions.find(x => x.id === id);
        if (!subs) {
            throw new Error();
        }

        subs.subscriptions.forEach(sub => sub.unsubscribe());
        let index = this.drawnObjectsSubscriptions.indexOf(subs);
        this.drawnObjectsSubscriptions.splice(index, 1);

        index = this.drawnObjects.findIndex(x => x.id === id);
        this.drawnObjects[index].clear();
        this.drawnObjects.splice(index, 1);
    }
}
