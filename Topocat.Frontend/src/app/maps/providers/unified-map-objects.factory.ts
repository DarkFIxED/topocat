import {MapObjectModel} from '../models/map-object.model';
import {UnifiedMapObject} from '../models/unified-map-object';

export interface UnifiedMapObjectsFactory {
    build(mapObject: MapObjectModel): UnifiedMapObject;
}
