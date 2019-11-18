import {Injectable} from '@angular/core';
import {google} from 'google-maps';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {BehaviorSubject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {MapObjectModel} from '../models/map-object.model';
import {UnifiedMapObjectsFactory} from '../models/unified-map-objects.factory';
import {MapService} from './map.service';
import {formatDate} from '@angular/common';
import {MapInstanceService} from './map-instance.service';
import {DrawnObjectsStore} from '../stores/drawn-objects.store';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {ID} from '@datorama/akita';

@Injectable()
export class MapRenderingService extends BaseDestroyable {

    private infoWindowInstance$: BehaviorSubject<google.maps.InfoWindow> = new BehaviorSubject<google.maps.InfoWindow>(undefined);

    constructor(private drawnObjectsStore: DrawnObjectsStore,
                private mapObjectsQuery: MapObjectsQuery,
                private mapService: MapService,
                private unifiedMapObjectsFactory: UnifiedMapObjectsFactory,
                private mapInstanceService: MapInstanceService) {
        super();
        this.initialize();
    }

    private initialize() {
        this.mapInstanceService.mapInstance$.pipe(
            filter(instance => !!instance),
            tap(() => {
                const infoWindow = new google.maps.InfoWindow();
                infoWindow.addListener('closeclick', () => this.mapService.clearActive());
                this.infoWindowInstance$.next(infoWindow);
            })
        ).subscribe();

        this.drawnObjectsStore.objectAdded$
            .pipe(
                tap(object => {
                    const subs = object.click$.subscribe(id => this.mapService.setActive(id));
                    this.drawnObjectsStore.addSubscription(object.id, subs);
                }),
                takeUntil(this.componentAlive$)
            )
            .subscribe();
    }

    updateMany(mapObjects: MapObjectModel[]) {
        mapObjects.forEach(object => this.update(object));
    }

    drawMany(map: google.maps.Map, objects: MapObjectModel[]) {
        objects.forEach(object => this.draw(map, object));
    }

    clearAll() {
        if (this.drawnObjectsStore.drawnObjects.length === 0) {
            return;
        }

        const ids = this.drawnObjectsStore.drawnObjects.map(x => x.id);
        ids.forEach(id => this.drawnObjectsStore.remove(id));
    }

    draw(map: google.maps.Map, object: MapObjectModel) {
        const unifiedMapObject = this.unifiedMapObjectsFactory.build(map, object);
        this.drawnObjectsStore.add(unifiedMapObject);
    }

    update(object: MapObjectModel) {
        const foundObject = this.drawnObjectsStore.drawnObjects.find(x => x.id === object.id);
        if (!foundObject) {
            throw new Error();
        }

        foundObject.update(object);
    }

    removeMany(ids: ID[]) {
        ids.forEach(id => this.drawnObjectsStore.remove(id));
    }

    showInfoWindow(map: google.maps.Map, active: MapObjectModel) {
        const infoWindow = this.infoWindowInstance$.getValue();
        const unifiedMapObject = this.drawnObjectsStore.drawnObjects.find(x => x.id === active.id);

        const content =
            `<span>Title:&nbsp;${active.title}</span><br>` +
            `<span>Created&nbsp;at:&nbsp;${formatDate(active.createdAt, 'hh:mm dd-MM-yyyy', 'en-US')}</span><br>` +
            `<span>Last&nbsp;modified&nbsp;at:&nbsp;${formatDate(active.lastModifiedAt, 'hh:mm dd-MM-yyyy', 'en-US')}</span>`;

        infoWindow.setContent(content);
        infoWindow.setPosition(unifiedMapObject.getInfoWindowPosition());
        infoWindow.open(map);
    }


}
