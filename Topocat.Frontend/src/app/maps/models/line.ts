import {UnifiedMapObject} from './unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {google} from 'google-maps';
import {BaseUnifiedMapObject} from './base-unified-map-object';
import {Coordinates} from '../../core/models/coordinates';

export class Line extends BaseUnifiedMapObject<google.maps.Polyline> implements UnifiedMapObject {

    constructor(id: ID, opts?: any) {
        super(id, opts);

        this.underlyingObject.getPath().addListener('insert_at', () => this.handlePathChanged());
        this.underlyingObject.getPath().addListener('remove_at', () => this.handlePathChanged());
        this.underlyingObject.getPath().addListener('set_at', () => this.handlePathChanged());
        this.underlyingObject.addListener('dragend', () => this.handlePathChanged());
    }

    dispose() {
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

    disable() {
        this.underlyingObject.setOptions({
            strokeOpacity: 0.2,
            clickable: false
        });
    }

    enable() {
        this.underlyingObject.setOptions({
            strokeOpacity: 1,
            clickable: true
        });
    }

    allowChange() {
        this.underlyingObject.setOptions({
            editable: true,
            draggable: true
        });
    }

    disallowChange() {
        this.underlyingObject.setOptions({
            editable: false,
            draggable: false
        });
    }

    private handlePathChanged() {
        const path = this.underlyingObject.getPath().getArray().map(latLng => new Coordinates(latLng.lat(), latLng.lng()));
        this.drag.next(path);
    }
}