import {AddEntitiesOptions, EntityState, EntityStore, getIDType, ID, OrArray, StoreConfig} from '@datorama/akita';
import {MapObjectModel} from '../models/map-object.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface MapObjectsState extends EntityState<MapObjectModel> {
    ui: {
        editingObject?: {
            id: ID,
            drawing: boolean
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
