import {UnifiedMapObject} from '../unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from '../../models/map-object.model';
import {Coordinates} from '../../../core/models/coordinates';
import {WktPrimitives} from '../../models/wkt-primitives';
import {GoogleUnifiedMapObject} from './google-unified-map-object';

export class GooglePoint extends GoogleUnifiedMapObject<google.maps.Marker> implements UnifiedMapObject {

    constructor(id: ID, opts?: any) {
        super(id, opts);

        this.underlyingObject.addListener('dragend', () => {
            const position = this.underlyingObject.getPosition();
            const coordinates = new Coordinates(position.lat(), position.lng());
            this.drag.next(coordinates);
        });
    }

    // TODO: to provider.
    dispose() {
        this.underlyingObject.unbindAll();
    }

    getType(): string {
        return WktPrimitives.Point;
    }

    update(object: MapObjectModel, newCoords: Coordinates) {
        this.underlyingObject.setOptions({
            position: new google.maps.LatLng(newCoords.lat, newCoords.lng),
            title: object.title,
        });
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

    allowChange() {
        this.underlyingObject.setOptions({
            draggable: true
        });
    }

    disallowChange() {
        this.underlyingObject.setOptions({
            draggable: true
        });
    }

    getUnderlyingObject(): any {
        return this.underlyingObject;
    }
}
