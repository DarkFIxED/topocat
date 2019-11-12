import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {MapModel} from '../models/map.model';

export interface MapState extends EntityState<MapModel> {
}

function initialState(): Partial<MapState> {
    return {
        loading: false,
    };
}

@Injectable()

@StoreConfig({ name: 'map' })
export class MapStore extends EntityStore<MapState, MapModel> {
    constructor() {
        super(initialState());
    }
}
