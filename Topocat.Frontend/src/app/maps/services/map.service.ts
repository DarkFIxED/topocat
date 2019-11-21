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

    reset() {
        this.mapStore.reset();
        this.mapStore.set([]);
        this.mapObjectsStore.reset();
        this.mapObjectsStore.set([]);
    }

    load(mapId: string) {

        this.mapStore.setLoading(true);
        this.mapObjectsStore.setLoading(true);

        forkJoin(this.mapsHttpService.getMap(mapId), this.mapsHttpService.getMapObjects(mapId))
            .pipe(
                tap(() => {
                    this.mapStore.setLoading(false);
                    this.mapObjectsStore.setLoading(false);
                }),
                tap(results => {
                    if (!results[0].isSuccessful || !results[1].isSuccessful) {
                        throw new Error();
                    }
                })
            )
            .subscribe(results => {
                this.mapStore.set([results[0].data.map]);
                this.mapObjectsStore.upsertMany(results[1].data.mapObjects);
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

    editMapObject(mapObject: MapObjectModel) {
        this.mapObjectsStore.update({
            editing: {
                mapObjectId: mapObject.id
            }
        });
    }

    stopEditMapObject() {
        this.mapObjectsStore.update({
            editing: {
                mapObjectId: undefined
            }
        });
    }

    addNewMapObject() {
        this.mapObjectsStore.update({
            adding: true
        });
    }

    stopAddNewMapObject() {
        this.mapObjectsStore.update({
            adding: false
        });
    }

    startDrawing() {
        this.mapObjectsStore.update({
            drawing: {
                isEnabled: true,
                result: false,
            }
        });
    }

    stopDrawing(isSuccessful: boolean) {
        this.mapObjectsStore.update({
            drawing: {
                result: isSuccessful,
                isEnabled: false,
            }
        });
    }

    updateObject(model: MapObjectModel) {
        this.mapObjectsStore.upsert(model.id, model);
    }

    removeObject(id: ID) {
        this.mapObjectsStore.remove(id);
    }
}
