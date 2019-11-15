import {Injectable} from '@angular/core';
import {google} from 'google-maps';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {ID} from '@datorama/akita';
import {BehaviorSubject, Subscription} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {MapObjectModel} from '../models/map-object.model';
import {UnifiedMapObjectsFactory} from '../models/unified-map-objects.factory';
import {UnifiedMapObject} from '../models/unified-map-object';
import {MapService} from './map.service';
import {formatDate} from '@angular/common';
import {MapInstanceService} from './map-instance.service';

@Injectable()
export class MapRenderingService {

    private drawnObjects: UnifiedMapObject[] = [];
    private drawnObjectsSubscriptions: { id: ID, subscriptions: Subscription[] }[] = [];

    private infoWindowInstance$: BehaviorSubject<google.maps.InfoWindow> = new BehaviorSubject<google.maps.InfoWindow>(undefined);

    constructor(private mapObjectsQuery: MapObjectsQuery,
                private mapService: MapService,
                private unifiedMapObjectsFactory: UnifiedMapObjectsFactory,
                private mapInstanceService: MapInstanceService) {
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
        if (this.drawnObjects.length === 0) {
            return;
        }

        const ids = this.drawnObjects.map(x => x.id);
        ids.forEach(id => this.removeObjectsFromDrawnAndRemoveSubs(id));
    }

    draw(map: google.maps.Map, object: MapObjectModel) {
        const unifiedMapObject = this.unifiedMapObjectsFactory.build(map, object);
        this.addObjectToDrawn(unifiedMapObject);
    }

    update(object: MapObjectModel) {
        const foundObject = this.drawnObjects.find(x => x.id === object.id);
        if (!foundObject) {
            throw new Error();
        }

        foundObject.update(object);
    }

    showInfoWindow(map: google.maps.Map, active: MapObjectModel) {
        const infoWindow = this.infoWindowInstance$.getValue();
        const unifiedMapObject = this.drawnObjects.find(x => x.id === active.id);

        const content =
            `<span>Title:&nbsp;${active.title}</span><br>` +
             `<span>Created&nbsp;at:&nbsp;${formatDate(active.createdAt, 'hh:mm dd-MM-yyyy', 'en-US')}</span><br>` +
             `<span>Last&nbsp;modified&nbsp;at:&nbsp;${formatDate(active.lastModifiedAt, 'hh:mm dd-MM-yyyy', 'en-US')}</span>`;

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
