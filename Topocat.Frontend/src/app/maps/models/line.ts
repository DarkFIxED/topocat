import {UnifiedMapObject} from './unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {google} from 'google-maps';

export class Line implements UnifiedMapObject  {
    id: ID;

    private line: google.maps.Polyline;

    constructor(id: ID, opts?: any) {
        this.line = new google.maps.Polyline(opts);
        this.id = id;
    }

    clear() {
        this.line.setMap(null);
    }

    update(object: MapObjectModel) {
    }

}
