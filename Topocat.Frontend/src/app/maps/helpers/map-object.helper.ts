import {MapObjectModel} from '../models/map-object.model';

export class MapObjectHelper {
    static copyWithAnotherWktString(mapObject: MapObjectModel, wktString: string): MapObjectModel {
        return {
            ...mapObject,
            wktString
        };
    }
}
