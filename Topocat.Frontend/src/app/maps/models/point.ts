import {UnifiedMapObject} from './unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {BaseUnifiedMapObject} from './base-unified-map-object';

export class Point extends BaseUnifiedMapObject<google.maps.Marker> implements UnifiedMapObject {

    constructor(id: ID, opts?: any) {
        super(id, opts);
    }

    dispose() {
        this.underlyingObject.unbindAll();
        this.underlyingObject.setMap(null);
    }

    update(object: MapObjectModel) {
        this.underlyingObject.setTitle(object.title);
    }

    protected createInstance(opts?: any): google.maps.Marker {
        return new google.maps.Marker(opts);
    }

    getInfoWindowPosition(): { lat: number; lng: number } {
        const position = this.underlyingObject.getPosition();
        return {lat: position.lat(), lng: position.lng()};
    }

    disable() {
        this.underlyingObject.setOptions({
            clickable: false,
            opacity: 0.2
        });
    }

    enable() {
        this.underlyingObject.setOptions({
            clickable: true,
            opacity: 1
        });
    }

}
