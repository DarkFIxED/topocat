import {UnifiedMapObject} from './unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {BaseUnifiedMapObject} from './base-unified-map-object';
import {google} from 'google-maps';
import {Coordinates} from '../../core/models/coordinates';

export class Polygon extends BaseUnifiedMapObject<google.maps.Polygon> implements UnifiedMapObject {

    constructor(id: ID, opts?: any) {
        super(id, opts);

        this.underlyingObject.getPaths().addListener('insert_at', () => this.handlePathsChanged());
        this.underlyingObject.getPaths().addListener('remove_at', () => this.handlePathsChanged());
        this.underlyingObject.getPaths().addListener('set_at', () => this.handlePathsChanged());

        this.underlyingObject.getPaths().getArray().forEach(path => {
            path.addListener('insert_at', () => this.handlePathsChanged());
            path.addListener('remove_at', () => this.handlePathsChanged());
            path.addListener('set_at', () => this.handlePathsChanged());
        });

        this.underlyingObject.addListener('dragend', () => this.handlePathsChanged());
    }

    dispose() {
        this.underlyingObject.unbindAll();
        this.underlyingObject.setMap(null);
    }

    update(object: MapObjectModel, newCoords: Coordinates[][]) {
        this.underlyingObject.setOptions({
            paths: newCoords.map(path => path.map(coords => new google.maps.LatLng(coords.lat, coords.lng)))
        });
    }

    protected createInstance(opts?: any): google.maps.Polygon {
        return new google.maps.Polygon(opts);
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
            fillOpacity: 0.2,
            clickable: false
        });
    }

    enable() {
        this.underlyingObject.setOptions({
            strokeOpacity: 1,
            fillOpacity: 1,
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

    private handlePathsChanged() {
        const paths = this.underlyingObject.getPaths().getArray().map(path => path.getArray().map(latLng => new Coordinates(latLng.lat(), latLng.lng())));
        this.drag.next(paths);
    }
}
