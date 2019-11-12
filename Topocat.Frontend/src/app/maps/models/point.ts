import {UnifiedMapObject} from './unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';

export class Point implements UnifiedMapObject {
    id: ID;

    private point: google.maps.Marker;

    constructor(id: ID, opts?: any) {
        this.id = id;
        this.point = new google.maps.Marker(opts);
    }


    clear() {
        this.point.setMap(null);
    }

    update(object: MapObjectModel) {
        this.point.setTitle(object.title);
    }

}
