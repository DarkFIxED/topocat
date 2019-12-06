import {Injectable} from '@angular/core';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {takeUntil, tap} from 'rxjs/operators';
import {MapObjectModel} from '../models/map-object.model';
import {MapObjectsService} from './map-objects.service';
import {DrawnObjectsStore} from '../stores/drawn-objects.store';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {ID} from '@datorama/akita';
import {WktService} from './wkt.service';
import {MapProviderService} from './map-provider.service';

@Injectable()
export class MapRenderingService extends BaseDestroyable {

    constructor(private drawnObjectsStore: DrawnObjectsStore,
                private mapObjectsQuery: MapObjectsQuery,
                private mapObjectsService: MapObjectsService,
                private mapProviderService: MapProviderService,
                private wktService: WktService) {
        super();
        this.initialize();
    }

    private initialize() {
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

    drawMany(objects: MapObjectModel[]) {
        objects.forEach(object => this.draw(object));
    }

    clearAll() {
        if (this.drawnObjectsStore.drawnObjects.length === 0) {
            return;
        }

        const objects = [...this.drawnObjectsStore.drawnObjects];
        const provider = this.mapProviderService.getProvider();

        objects.forEach(object => {
            this.drawnObjectsStore.remove(object.id);
            provider.removeObjectFromMap(object);
        });
    }

    draw(object: MapObjectModel) {
        const unifiedMapObject = this.mapProviderService.getProvider().unifiedObjectsFactory.build(object);
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
        const foundObjects = [...this.drawnObjectsStore.drawnObjects.filter(x => ids.includes(x.id))];
        const provider = this.mapProviderService.getProvider();

        foundObjects.forEach(object => {
            this.drawnObjectsStore.remove(object.id);
            provider.removeObjectFromMap(object);
        });
    }
}
