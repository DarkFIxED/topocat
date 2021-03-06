import {UnifiedMapObject} from '../../../maps/providers/unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from '../../../maps/models/map-object.model';
import {google} from 'google-maps';
import {Coordinates} from '../../../core/models/coordinates';
import {WktPrimitives} from '../../../maps/models/wkt-primitives';
import {GoogleUnifiedMapObject} from './google-unified-map-object';

export class GoogleLine extends GoogleUnifiedMapObject<google.maps.Polyline> implements UnifiedMapObject {

    constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);

        this.underlyingObject.getPath().addListener('insert_at', () => this.handlePathChanged());
        this.underlyingObject.getPath().addListener('remove_at', () => this.handlePathChanged());
        this.underlyingObject.getPath().addListener('set_at', () => this.handlePathChanged());
        this.underlyingObject.addListener('dragend', () => this.handlePathChanged());
    }

    dispose() {
        this.underlyingObject.unbindAll();
        this.underlyingObject.setMap(null);
    }

    getType(): string {
        return WktPrimitives.LineString;
    }

    update(object: MapObjectModel, newCoords: Coordinates[]) {
        this.underlyingObject.setOptions({
            path: newCoords.map(coords => new google.maps.LatLng(coords.lat, coords.lng))
        });
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

    getUnderlyingObject(): any {
        return this.underlyingObject;
    }
}
