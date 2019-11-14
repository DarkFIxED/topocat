import {ActiveState, EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {MapObjectModel} from '../models/map-object.model';
import {Injectable} from '@angular/core';

export interface MapObjectsState extends EntityState<MapObjectModel>, ActiveState {
    ui: {
        editingObject?: {
            model: MapObjectModel,
            drawing: boolean,
            isNew: boolean
        }
    };
}

function initialState(): Partial<MapObjectsState> {
    return {
        loading: false,
        ui: {
            editingObject: undefined
        }
    };
}

@Injectable()
@StoreConfig({name: 'map-objects'})
export class MapObjectsStore extends EntityStore<MapObjectsState, MapObjectModel> {
    constructor() {
        super(initialState());
    }
}
