import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {MapObjectModel} from '../models/map-object.model';
import {WktService} from './wkt.service';
import {DrawnObjectsStore} from '../stores/drawn-objects.store';
import {UnifiedMapObject} from '../providers/unified-map-object';
import {MapObjectHelper} from '../helpers/map-object.helper';

@Injectable()
export class MapObjectsDrawingService {
    constructor(private mapObjectsQuery: MapObjectsQuery,
                private wktService: WktService,
                private drawnObjectsStore: DrawnObjectsStore) {
        this.initialize();
    }

    initialize() {
    }

    changeFigure(mapObject: MapObjectModel): Observable<MapObjectModel> {
        let foundObject: UnifiedMapObject;
        this.drawnObjectsStore.drawnObjects.forEach(drawnObject => {
            if (drawnObject.id === mapObject.id) {
                foundObject = drawnObject;
                drawnObject.allowChange();
            } else {
                // TODO: extract. Not in responsibility.
                drawnObject.disable();
            }
        });

        if (!foundObject) {
            throw new Error();
        }

        const type = this.wktService.getWktType(mapObject.wktString);

        // noinspection JSUnusedAssignment
        return foundObject.drag$.pipe(
            map(coords => this.wktService.createWktString(type, coords)),
            map(wktString => {
                return MapObjectHelper.copyWithAnotherWktString(mapObject, wktString);
            })
        );
    }

    stopChangeFigure(mapObject: MapObjectModel) {
        this.drawnObjectsStore.drawnObjects.forEach(drawnObject => {
            if (drawnObject.id === mapObject.id) {
                drawnObject.disallowChange();
            } else {
                // TODO: extract. Not in responsibility.
                drawnObject.enable();
            }
        });
    }
}
