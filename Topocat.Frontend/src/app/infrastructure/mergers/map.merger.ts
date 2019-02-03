import { Map } from '../../domain/map/map';
import { Injectable } from '@angular/core';
import { MapObject } from '../../domain/map/map-object';

@Injectable()
export class MapMerger {
    merge(oldMap: Map, newMap: Map): void {

        let obsoleteObjects = oldMap.mapObjects.filter(x => !newMap.mapObjects.some(y => y.uuid === x.uuid));
        let newObjects = newMap.mapObjects.filter(x => !oldMap.mapObjects.some(y => y.uuid === x.uuid));
        let changedObjects = newMap.mapObjects.filter(x => oldMap.mapObjects.some(y => y.uuid === x.uuid));

        this.removeObsoleteObjects(oldMap, obsoleteObjects);
        this.addNewObjects(oldMap, newObjects);
        this.updateChangedObjects(oldMap, changedObjects);

    }

    private removeObsoleteObjects(oldMap: Map, obsoleteObjects: MapObject[]) {
        obsoleteObjects.forEach(object => oldMap.deleteObject(object.uuid));
    }

    private addNewObjects(oldMap: Map, newObjects: MapObject[]) {
        newObjects.forEach(object => oldMap.addObject(object));
    }

    private updateChangedObjects(oldMap: Map, changedObjects: MapObject[]) {
        changedObjects.forEach(object => {
            let originObject = oldMap.getObject(object.uuid);

            if (originObject.lastModifiedDate.getTime() < object.lastModifiedDate.getTime()) {
                originObject.merge(object);
            }
        });
    }
}