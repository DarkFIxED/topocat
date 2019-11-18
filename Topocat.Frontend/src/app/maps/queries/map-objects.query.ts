import {EntityUIQuery, QueryEntity} from '@datorama/akita';
import {MapObjectsState, MapObjectsStore, MapObjectsUIState, MapObjectUI} from '../stores/map-objects.store';
import {Injectable} from '@angular/core';
import {MapObjectModel} from '../models/map-object.model';

@Injectable()
export class MapObjectsQuery extends QueryEntity<MapObjectsState, MapObjectModel> {

    ui: EntityUIQuery<MapObjectsUIState, MapObjectUI>;

    constructor(protected store: MapObjectsStore) {
        super(store);
        this.createUIQuery();
    }
}
