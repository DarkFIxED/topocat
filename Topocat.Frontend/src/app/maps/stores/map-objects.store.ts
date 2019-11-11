import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {MapObjectModel} from '../models/map-object.model';
import {Injectable} from '@angular/core';

export interface MapObjectsState extends EntityState<MapObjectModel> {
}

function initialState(): Partial<MapObjectsState> {
    return {
        loading: false
    };
}

@Injectable()
@StoreConfig({ name: 'map-objects' })
export class MapObjectsStore extends EntityStore<MapObjectsState, MapObjectModel> {
    constructor() {
        super(initialState());
    }
}
