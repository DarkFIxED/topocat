import {UnifiedMapObject} from './unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {google} from 'google-maps';
import {BaseUnifiedMapObject} from './base-unified-map-object';

export class Line extends BaseUnifiedMapObject<google.maps.Polyline> implements UnifiedMapObject {

    constructor(id: ID, opts?: any) {
        super(id, opts);
    }

    clear() {
        this.underlyingObject.unbindAll();
        this.underlyingObject.setMap(null);
    }

    update(object: MapObjectModel) {
    }

    protected createInstance(opts?: any): google.maps.Polyline {
        return new google.maps.Polyline(opts);
    }

    getInfoWindowPosition(): { lat: number; lng: number } {
        const path = this.underlyingObject.getPath();
        const bounds = new google.maps.LatLngBounds(path[0], path[0]);
        path.forEach(latLng => bounds.extend(latLng));
        const center = bounds.getCenter();

        return {lat: center.lat(), lng: center.lng()};
    }
}
