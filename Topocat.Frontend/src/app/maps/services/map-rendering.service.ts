import {Injectable, NgZone} from '@angular/core';
import {google} from 'google-maps';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {BehaviorSubject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {MapObjectModel} from '../models/map-object.model';
import {UnifiedMapObjectsFactory} from '../models/unified-map-objects.factory';
import {MapObjectsService} from './map-objects.service';
import {MapInstanceService} from './map-instance.service';
import {DrawnObjectsStore} from '../stores/drawn-objects.store';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {ID} from '@datorama/akita';
import {WktService} from './wkt.service';

@Injectable()
export class MapRenderingService extends BaseDestroyable {

    private infoWindowInstance$: BehaviorSubject<google.maps.InfoWindow> = new BehaviorSubject<google.maps.InfoWindow>(undefined);

    constructor(private drawnObjectsStore: DrawnObjectsStore,
                private mapObjectsQuery: MapObjectsQuery,
                private mapObjectsService: MapObjectsService,
                private unifiedMapObjectsFactory: UnifiedMapObjectsFactory,
                private mapInstanceService: MapInstanceService,
                private wktService: WktService,
                private zone: NgZone) {
        super();
        this.initialize();
    }

    private initialize() {
        this.mapInstanceService.mapInstance$.pipe(
            filter(instance => !!instance),
            tap(() => {
                const infoWindow = new google.maps.InfoWindow();
                infoWindow.addListener('closeclick', () => {
                    this.mapObjectsService.clearActiveObject();

                    // @ts-ignore
                    window.onDetailsClick = undefined;
                });
                this.infoWindowInstance$.next(infoWindow);
            })
        ).subscribe();

        this.drawnObjectsStore.objectAdded$
            .pipe(
                tap(object => {
                    const subs = object.click$.subscribe(id => this.mapObjectsService.setActiveObject(id));
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

        const newCoords = this.wktService.getWktCoords(object.wktString);
        foundObject.update(object, newCoords);
    }

    removeMany(ids: ID[]) {
        ids.forEach(id => this.drawnObjectsStore.remove(id));
    }

    showInfoWindow(map: google.maps.Map, active: MapObjectModel) {
        const infoWindow = this.infoWindowInstance$.getValue();
        const unifiedMapObject = this.drawnObjectsStore.drawnObjects.find(x => x.id === active.id);

        const self = this;
        // @ts-ignore
        window.onDetailsClick = function() {
            self.zone.run(() => {
                self.mapObjectsService.openPropertiesWindow(active.id);
            });
        };

        const description = !active.description
            ? ''
            : active.description;

        let content =
            `<div class="info-window-content">` +
                `<span class="text-overflow d-inline-block info-window-row" title="${active.title}">${active.title}</span><br>`;

        if (!!description) {
            content += `<span class="text-overflow d-inline-block info-window-row" title="${active.description}">${active.description}</span><br>`;
        }


        content += `<div class="d-flex mt-1">` +
                        `<button class="ml-auto float-right info-window-open-properties-button mdi mdi-map-marker-question-outline" ` +
                             `title="Details..." ` +
                             `onClick="window.onDetailsClick()">Details...</button>` +
                    `</div>` +
            `</div>`;

        infoWindow.setContent(content);
        infoWindow.setPosition(unifiedMapObject.getInfoWindowPosition());
        infoWindow.open(map);
    }
}
