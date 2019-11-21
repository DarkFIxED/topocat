import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {MapState, MapStore} from '../stores/map.store';
import {MapModel} from '../models/map.model';

@Injectable()
export class MapQuery extends QueryEntity<MapState, MapModel> {

    position$ = this.select(state => state.position);

    constructor(protected store: MapStore) {
        super(store);
    }
}
