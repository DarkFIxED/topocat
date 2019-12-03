import {UnifiedMapObject} from './unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {BaseUnifiedMapObject} from './base-unified-map-object';
import {Coordinates} from '../../core/models/coordinates';

export class Point extends BaseUnifiedMapObject<google.maps.Marker> implements UnifiedMapObject {

    constructor(id: ID, opts?: any) {
        super(id, opts);

        this.underlyingObject.addListener('dragend', () => {
            const position = this.underlyingObject.getPosition();
            const coordinates = new Coordinates(position.lat(), position.lng());
            this.drag.next(coordinates);
        });
    }

    dispose() {
        this.underlyingObject.unbindAll();
        this.underlyingObject.setMap(null);
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
}
