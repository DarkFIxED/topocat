import {EntityState, EntityStore, EntityUIStore, ID, StoreConfig} from '@datorama/akita';
import {MapObjectModel} from '../models/map-object.model';
import {Injectable} from '@angular/core';

export interface MapObjectUI {
}

export interface MapObjectsUIState extends EntityState<MapObjectUI> {
}

export interface MapObjectsState extends EntityState<MapObjectModel> {
    drawing: {
        isEnabled: boolean,
        result: boolean,
    };
    editing: {
        mapObjectId: ID
    };
    adding: boolean;
}

function initialState(): Partial<MapObjectsState> {
    return {
        loading: false,
        drawing: {
            isEnabled: false,
            result: false,
        },
        editing: {
            mapObjectId: undefined
        },
        adding: false
    };
}

@Injectable()
@StoreConfig({name: 'map-objects'})
export class MapObjectsStore extends EntityStore<MapObjectsState, MapObjectModel> {

    ui: EntityUIStore<MapObjectsUIState, MapObjectUI>;

    constructor() {
        super(initialState());
        this.createUIStore();
    }
}
