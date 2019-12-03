import {Injectable} from '@angular/core';
import {MapObjectsStore} from '../stores/map-objects.store';
import {MapsHttpService} from '../../auth-core/services/maps.http.service';
import {tap} from 'rxjs/operators';
import {MapObjectModel} from '../models/map-object.model';
import {ID} from '@datorama/akita';

@Injectable()
export class MapObjectsService {

    constructor(private mapObjectsStore: MapObjectsStore,
                private mapsHttpService: MapsHttpService) {
    }

    reset() {
        this.mapObjectsStore.reset();
        this.mapObjectsStore.set([]);
    }

    load(mapId: string) {
        this.mapObjectsStore.setLoading(true);

        this.mapsHttpService.getMapObjects(mapId)
            .pipe(
                tap(() => this.mapObjectsStore.setLoading(false)),
                tap(result => {
                    if (!result.isSuccessful) {
                        throw new Error();
                    }
                })
            )
            .subscribe(result => {
                this.mapObjectsStore.upsertMany(result.data.mapObjects);
            });
    }

    addObject(object: MapObjectModel) {
        this.mapObjectsStore.add(object);
    }

    updateObject(model: MapObjectModel) {
        this.mapObjectsStore.upsert(model.id, model);
    }

    removeObject(id: ID) {
        this.mapObjectsStore.remove(id);
    }

    setActiveObject(objectId: ID) {
        this.mapObjectsStore.setActive(objectId);
    }

    clearActiveObject() {
        this.mapObjectsStore.setActive(null);
    }

    startEditMapObjectProcess(mapObject: MapObjectModel) {
        this.mapObjectsStore.update({
            editing: {
                mapObjectId: mapObject.id
            }
        });
    }

    stopEditMapObjectProcess() {
        this.mapObjectsStore.update({
            editing: {
                mapObjectId: undefined
            }
        });
    }

    startAddingMapObjectProcess() {
        this.mapObjectsStore.update({
            adding: true
        });
    }

    stopAddingMapObjectProcess() {
        this.mapObjectsStore.update({
            adding: false
        });
    }

    startObjectDrawingProcess() {
        this.mapObjectsStore.update({
            drawing: {
                isEnabled: true,
                result: false,
            }
        });
    }

    stopObjectDrawingProcess(isSuccessful: boolean) {
        this.mapObjectsStore.update({
            drawing: {
                result: isSuccessful,
                isEnabled: false,
            }
        });
    }

    openPropertiesWindow(mapObjectId: ID) {
        this.mapObjectsStore.update({
            showPropertiesWindow: {
                mapObjectId
            }
        });
    }

    closePropertiesWindow() {
        this.mapObjectsStore.update({
            showPropertiesWindow: {
                mapObjectId: undefined
            }
        });
    }
}
