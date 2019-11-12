import {QueryEntity} from '@datorama/akita';
import {MapObjectsState, MapObjectsStore} from '../stores/map-objects.store';
import {Injectable} from '@angular/core';
import {MapObjectModel} from '../models/map-object.model';

@Injectable()
export class MapObjectsQuery extends QueryEntity<MapObjectsState, MapObjectModel> {

    constructor(protected store: MapObjectsStore) {
        super(store);
    }
}
