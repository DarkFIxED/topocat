import {Injectable} from '@angular/core';
import {MapStore} from '../stores/map.store';
import {MapObjectsStore} from '../stores/map-objects.store';
import {MapsHttpService} from './maps.http.service';
import {forkJoin} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MapObjectModel} from '../models/map-object.model';
import {ID} from '@datorama/akita';

@Injectable()
export class MapService {

    constructor(private mapStore: MapStore,
                private mapObjectsStore: MapObjectsStore,
                private mapsHttpService: MapsHttpService) {
    }

    load(mapId: string) {

        this.mapStore.setLoading(true);
        this.mapObjectsStore.setLoading(true);

        forkJoin(this.mapsHttpService.getMap(mapId), this.mapsHttpService.getMapObjects(mapId))
            .pipe(
                tap(() => {
                    this.mapStore.setLoading(true);
                    this.mapObjectsStore.setLoading(true);
                }),
                tap(results => {
                    if (!results[0].isSuccessful || !results[1].isSuccessful) {
                        throw new Error();
                    }
                })
            )
            .subscribe(results => {
                    this.mapStore.set([results[0].data]);
                    this.mapObjectsStore.set(results[1].data.mapObjects);
            });
    }

    addObject(object: MapObjectModel) {
        this.mapObjectsStore.add(object);
    }

    setActive(objectId: ID) {
        this.mapObjectsStore.setActive(objectId);
    }

    clearActive() {
        this.mapObjectsStore.setActive(null);
    }

    editMapObject(mapObjectId: ID) {
        this.mapObjectsStore.update({
            ui: {
                editingObjectId: mapObjectId
            }
        });
    }

    resetEditingMapObject() {
        this.mapObjectsStore.update({
            ui: {
                editingObjectId: undefined
            }
        });
    }

    updateObject(model: MapObjectModel) {
        this.mapObjectsStore.upsert(model.id, model);
    }
}
