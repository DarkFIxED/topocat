import {MapObjectModel} from '../models/map-object.model';
import {UUID} from 'angular2-uuid';

export class MapObjectHelper {
    static copyWithAnotherWktString(mapObject: MapObjectModel, wktString: string): MapObjectModel {
        return {
            ...mapObject,
            wktString
        };
    }

    static createNew(): MapObjectModel {
        return {
            id: UUID.UUID().toString(),
            title: undefined,
            description: undefined,
            createdAt: new Date(),
            lastModifiedAt: new Date(),
            wktString: undefined
        };
    }

    static copy(mapObject: MapObjectModel): MapObjectModel {
        return {
            ...mapObject
        };
    }
}
