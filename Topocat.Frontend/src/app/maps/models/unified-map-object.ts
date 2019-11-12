import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';

export interface UnifiedMapObject {
    id: ID;

    clear();

    update(object: MapObjectModel);

}
