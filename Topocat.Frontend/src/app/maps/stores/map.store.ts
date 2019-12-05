import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {MapModel} from '../models/map.model';

export interface MapState extends EntityState<MapModel> {
    position: {
        lat: number,
        lng: number,
        zoom: number,
        setManually: boolean
    };
    mapMode: string;
}

function initialState(): Partial<MapState> {
    return {
        loading: false,
        position: {
            lat: 0,
            lng: 0,
            zoom: 5,
            setManually: false
        },
        mapMode: undefined,
    };
}

@Injectable()
@StoreConfig({ name: 'map' })
export class MapStore extends EntityStore<MapState, MapModel> {
    constructor() {
        super(initialState());
    }
}
