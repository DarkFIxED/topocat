import {UnifiedMapObject} from './unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';

export class Polygon implements UnifiedMapObject {
    id: ID;

    private polygon: google.maps.Polygon;

    constructor(id: ID, opts?: any) {
        this.id = id;
        this.polygon = new google.maps.Polygon(opts);
    }

    clear() {
        this.polygon.setMap(null);
    }

    update(object: MapObjectModel) {
    }

}
